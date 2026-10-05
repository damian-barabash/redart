import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { asset } from '../../lib/asset'

// Cel wiązek leży PRZED belką (bliżej kamery): głowy odwracają się soczewkami do widza, a nie tyłem.
// Żeby na ekranie wiązki dalej schodziły się na logo, współrzędne celu skalujemy perspektywą (AIM_K).
const CAM_Z = 9
const AIM_Z = 1.7
const AIM_K = (CAM_Z - AIM_Z) / CAM_Z

// Wskaźnik w układzie hero: x,y ∈ [-1,1]; `at` — czas ostatniego ruchu.
export type Pointer = { x: number; y: number; at: number }

// Rząd reflektorów podwieszonych na belce. Liczba zależy od szerokości kadru (px).
const fixtureCount = (px: number) => (px >= 1100 ? 10 : px >= 700 ? 7 : 5)
const MODELS = ['aura', 'pointe', 'beam-red', 'wash37'] as const
const WHITE = ['#fff4e6', '#eef3ff']
const RED = '#ff2a33'

type FixtureDef = { model: string; color: string; red: boolean; yaw: number; slot: number; count: number }

const beamVertex = /* glsl */ `
  uniform float uLen; uniform float uR0; uniform float uR1;
  varying float vT; varying float vRim;
  void main() {
    vT = position.z;
    float r = mix(uR0, uR1, vT);
    vec3 p = vec3(position.xy * r, position.z * uLen);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * vec3(position.xy, 0.0));
    vRim = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`
const beamFragment = /* glsl */ `
  uniform vec3 uColor; uniform float uIntensity;
  varying float vT; varying float vRim;
  void main() {
    float along = smoothstep(0.0, 0.04, vT) * pow(1.0 - vT, 1.35);
    float a = pow(vRim, 1.6) * along * uIntensity;
    gl_FragColor = vec4(uColor * a, 0.0); // alfa 0 + blending ONE/ONE = czyste dodawanie światła na wideo pod canvasem
  }
`

type View = { width: number; height: number }
const fixtureSize = (v: View, n: number) => Math.min(v.height * 0.2, (v.width * 0.96) / (n * 1.08))
const trussY = (v: View, n: number) => v.height / 2 - fixtureSize(v, n) * 0.2

const _v = new THREE.Vector3()
const _box = new THREE.Box3()
const _m = new THREE.Matrix4()

function Fixture({ def, pointer, target }: { def: FixtureDef; pointer: React.RefObject<Pointer>; target: THREE.Vector3 }) {
  const gltf = useLoader(GLTFLoader, asset(`models/${def.model}.glb`), (l) => l.setMeshoptDecoder(MeshoptDecoder))
  const root = useRef<THREE.Group>(null!)
  const viewport = useThree((s) => s.viewport)

  const rig = useMemo(() => {
    // ten sam model wisi kilka razy: klon dzieli geometrię i materiały, ma własne węzły pan/tilt
    const scene = gltf.scene.clone(true)
    const pan = scene.getObjectByName('pan')!
    const tilt = scene.getObjectByName('tilt')!
    tilt.rotation.set(0, 0, 0)
    pan.rotation.set(0, 0, 0)
    scene.updateMatrixWorld(true)

    // normalizacja: wysokość 1, podstawa na y=0, środek w osi
    const bounds = new THREE.Box3().setFromObject(scene)
    const size = bounds.getSize(new THREE.Vector3())
    const k = 1 / size.y
    const offset = new THREE.Vector3(-(bounds.min.x + bounds.max.x) / 2, -bounds.min.y, -(bounds.min.z + bounds.max.z) / 2)

    // obrys głowy w jej lokalnym układzie -> skąd wychodzi wiązka
    const inv = new THREE.Matrix4().copy(tilt.matrixWorld).invert()
    const head = new THREE.Box3()
    tilt.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.geometry.computeBoundingBox()
      _box.copy(mesh.geometry.boundingBox!).applyMatrix4(_m.multiplyMatrices(inv, mesh.matrixWorld))
      head.union(_box)
    })
    const hs = head.getSize(new THREE.Vector3())
    const lens = new THREE.Vector3((head.min.x + head.max.x) / 2, (head.min.y + head.max.y) / 2, head.max.z)
    const r0 = Math.min(hs.x, hs.y) * 0.36

    scene.traverse((o) => {
      const mat = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (!mat || !('emissive' in mat) || mat.userData.tuned) return
      mat.userData.tuned = true // materiały są wspólne dla klonów — podbijamy tylko raz
      if (mat.emissive.getHex() !== 0) mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 0.6) * 3.2
      mat.envMapIntensity = 1.6
    })

    const uniforms = {
      uLen: { value: 1 },
      uR0: { value: r0 },
      uR1: { value: r0 },
      uColor: { value: new THREE.Color(def.color) },
      uIntensity: { value: 0 },
    }
    const geo = new THREE.CylinderGeometry(1, 1, 1, 40, 1, true)
    geo.rotateX(Math.PI / 2).translate(0, 0, 0.5)
    const beam = new THREE.Mesh(
      geo,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.ZeroFactor,
        blendDstAlpha: THREE.OneFactor,
      }),
    )
    beam.position.copy(lens)
    beam.frustumCulled = false
    beam.renderOrder = 2

    // świecąca soczewka
    const glowMat = new THREE.MeshBasicMaterial({ color: def.color, toneMapped: false, transparent: true, opacity: 0 })
    const glow = new THREE.Mesh(new THREE.CircleGeometry(r0 * 1.15, 32), glowMat)
    glow.position.copy(lens).z += hs.z * 0.004
    tilt.add(beam, glow)

    return { scene, pan, tilt, k, offset, uniforms, beam, glow, glowMat, pan0: 0, tilt0: 0, yaw: 0, appear: 0 }
  }, [gltf, def])

  useEffect(
    () => () => {
      for (const m of [rig.beam, rig.glow]) {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      }
    },
    [rig],
  )

  const { slot, count } = def
  const s = fixtureSize(viewport, count)
  const mid = (count - 1) / 2
  const x = ((slot - mid) * viewport.width * 0.94) / count
  const y = trussY(viewport, count)

  useFrame((state, dt) => {
    const { pan, tilt, uniforms } = rig
    const ease = 1 - Math.exp(-dt * 5)
    // lampy zapalają się po kolei od środka belki
    const delay = Math.abs(slot - mid) * 0.12
    if (state.clock.elapsedTime > delay) rig.appear += (1 - rig.appear) * (1 - Math.exp(-dt * 2.2))
    root.current.scale.setScalar(s * (0.9 + 0.1 * rig.appear))

    // paralaksa: każde urządzenie obraca się wokół własnej osi (widać bryłę), ale nie zmienia miejsca
    const live = performance.now() - pointer.current.at <= 2600
    rig.yaw += ((live ? pointer.current.x * 0.5 : 0) - rig.yaw) * (1 - Math.exp(-dt * 3))
    root.current.rotation.y = def.yaw + rig.yaw

    // cel: logo; wiązki układają się w wachlarz (każda celuje trochę w swoją stronę znaku)
    const t = state.clock.elapsedTime
    _v.copy(target)
    _v.x += x * 0.1 + (live ? 0 : Math.sin(t * 0.5 + slot * 0.9) * viewport.width * 0.035)
    _v.y += live ? 0 : Math.cos(t * 0.7 + slot * 1.7) * viewport.height * 0.02

    pan.parent!.worldToLocal(_v)
    _v.sub(pan.position)
    const panTo = Math.atan2(_v.x, _v.z)
    const h = Math.hypot(_v.x, _v.z)
    const tiltTo = -Math.atan2(_v.y - tilt.position.y, h - tilt.position.z)
    rig.pan0 += (panTo - rig.pan0) * ease
    rig.tilt0 += (tiltTo - rig.tilt0) * ease
    pan.rotation.y = rig.pan0
    tilt.rotation.x = rig.tilt0

    const len = Math.hypot(h, _v.y - tilt.position.y)
    uniforms.uLen.value = len * 1.06
    uniforms.uR1.value = uniforms.uR0.value + len * (def.red ? 0.07 : 0.11)
    const flicker = 0.94 + 0.06 * Math.sin(t * 9 + slot * 2.3)
    uniforms.uIntensity.value = (def.red ? 0.62 : 0.34) * rig.appear * flicker
    rig.glowMat.opacity = 0.9 * rig.appear
  })

  return (
    <group ref={root} position={[x, y, 0.4]} rotation={[0, def.yaw, Math.PI]} scale={s}>
      <group scale={rig.k}>
        <primitive object={rig.scene} position={rig.offset} />
      </group>
    </group>
  )
}

function Rig({ pointer, aimY }: { pointer: React.RefObject<Pointer>; aimY: number }) {
  const viewport = useThree((s) => s.viewport)
  const widthPx = useThree((s) => s.size.width)
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const target = useMemo(() => new THREE.Vector3(0, 0, AIM_Z), [])
  const count = fixtureCount(widthPx)

  const fixtures = useMemo<FixtureDef[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const red = i % 3 === 1
        return {
          model: MODELS[i % MODELS.length],
          color: red ? RED : WHITE[i % 2],
          red,
          yaw: (i % 2 ? -1 : 1) * 0.35,
          slot: i,
          count,
        }
      }),
    [count],
  )

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  useFrame((_, dt) => {
    const p = pointer.current
    const live = performance.now() - p.at <= 2600
    const ease = 1 - Math.exp(-dt * 3)
    const px = live ? p.x : 0
    const py = live ? p.y : 0
    // lampy śledzą kursor w okolicy logo; belka stoi w miejscu, więc nic nie wychodzi poza kadr
    target.x += (px * viewport.width * 0.12 * AIM_K - target.x) * ease
    target.y += ((aimY + py * 0.04) * viewport.height * AIM_K - target.y) * ease
  })

  const s = fixtureSize(viewport, count)
  return (
    <group>
      <mesh position={[0, trussY(viewport, count), 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[s * 0.05, s * 0.05, viewport.width * 1.3, 20]} />
        <meshStandardMaterial color="#5b5b60" metalness={0.95} roughness={0.28} envMapIntensity={1.8} />
      </mesh>
      {fixtures.map((def) => (
        <Suspense key={`${count}-${def.slot}`} fallback={null}>
          <Fixture def={def} pointer={pointer} target={target} />
        </Suspense>
      ))}
    </group>
  )
}

export default function Stage3D({
  pointer,
  active,
  aimY,
}: {
  pointer: React.RefObject<Pointer>
  active: boolean
  /** środek logo względem środka kadru, w ułamku wysokości (dodatnie = wyżej) */
  aimY: number
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.6]}
      camera={{ fov: 26, position: [0, 0, CAM_Z], near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      {/* ciemne obudowy na ciemnym tle: mocne światło z przodu + czerwona kontra, żeby bryły się odcinały */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 2, 8]} intensity={3.2} />
      <directionalLight position={[-6, -4, 3]} intensity={2.4} color="#ff3b42" />
      <directionalLight position={[6, -4, 3]} intensity={1.6} color="#dfe8ff" />
      <Rig pointer={pointer} aimY={aimY} />
    </Canvas>
  )
}

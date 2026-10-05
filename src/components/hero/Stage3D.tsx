import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { asset } from '../../lib/asset'

// Wskaźnik w układzie sceny: x,y ∈ [-1,1] względem karty z wideo; `at` — czas ostatniego ruchu.
export type Pointer = { x: number; y: number; at: number }

type FixtureDef = {
  model: string
  color: string
  /** pozycja względem krawędzi kadru: -1 lewa / 1 prawa, 1 góra (wisi) / -1 dół (stoi) */
  side: -1 | 1
  row: -1 | 1
  yaw: number
  spread: number
  intensity: number
}

const FIXTURES: FixtureDef[] = [
  { model: 'wash37', color: '#fff4e6', side: -1, row: 1, yaw: 0.5, spread: 0.16, intensity: 0.34 },
  { model: 'aura', color: '#eef3ff', side: 1, row: 1, yaw: -0.5, spread: 0.18, intensity: 0.34 },
  { model: 'beam-red', color: '#ff2a33', side: -1, row: -1, yaw: 0.35, spread: 0.09, intensity: 0.62 },
  { model: 'pointe', color: '#ff2a33', side: 1, row: -1, yaw: -0.35, spread: 0.08, intensity: 0.62 },
]

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
const fixtureSize = (v: View) => Math.min(v.height * 0.3, v.width * 0.19)
const trussY = (v: View) => v.height / 2 - fixtureSize(v) * 0.22

const _v = new THREE.Vector3()
const _box = new THREE.Box3()
const _m = new THREE.Matrix4()

function Fixture({ def, pointer, target }: { def: FixtureDef; pointer: React.RefObject<Pointer>; target: THREE.Vector3 }) {
  const gltf = useLoader(GLTFLoader, asset(`models/${def.model}.glb`), (l) => l.setMeshoptDecoder(MeshoptDecoder))
  const root = useRef<THREE.Group>(null!)
  const viewport = useThree((s) => s.viewport)

  const rig = useMemo(() => {
    const scene = gltf.scene
    const pan = scene.getObjectByName('pan')!
    const tilt = scene.getObjectByName('tilt')!
    // pomiar w układzie własnym modelu: useMemo może odpalić się ponownie, gdy scena jest już podpięta i przeskalowana
    scene.removeFromParent()
    scene.position.set(0, 0, 0)
    tilt.remove(...tilt.children.filter((c) => c.userData.fx))
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
      if (!mat || !('emissive' in mat)) return
      if (mat.emissive.getHex() !== 0) mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 0.6) * 3.2
      mat.envMapIntensity = 1.15
    })

    const uniforms = {
      uLen: { value: 1 },
      uR0: { value: r0 },
      uR1: { value: r0 },
      uColor: { value: new THREE.Color(def.color) },
      uIntensity: { value: 0 },
    }
    const geo = new THREE.CylinderGeometry(1, 1, 1, 48, 1, true)
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
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(r0 * 1.15, 40),
      new THREE.MeshBasicMaterial({ color: def.color, toneMapped: false, transparent: true, opacity: 0 }),
    )
    glow.position.copy(lens).z += hs.z * 0.004
    beam.userData.fx = glow.userData.fx = true
    tilt.add(beam, glow)

    return { scene, pan, tilt, k, offset, lens, uniforms, glow, pan0: 0, tilt0: 0, yaw: 0, appear: 0 }
  }, [gltf, def])

  // rozmiar i miejsce urządzenia liczone z widocznego kadru (canvas wystaje poza kartę z wideo)
  const s = fixtureSize(viewport)
  const x = def.side * (viewport.width / 2 - s * (def.row === 1 ? 0.95 : 0.6))
  const y = def.row === 1 ? trussY(viewport) : -viewport.height / 2 + s * 0.09

  useFrame((state, dt) => {
    const { pan, tilt, uniforms } = rig
    const ease = 1 - Math.exp(-dt * 5)
    rig.appear += (1 - rig.appear) * (1 - Math.exp(-dt * 2.2))
    root.current.scale.setScalar(s * (0.86 + 0.14 * rig.appear))
    // paralaksa: każde urządzenie obraca się wokół własnej osi (widać bryłę), ale nie zmienia miejsca
    const live = performance.now() - pointer.current.at <= 2600
    rig.yaw += ((live ? pointer.current.x * 0.45 : 0) - rig.yaw) * (1 - Math.exp(-dt * 3))
    root.current.rotation.y = def.yaw + rig.yaw

    // cel: logo + odchyłka każdej lampy, żeby plamy światła nie pokrywały się idealnie
    const t = state.clock.elapsedTime
    const idle = performance.now() - pointer.current.at > 2600
    _v.copy(target)
    _v.x += def.side * 0.12 * viewport.width * 0.1 + (idle ? Math.sin(t * 0.5 + def.side + def.row) * viewport.width * 0.05 : 0)
    _v.y += idle ? Math.cos(t * 0.7 + def.row * 2 + def.side) * viewport.height * 0.035 : 0

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
    uniforms.uLen.value = len * 1.04
    uniforms.uR1.value = uniforms.uR0.value + len * def.spread
    const flicker = 0.94 + 0.06 * Math.sin(t * 9 + def.side * 3 + def.row)
    uniforms.uIntensity.value = def.intensity * rig.appear * flicker
    ;(rig.glow.material as THREE.MeshBasicMaterial).opacity = 0.9 * rig.appear
  })

  return (
    <group ref={root} position={[x, y, 0.4]} rotation={[0, def.yaw, def.row === 1 ? Math.PI : 0]} scale={s}>
      <group scale={rig.k}>
        <primitive object={rig.scene} position={rig.offset} />
      </group>
    </group>
  )
}

function Rig({ pointer, onAim }: { pointer: React.RefObject<Pointer>; onAim?: (x: number, y: number) => void }) {
  const group = useRef<THREE.Group>(null!)
  const viewport = useThree((s) => s.viewport)
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const target = useMemo(() => new THREE.Vector3(0, 0, -1.2), [])

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
    const idle = performance.now() - p.at > 2600
    const ease = 1 - Math.exp(-dt * 3)
    const px = idle ? 0 : p.x
    const py = idle ? 0 : p.y
    // lampy śledzą kursor w okolicy logo; sama belka stoi w miejscu, żeby nic nie wychodziło poza kadr canvasu
    target.x += (px * viewport.width * 0.12 - target.x) * ease
    // w dół cel prawie się nie rusza: pod logo są przyciski, wiązki mają je omijać
    target.y += (py * viewport.height * (py > 0 ? 0.14 : 0.03) - target.y) * ease
    onAim?.(target.x / viewport.width, target.y / viewport.height)
  })

  return (
    <group ref={group}>
      <mesh position={[0, trussY(viewport), 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[fixtureSize(viewport) * 0.045, fixtureSize(viewport) * 0.045, viewport.width * 1.4, 24]} />
        <meshStandardMaterial color="#1b1b1d" metalness={0.9} roughness={0.32} />
      </mesh>
      {FIXTURES.map((def) => (
        <Suspense key={def.model} fallback={null}>
          <Fixture def={def} pointer={pointer} target={target} />
        </Suspense>
      ))}
    </group>
  )
}

export default function Stage3D({
  pointer,
  active,
  onAim,
}: {
  pointer: React.RefObject<Pointer>
  active: boolean
  onAim?: (x: number, y: number) => void
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 26, position: [0, 0, 9], near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 3]} intensity={1.1} color="#ff3b42" />
      <Rig pointer={pointer} onAim={onAim} />
    </Canvas>
  )
}

// Kompresja modeli 3D reflektorów: media-src/3d/*.glb -> public/models/*.glb
// Hierarchia zostaje spłaszczona do trzech węzłów (base / pan / tilt), żeby głowy dało się obracać,
// a cała reszta siatek jest łączona po materiale, upraszczana i pakowana meshopt + WebP.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, weld, join, simplify, prune, textureCompress, meshopt, quantize } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier, MeshoptDecoder } from 'meshoptimizer'

const SRC = 'media-src/3d'
const OUT = 'public/models'

// pan / tilt: fragment nazwy węzła-pivotu w pliku źródłowym
const MODELS = {
  wash37: { pan: 'Pan_yoke', tilt: 'Tilt_head', ratio: 0.22 },
  'beam-red': { pan: 'Pan assembly', tilt: 'Tilt assembly', ratio: 0.16 },
  pointe: { pan: 'Pan pivot', tilt: 'Tilt pivot', ratio: 0.2 },
  aura: { pan: 'Pan_yoke', tilt: 'Tilt_head', ratio: 0.4 },
}

const mul = (a, b) => {
  const o = new Array(16)
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
  return o
}
// odwrotność macierzy sztywnej/afinicznej 4x4 (column-major)
const invert = (m) => {
  const [a, b, c, , d, e, f, , g, h, i, , x, y, z] = m
  const det = a * (e * i - f * h) - d * (b * i - c * h) + g * (b * f - c * e)
  const r = [
    (e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det, 0,
    (f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det, 0,
    (d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det, 0,
  ]
  r.push(-(r[0] * x + r[4] * y + r[8] * z), -(r[1] * x + r[5] * y + r[9] * z), -(r[2] * x + r[6] * y + r[10] * z), 1)
  return r
}

function flattenToPivots(doc, cfg) {
  const root = doc.getRoot()
  const scene = root.listScenes()[0]
  const nodes = root.listNodes()
  const find = (frag) => {
    const n = nodes.find((n) => n.getName().includes(frag))
    if (!n) throw new Error(`pivot "${frag}" not found`)
    return n
  }
  const panSrc = find(cfg.pan)
  const tiltSrc = find(cfg.tilt)

  const world = new Map(nodes.map((n) => [n, n.getWorldMatrix()]))
  const parentOf = new Map()
  for (const n of nodes) for (const c of n.listChildren()) parentOf.set(c, n)
  const owner = (n) => {
    for (let p = n; p; p = parentOf.get(p)) {
      if (p === tiltSrc) return 'tilt'
      if (p === panSrc) return 'pan'
    }
    return 'base'
  }

  const base = doc.createNode('base')
  const pan = doc.createNode('pan').setMatrix(world.get(panSrc))
  const tilt = doc.createNode('tilt').setMatrix(mul(invert(world.get(panSrc)), world.get(tiltSrc)))
  const pivots = { base, pan, tilt }
  const pivotWorld = { base: null, pan: world.get(panSrc), tilt: world.get(tiltSrc) }

  const meshNodes = nodes.filter((n) => n.getMesh())
  const moved = []
  for (const n of meshNodes) {
    const key = owner(n)
    const w = world.get(n)
    const leaf = doc.createNode(n.getName()).setMesh(n.getMesh())
    leaf.setMatrix(pivotWorld[key] ? mul(invert(pivotWorld[key]), w) : w)
    moved.push([pivots[key], leaf])
  }
  for (const c of scene.listChildren()) scene.removeChild(c)
  for (const n of nodes) n.dispose()
  for (const [p, leaf] of moved) p.addChild(leaf)
  pan.addChild(tilt)
  scene.addChild(base).addChild(pan)
  // pivoty mają zostać osobnymi węzłami — join() łączy tylko rodzeństwo z siatkami
}

const countTris = (doc) => {
  let t = 0
  for (const m of doc.getRoot().listMeshes())
    for (const p of m.listPrimitives()) t += (p.getIndices() ?? p.getAttribute('POSITION')).getCount() / 3
  return Math.round(t)
}

await MeshoptEncoder.ready
await MeshoptSimplifier.ready
await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': MeshoptDecoder,
})
fs.mkdirSync(OUT, { recursive: true })

for (const [name, cfg] of Object.entries(MODELS)) {
  const src = path.join(SRC, `${name}.glb`)
  const doc = await io.read(src)
  const before = countTris(doc)
  flattenToPivots(doc, cfg)
  await doc.transform(
    dedup(),
    join({ keepNamed: false }),
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: cfg.ratio, error: 0.004 }),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [512, 512], quality: 80 }),
    prune(),
    quantize(),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  )
  const out = path.join(OUT, `${name}.glb`)
  await io.write(out, doc)
  const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0)
  console.log(
    `${name}: ${kb(src)} KB -> ${kb(out)} KB | tris ${before} -> ${countTris(doc)} | nodes ${doc.getRoot().listNodes().length}`,
  )
}

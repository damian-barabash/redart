// Konwersja materiałów klienta: media-src/** -> public/media (WebP) i public/video (WebM).
// Źródła (media-src) nie trafiają do repozytorium — w gicie jest tylko wynik.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const SITE = 'media-src/site'
const RENTAL = 'media-src/rental'
const OUT = 'public/media'
const up = (n) => `uploads__2019__08__${n}`
const th = (n) => `themes__redart__images__${n}`

const galleries = {
  'dni-debicy': [
    '61630015_2070677563040848_7338948693283831808_o', '61643759_2070677506374187_2644198643006963712_o',
    '61668353_2070677366374201_5927626163554877440_n', '61761182_2070677429707528_2840288750750138368_o',
    '61967928_2070677693040835_6886433554612355072_o', '62139184_2070677633040841_2888375878906019840_o',
  ],
  'polandrock-festival': [
    '67636582_2351785331567112_5326126421930672128_o', '67468872_359839848247512_5560488519392034816_o',
    '67539747_358741821690648_6174390421465071616_o', '67592785_358741678357329_1835407278413447168_o',
    '67606000_359839888247508_7988093795612753920_o', '67608793_358741755023988_2014321202054561792_o',
    '67755465_358741781690652_1425362464286965760_o', '67758003_358741711690659_8935697712939008000_o',
    '67786677_359839801580850_82911882633019392_o', '67850244_2351785368233775_4269371034672562176_o',
    '68747775_359839768247520_6211830063701164032_o',
  ],
  'dni-gogolina': [
    '67081603_351381035760060_1305343219562708992_o', '65266202_2059733514156078_6355808959579815936_o',
    '65373092_338180023746828_8147022957252706304_o', '65540543_2059733590822737_4942710301960175616_o',
    '65589578_2059733417489421_658266105332105216_o', '65604626_2059733354156094_8884089214111580160_o',
    '67221456_351381222426708_8982991534865514496_o', '67244483_351381102426720_2017629276060254208_o',
    '65376556_2060704094059020_6128707216569532416_o', '67243799_351381075760056_1780563191743381504_o',
  ],
  'jaka-to-melodia': [
    '56358429_1987359701372635_1630856922615775232_o', '56380140_1987359781372627_2634335319331176448_o',
    '56485703_1987359898039282_3794847615992987648_o', '56706136_1987360134705925_1968214496203767808_o',
    '56718503_1987359738039298_2287769305795788800_o', '56819751_1987360081372597_2249955503188738048_o',
    '56832544_1987359844705954_582996945203625984_o', '56897032_1987360028039269_9050977658820624384_o',
  ],
}

// [plik źródłowy, ścieżka wynikowa bez rozszerzenia]
const jobs = [
  [`${SITE}/${up('majka-jezowska.jpg')}`, 'artysci/majka-jezowska'],
  [`${SITE}/${up('kasa.jpg')}`, 'artysci/k-a-s-a'],
  [`${SITE}/${up('agnieszka-wiechnik.jpg')}`, 'artysci/agnieszka-wiechnik'],
  [`${SITE}/${th('a_jezowska-2.jpg')}`, 'artysci/majka-jezowska-wide'],
  [`${SITE}/${th('a_trojanowska-2.jpg')}`, 'artysci/izabela-trojanowska-wide'],
  [`${SITE}/${th('a_kasa-2.jpg')}`, 'artysci/k-a-s-a-wide'],
  [`${SITE}/${th('a_wiechnik-2.jpg')}`, 'artysci/agnieszka-wiechnik-wide'],
  [`${SITE}/${up('5d41b7f360415_p.jpg')}`, 'eventy/festiwal-optymizmu'],
  [`${SITE}/${up('KAMP-4-Kultury.jpg_nc-wp_681x978.jpg')}`, 'eventy/hot-dance-party'],
  [`${SITE}/${up('d206C6k6Z0z0p1X5838045h6Q5v2E2G7.jpg')}`, 'eventy/top-of-the-top-sopot'],
  [`${SITE}/${up('ru-1-r-6400-n-2471929S61a.jpg')}`, 'eventy/polandrock-majka-jezowska'],
  [`${SITE}/${up('eventy.jpg')}`, 'eventy/eventy'],
  [`${SITE}/${th('mikrofon.jpg')}`, 'site/mikrofon'],
  [`${SITE}/${th('mikrofon-waski.jpg')}`, 'site/mikrofon-waski'],
  [`${SITE}/uploads__2025__04__redart_post_fb.png`, 'site/kpo-plansza'],
  [`${SITE}/uploads__2025__04__redart_post_fb-1.png`, 'site/kpo-plansza-2'],
  [`${SITE}/uploads__2023__06__ciag_znakow_kolor_REACT_EU.png.png`, 'site/react-eu-znaki', { max: 2400, lossless: true }],
  ...Object.entries(galleries).flatMap(([slug, files]) =>
    files.map((f, i) => [`${SITE}/${up(f + '.jpg')}`, `galeria/${slug}/${String(i + 1).padStart(2, '0')}`]),
  ),
  ...[
    ['claypaky-b-eye-k25.png', 'claypaky-b-eye-k25'], ['Grand-Ma-3.jpg', 'grandma-3'],
    ['Hazer-unique-2-1.jpg', 'hazer-unique-2-1'], ['Martin-atomic-3000.jpg', 'martin-atomic-3000'],
    ['Martin-MAC-Aura-PXL-5D.jpg', 'martin-mac-aura-pxl'], ['MDG-atme.png', 'mdg-atme'],
    ['Robe-Pointe.jpg', 'robe-pointe'], ['Sunstripe-Showtec-MK-II.jpg', 'sunstrip-showtec-mk2'],
    ['Martin-McAura-Xip.png', 'martin-mac-aura-xip'],
  ].map(([f, n]) => [`${RENTAL}/${f}`, `rental/${n}`, { max: 1200, cut: true }]),
]

// Zdjęcia sprzętu mają białe tło — na ciemnej stronie wycinamy je do przezroczystości.
// Zalewanie od krawędzi: znika tylko biel połączona z brzegiem kadru, jasne elementy urządzenia zostają.
async function cutWhite(src, max) {
  const { data, info } = await sharp(src, { failOn: 'none' }).rotate()
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const light = (i) => data[i * 4 + 3] < 8 || Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) >= 236
  const bg = new Uint8Array(w * h)
  const stack = []
  const push = (x, y) => {
    const i = y * w + x
    if (x < 0 || y < 0 || x >= w || y >= h || bg[i] || !light(i)) return
    bg[i] = 1
    stack.push(i)
  }
  for (let x = 0; x < w; x++) (push(x, 0), push(x, h - 1))
  for (let y = 0; y < h; y++) (push(0, y), push(w - 1, y))
  while (stack.length) {
    const i = stack.pop()
    const x = i % w
    const y = (i - x) / w
    push(x + 1, y), push(x - 1, y), push(x, y + 1), push(x, y - 1)
  }
  // spójne obszary (4-sąsiedztwo) pikseli spełniających warunek
  const regions = (test) => {
    const seen = new Uint8Array(w * h)
    const out = []
    for (let start = 0; start < w * h; start++) {
      if (seen[start] || !test(start)) continue
      const px = [start]
      seen[start] = 1
      for (let k = 0; k < px.length; k++) {
        const i = px[k]
        const x = i % w
        for (const j of [x + 1 < w ? i + 1 : -1, x > 0 ? i - 1 : -1, i + w < w * h ? i + w : -1, i - w]) {
          if (j < 0 || seen[j] || !test(j)) continue
          seen[j] = 1
          px.push(j)
        }
      }
      out.push(px)
    }
    return out
  }
  // biel zamknięta wewnątrz urządzenia (prześwit jarzma): duże, czysto białe plamy też są tłem
  const white = (i) => !bg[i] && Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) >= 247
  for (const px of regions(white)) if (px.length > w * h * 0.0012) for (const i of px) bg[i] = 1
  // śmieci ze źródeł (linie ramek, podpisy producenta): zostaje tylko główna bryła i to, co ma ≥ 6% jej pola
  const solid = regions((i) => !bg[i])
  const biggest = Math.max(...solid.map((r) => r.length))
  for (const px of solid) if (px.length < biggest * 0.06) for (const i of px) bg[i] = 1

  // maska: tło = 0; lekko zmiękczona i cofnięta o ~1 px, żeby nie został jasny obrys
  const mask = Buffer.alloc(w * h)
  for (let i = 0; i < w * h; i++) mask[i] = bg[i] ? 0 : 255
  const soft = await sharp(mask, { raw: { width: w, height: h, channels: 1 } }).blur(1.1).linear(1.9, -115).extractChannel(0).raw().toBuffer() // extractChannel: sharp na wyjściu rozwija szarość do RGB
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = Math.min(data[i * 4 + 3], soft[i])
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim()
}

const manifest = {}
let inBytes = 0
let outBytes = 0
for (const [src, name, opt = {}] of jobs) {
  const max = opt.max ?? 1600
  const out = path.join(OUT, `${name}.webp`)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  const sm = path.join(OUT, `${name}-sm.webp`)
  let info
  if (opt.cut) {
    // trim() i resize() rozdzielamy przez bufor — sharp wykonuje resize przed trim niezależnie od kolejności wywołań
    const cut = await (await cutWhite(src, max)).png().toBuffer()
    info = await sharp(cut).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(out)
    await sharp(cut).resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(sm)
  } else {
    const base = sharp(src, { failOn: 'none' }).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    info = await base.clone().webp(opt.lossless ? { lossless: true } : { quality: 78, effort: 6 }).toFile(out)
    await sharp(src, { failOn: 'none' }).rotate().resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 }).toFile(sm)
  }
  manifest[name] = { w: info.width, h: info.height }
  inBytes += fs.statSync(src).size
  outBytes += info.size + fs.statSync(sm).size
}
fs.writeFileSync('src/content/media.json', JSON.stringify(manifest, null, 1))
console.log(`images: ${jobs.length} | ${(inBytes / 1e6).toFixed(1)} MB -> ${(outBytes / 1e6).toFixed(1)} MB (pełny + miniatura)`)

// Wideo z hero: VP9 WebM + mały H.264 jako zapas dla starszych Safari + plakat WebP
const video = `${SITE}/${th('sequence.mp4')}`
fs.mkdirSync('public/video', { recursive: true })
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
ff(['-i', video, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-pix_fmt', 'yuv420p', '-g', '75', 'public/video/hero.webm'])
ff(['-i', video, '-an', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'public/video/hero.mp4'])
// (ffmpeg z Homebrew nie ma libwebp — klatkę plakatu koduje sharp)
const frame = execFileSync('ffmpeg', ['-v', 'error', '-ss', '6', '-i', video, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], { maxBuffer: 1e8 })
await sharp(frame).webp({ quality: 70 }).toFile('public/video/hero-poster.webp')
for (const f of ['hero.webm', 'hero.mp4', 'hero-poster.webp'])
  console.log(`${f}: ${(fs.statSync('public/video/' + f).size / 1024).toFixed(0)} KB (źródło ${(fs.statSync(video).size / 1024).toFixed(0)} KB)`)

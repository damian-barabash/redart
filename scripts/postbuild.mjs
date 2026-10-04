// GitHub Pages nie zna tras SPA: /rental odświeżone w przeglądarce dałoby 404.
// Dla każdej trasy kładziemy kopię index.html jako <trasa>/index.html (Pages oddaje ją z kodem 200),
// a 404.html łapie resztę (np. stare adresy WordPressa, które router przekierowuje).
import fs from 'node:fs'
import path from 'node:path'

const read = (f) => fs.readFileSync(f, 'utf8')
const slugs = (file, re = /slug: '([^']+)'/g) => [...read(file).matchAll(re)].map((m) => m[1])

const routes = [
  'o-nas', 'artysci', 'eventy', 'galeria', 'rental', 'koszyk', 'kontakt', 'dofinansowanie-ze-srodkow-react-eu',
  ...slugs('src/content/artists.ts').map((s) => `artysci/${s}`),
  ...slugs('src/content/events.ts').map((s) => `eventy/${s}`),
  ...slugs('src/content/galleries.ts').map((s) => `galeria/${s}`),
  ...slugs('src/content/products.ts').map((s) => `rental/${s}`),
]

const html = read('dist/index.html')
for (const r of routes) {
  const out = path.join('dist', r, 'index.html')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
}
fs.writeFileSync('dist/404.html', html.replace('<head>', '<head>\n    <meta name="robots" content="noindex" />'))
fs.writeFileSync('dist/.nojekyll', '')
console.log(`postbuild: ${routes.length} tras + 404.html`)

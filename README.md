# redART Events — strona + rental

React 19 + Vite + TypeScript, three.js (@react-three/fiber) w hero. Hosting: GitHub Pages (`.github/workflows/deploy.yml`).

```
npm install
npm run dev        # podgląd
npm run build      # dist/ + kopie index.html dla tras (scripts/postbuild.mjs)
npm run media      # media-src/** -> public/media (WebP), public/video (WebM + MP4 zapas)
npm run glb        # media-src/3d/*.glb -> public/models (meshopt + WebP, węzły base/pan/tilt)
```

- `src/content/*` — treści przeniesione ze starej strony i asortyment rentalu. Docelowo CMS w Supabase.
- `src/lib/api.ts` — jedyne miejsce do podpięcia Supabase; dziś formularze i zamówienia działają w trybie testowym (zapis w localStorage).
- `media-src/` — oryginały zdjęć, wideo i modeli; poza repozytorium (`.gitignore`).
- Własna domena: dodać `public/CNAME`; `BASE_PATH` ustawia się sam z konfiguracji Pages.

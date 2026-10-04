import manifest from '../content/media.json'

const base = import.meta.env.BASE_URL

/** Ścieżka do pliku z public/ z uwzględnieniem base (GitHub Pages serwuje stronę z podkatalogu). */
export const asset = (p: string) => base + p.replace(/^\//, '')

export const media = (name: string, small = false) => asset(`media/${name}${small ? '-sm' : ''}.webp`)

export const mediaSize = (name: string) =>
  (manifest as Record<string, { w: number; h: number }>)[name] ?? { w: 4, h: 3 }

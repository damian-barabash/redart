export type Gallery = { slug: string; title: string; added: string; count: number }

// Zdjęcia: public/media/galeria/<slug>/01.webp … (generuje scripts/media.mjs)
export const galleries: Gallery[] = [
  { slug: 'dni-debicy', title: 'Dni Dębicy', added: '18 sierpnia 2019', count: 6 },
  { slug: 'polandrock-festival', title: 'Pol’and’Rock Festival', added: '5 sierpnia 2019', count: 11 },
  { slug: 'dni-gogolina', title: 'Artystyczne lato 2019 w Gogolinie', added: '21 lipca 2019', count: 10 },
  { slug: 'jaka-to-melodia', title: 'Jaka to melodia', added: '8 kwietnia 2019', count: 8 },
]

export const galleryImages = (g: Gallery) =>
  Array.from({ length: g.count }, (_, i) => `galeria/${g.slug}/${String(i + 1).padStart(2, '0')}`)

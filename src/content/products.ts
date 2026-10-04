// Asortyment i ceny z rental.redart.com.pl (kalkulator urządzeń). Kategorie i krótkie opisy dodane na potrzeby sklepu.
export type Product = {
  id: number
  slug: string
  name: string
  category: Category
  /** cena za sztukę za dzień, PLN */
  price: number
  stock: number
  image: string
  blurb: string
}

export const categories = ['Ruchome głowy', 'Efekty świetlne', 'Wytwornice mgły', 'Sterowanie'] as const
export type Category = (typeof categories)[number]

export const products: Product[] = [
  { id: 1, slug: 'claypaky-b-eye-k25', name: 'Claypaky B-EYE K25', category: 'Ruchome głowy', price: 300, stock: 10, image: 'rental/claypaky-b-eye-k25', blurb: 'Ruchoma głowa LED typu wash / beam z efektami pikselowymi.' },
  { id: 2, slug: 'grandma-3', name: 'grandMA3', category: 'Sterowanie', price: 1300, stock: 1, image: 'rental/grandma-3', blurb: 'Konsoleta do sterowania oświetleniem scenicznym.' },
  { id: 3, slug: 'hazer-unique-2-1', name: 'Hazer Unique 2.1', category: 'Wytwornice mgły', price: 200, stock: 1, image: 'rental/hazer-unique-2-1', blurb: 'Wytwornica mgły typu hazer — równomierna mgiełka pod światło.' },
  { id: 4, slug: 'martin-atomic-3000', name: 'Martin Atomic 3000', category: 'Efekty świetlne', price: 50, stock: 6, image: 'rental/martin-atomic-3000', blurb: 'Stroboskop sceniczny dużej mocy.' },
  { id: 5, slug: 'martin-mac-aura-pxl', name: 'Martin MAC Aura PXL', category: 'Ruchome głowy', price: 200, stock: 10, image: 'rental/martin-mac-aura-pxl', blurb: 'Ruchoma głowa LED wash z efektem aury i sterowaniem pikseli.' },
  { id: 7, slug: 'mdg-atme', name: 'MDG ATMe', category: 'Wytwornice mgły', price: 500, stock: 1, image: 'rental/mdg-atme', blurb: 'Generator mgły (haze) na duże sceny i hale.' },
  { id: 8, slug: 'robe-pointe', name: 'Robe Pointe', category: 'Ruchome głowy', price: 150, stock: 16, image: 'rental/robe-pointe', blurb: 'Ruchoma głowa beam / spot / wash.' },
  { id: 9, slug: 'sunstrip-showtec-mk2', name: 'Showtec Sunstrip MKII', category: 'Efekty świetlne', price: 70, stock: 16, image: 'rental/sunstrip-showtec-mk2', blurb: 'Belka halogenowa typu sunstrip — ciepły blinder.' },
  { id: 10, slug: 'martin-mac-aura-xip', name: 'Martin MAC Aura XIP', category: 'Ruchome głowy', price: 200, stock: 20, image: 'rental/martin-mac-aura-xip', blurb: 'Ruchoma głowa LED wash w wykonaniu zewnętrznym (IP).' },
]

export const pln = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł'

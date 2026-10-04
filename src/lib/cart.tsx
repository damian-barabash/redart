import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products, type Product } from '../content/products'

export type CartLine = { id: number; qty: number; days: number }
type Cart = {
  lines: (CartLine & { product: Product; sum: number })[]
  count: number
  total: number
  add: (id: number, qty?: number, days?: number) => void
  update: (id: number, patch: Partial<Pick<CartLine, 'qty' | 'days'>>) => void
  remove: (id: number) => void
  clear: () => void
}

const KEY = 'redart:cart'
const Ctx = createContext<Cart | null>(null)

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(v) || min))

function load(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((l) => products.some((p) => p.id === l.id)) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(raw))
    } catch {
      // koszyk działa wtedy tylko do odświeżenia strony
    }
  }, [raw])

  const value = useMemo<Cart>(() => {
    const lines = raw.flatMap((l) => {
      const product = products.find((p) => p.id === l.id)
      return product ? [{ ...l, product, sum: product.price * l.qty * l.days }] : []
    })
    const stock = (id: number) => products.find((p) => p.id === id)?.stock ?? 1
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.sum, 0),
      add: (id, qty = 1, days = 1) =>
        setRaw((prev) => {
          const cur = prev.find((l) => l.id === id)
          if (cur) return prev.map((l) => (l.id === id ? { ...l, qty: clamp(l.qty + qty, 1, stock(id)), days: Math.max(l.days, days) } : l))
          return [...prev, { id, qty: clamp(qty, 1, stock(id)), days: clamp(days, 1, 100) }]
        }),
      update: (id, patch) =>
        setRaw((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, qty: clamp(patch.qty ?? l.qty, 1, stock(id)), days: clamp(patch.days ?? l.days, 1, 100) }
              : l,
          ),
        ),
      remove: (id) => setRaw((prev) => prev.filter((l) => l.id !== id)),
      clear: () => setRaw([]),
    }
  }, [raw])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart poza CartProvider')
  return c
}

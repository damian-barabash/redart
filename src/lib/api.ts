// Warstwa danych. Dziś: treści lokalne i formularze w trybie testowym.
// Po podpięciu Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) tutaj trafią zapytania do CMS
// oraz zapis zgłoszeń — komponenty nie będą wymagały zmian.

export const supabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export type ContactPayload = { name: string; email: string; phone: string; topic: string; message: string }

export type OrderPayload = {
  name: string
  company: string
  email: string
  phone: string
  dateFrom: string
  place: string
  notes: string
  items: { id: number; name: string; qty: number; days: number; price: number }[]
  total: number
}

export type SubmitResult = { ok: true; ref: string; test: boolean } | { ok: false; error: string }

const TEST_KEY = 'redart:test-submissions'

async function submit(kind: 'contact' | 'order', payload: unknown): Promise<SubmitResult> {
  // TODO(Supabase): insert do tabeli zgłoszeń przez RPC; do tego czasu zgłoszenie zostaje w przeglądarce.
  await new Promise((r) => setTimeout(r, 600))
  const ref = `${kind === 'order' ? 'ZAM' : 'KON'}-${Date.now().toString(36).toUpperCase()}`
  try {
    const all = JSON.parse(localStorage.getItem(TEST_KEY) || '[]')
    all.push({ ref, kind, payload, at: new Date().toISOString() })
    localStorage.setItem(TEST_KEY, JSON.stringify(all.slice(-20)))
  } catch {
    // brak dostępu do localStorage nie blokuje potwierdzenia w trybie testowym
  }
  return { ok: true, ref, test: true }
}

export const submitContact = (p: ContactPayload) => submit('contact', p)
export const submitOrder = (p: OrderPayload) => submit('order', p)

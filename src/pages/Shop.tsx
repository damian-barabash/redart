// Rental jako sklep: katalog, karta produktu, koszyk z kalkulatorem (ilość × dni) i zamówieniem w trybie testowym
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Arrow, Crumbs, Img, PageHead } from '../components/ui'
import { categories, pln, products, type Category, type Product } from '../content/products'
import { site } from '../content/site'
import { submitOrder, type SubmitResult } from '../lib/api'
import { useCart } from '../lib/cart'
import { NotFound } from './Content'

function Stepper({ value, min = 1, max, onChange, label }: { value: number; min?: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Mniej">
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Więcej">
        +
      </button>
    </div>
  )
}

function ProductCard({ p }: { p: Product }) {
  const { add, lines } = useCart()
  const inCart = lines.find((l) => l.id === p.id)?.qty ?? 0
  return (
    <article className="pcard rv">
      <Link to={`/rental/${p.slug}`} className="pcard__img">
        <Img name={p.image} alt={p.name} small />
        <span className="pcard__cat">{p.category}</span>
      </Link>
      <div className="pcard__body">
        <h2>
          <Link to={`/rental/${p.slug}`}>{p.name}</Link>
        </h2>
        <p className="pcard__stock">Na magazynie: {p.stock} szt.</p>
        <div className="pcard__foot">
          <p className="price">
            {pln(p.price)} <small>/ dzień</small>
          </p>
          <button className="btn btn--dark btn--sm" onClick={() => add(p.id)} disabled={inCart >= p.stock}>
            {inCart ? `W koszyku: ${inCart}` : 'Do koszyka'}
          </button>
        </div>
      </div>
    </article>
  )
}

export function Rental() {
  const [cat, setCat] = useState<Category | 'Wszystko'>('Wszystko')
  const [sort, setSort] = useState<'name' | 'asc' | 'desc'>('name')
  const { count, total } = useCart()

  const list = products
    .filter((p) => cat === 'Wszystko' || p.category === cat)
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name, 'pl') : sort === 'asc' ? a.price - b.price : b.price - a.price))

  return (
    <>
      <PageHead kicker="redART Rental" title={<>Wypożyczalnia sprzętu <em>scenicznego</em></>}>
        <p>Oferta dla hoteli i centrów wystawienniczo-kongresowych. Wybierz urządzenia, podaj liczbę sztuk i dni — kalkulator policzy wartość zamówienia.</p>
      </PageHead>

      <section className="wrap shop section--last">
        <div className="shop__bar rv">
          <div className="filters" role="tablist" aria-label="Kategorie">
            {(['Wszystko', ...categories] as const).map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <label className="sort">
            <span>Sortuj</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="name">Nazwa A–Z</option>
              <option value="asc">Cena rosnąco</option>
              <option value="desc">Cena malejąco</option>
            </select>
          </label>
        </div>

        <div className="pgrid">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {count > 0 && (
          <Link to="/koszyk" className="cartbar">
            <span>
              W koszyku: <b>{count} szt.</b>
            </span>
            <span>
              <b>{pln(total)}</b> <Arrow />
            </span>
          </Link>
        )}
      </section>
    </>
  )
}

export function ProductPage() {
  const { slug } = useParams()
  const p = products.find((x) => x.slug === slug)
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [days, setDays] = useState(1)
  const [added, setAdded] = useState(false)
  if (!p) return <NotFound />
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3)

  return (
    <>
      <Crumbs items={[{ to: '/rental', label: 'Rental' }, { label: p.name }]} />
      <section className="wrap product">
        <div className="product__img rv">
          <Img name={p.image} alt={p.name} eager />
        </div>
        <div className="product__body rv">
          <p className="eyebrow">{p.category}</p>
          <h1 className="phead__title phead__title--sm">{p.name}</h1>
          <p className="product__blurb">{p.blurb}</p>
          <p className="price price--lg">
            {pln(p.price)} <small>/ sztuka / dzień</small>
          </p>
          <p className="pcard__stock">Na magazynie: {p.stock} szt.</p>

          <div className="calc">
            <div>
              <span>Ilość sztuk</span>
              <Stepper value={qty} max={p.stock} onChange={setQty} label="Ilość sztuk" />
            </div>
            <div>
              <span>Ilość dni</span>
              <Stepper value={days} max={100} onChange={setDays} label="Ilość dni" />
            </div>
            <div className="calc__sum">
              <span>Razem</span>
              <b>{pln(p.price * qty * days)}</b>
            </div>
          </div>

          <div className="links">
            <button
              className="btn btn--red"
              onClick={() => {
                add(p.id, qty, days)
                setAdded(true)
              }}
            >
              Dodaj do koszyka
            </button>
            {added && (
              <Link className="btn btn--ghost" to="/koszyk">
                Przejdź do koszyka <Arrow />
              </Link>
            )}
          </div>
          <p className="note" role="status">
            {added ? 'Dodano do koszyka.' : 'Sklep działa w trybie testowym — zamówienie jest zapytaniem o dostępność.'}
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap section section--last">
          <h2 className="shead__title shead__title--sm rv">
            Z tej samej <em>kategorii</em>
          </h2>
          <div className="pgrid">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export function CartPage() {
  const { lines, total, update, remove, clear } = useCart()
  const [state, setState] = useState<'idle' | 'sending' | SubmitResult>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('website')) return // honeypot
    setState('sending')
    const res = await submitOrder({
      name: String(f.get('name')),
      company: String(f.get('company')),
      email: String(f.get('email')),
      phone: String(f.get('phone')),
      dateFrom: String(f.get('dateFrom')),
      place: String(f.get('place')),
      notes: String(f.get('notes')),
      items: lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, days: l.days, price: l.product.price })),
      total,
    })
    setState(res)
    if (res.ok) clear()
  }

  if (typeof state === 'object' && state.ok)
    return (
      <PageHead kicker="Zamówienie przyjęte" title={<>Dzię<em>kujemy!</em></>}>
        <p>Numer zamówienia: {state.ref}</p>
        {state.test && <p className="note">Tryb testowy — zamówienie nie zostało jeszcze przekazane do redART. Aby potwierdzić termin, zadzwoń: {site.contacts[0].phone}.</p>}
        <Link className="btn btn--red" to="/rental">
          Wróć do sklepu
        </Link>
      </PageHead>
    )

  if (!lines.length)
    return (
      <PageHead kicker="Koszyk" title={<>Koszyk jest <em>pusty</em></>}>
        <p>Dodaj urządzenia z wypożyczalni, a policzymy wartość zamówienia.</p>
        <Link className="btn btn--red" to="/rental">
          Przejdź do sklepu
        </Link>
      </PageHead>
    )

  return (
    <>
      <PageHead kicker="Kalkulator urządzeń" title={<>Twój <em>koszyk</em></>} />
      <section className="wrap cart section--last">
        <div className="cart__list rv">
          {lines.map((l) => (
            <div key={l.id} className="cline">
              <Link to={`/rental/${l.product.slug}`} className="cline__img">
                <Img name={l.product.image} alt="" small />
              </Link>
              <div className="cline__name">
                <Link to={`/rental/${l.product.slug}`}>{l.product.name}</Link>
                <small>{pln(l.product.price)} / dzień · na magazynie {l.product.stock}</small>
              </div>
              <label className="cline__f">
                <span>Sztuk</span>
                <Stepper value={l.qty} max={l.product.stock} onChange={(qty) => update(l.id, { qty })} label={`Ilość sztuk: ${l.product.name}`} />
              </label>
              <label className="cline__f">
                <span>Dni</span>
                <Stepper value={l.days} max={100} onChange={(days) => update(l.id, { days })} label={`Ilość dni: ${l.product.name}`} />
              </label>
              <b className="cline__sum">{pln(l.sum)}</b>
              <button className="cline__rm" onClick={() => remove(l.id)} aria-label={`Usuń: ${l.product.name}`}>
                ×
              </button>
            </div>
          ))}
          <div className="cart__total">
            <span>Razem</span>
            <b>{pln(total)}</b>
          </div>
        </div>

        <div className="card rv">
          <form className="form" onSubmit={onSubmit}>
            <h2>Dane do zamówienia</h2>
            <div className="form__2">
              <label>
                Imię i nazwisko
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                Firma / obiekt
                <input name="company" autoComplete="organization" />
              </label>
            </div>
            <div className="form__2">
              <label>
                E-mail
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Telefon
                <input name="phone" type="tel" required autoComplete="tel" />
              </label>
            </div>
            <div className="form__2">
              <label>
                Termin od
                <input name="dateFrom" type="date" required />
              </label>
              <label>
                Miejsce wydarzenia
                <input name="place" />
              </label>
            </div>
            <label>
              Uwagi
              <textarea name="notes" rows={3} />
            </label>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="btn btn--red" disabled={state === 'sending'}>
              {state === 'sending' ? 'Wysyłanie…' : `Zamów · ${pln(total)}`}
            </button>
            <p className="note">Tryb testowy: zamówienie nie generuje płatności ani rezerwacji.</p>
          </form>
        </div>
      </section>
    </>
  )
}

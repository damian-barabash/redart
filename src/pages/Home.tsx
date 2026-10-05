import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Hero } from '../components/hero/Hero'
import { Arrow, Img, SectionHead } from '../components/ui'
import { artists } from '../content/artists'
import { events, formatDate } from '../content/events'
import { galleries, galleryImages } from '../content/galleries'
import { pln, products } from '../content/products'
import { about, rentalTeaser, site } from '../content/site'
import { useCart } from '../lib/cart'

function ArtistSlider() {
  const track = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)

  const go = (dir: number) => {
    const el = track.current!
    const card = el.querySelector<HTMLElement>('.acard')!
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current!
    const card = el.querySelector<HTMLElement>('.acard')!
    setCur(Math.min(artists.length - 1, Math.round(el.scrollLeft / (card.offsetWidth + 20))))
  }

  return (
    <section className="section artists">
      <div className="wrap">
        <SectionHead title={<>Nasi <em>artyści</em></>} sub="02 — Management i booking koncertów" to="/artysci" more="Wszyscy artyści" />
      </div>
      <div className="artists__track rv" ref={track} onScroll={onScroll}>
        {artists.map((a, i) => {
          const inner = (
            <>
              <Img name={a.wide} alt={a.name} small />
              <span className="acard__n">0{i + 1}</span>
              <span className="acard__body">
                <strong>{a.name}</strong>
                <span>{a.external ? 'Strona artystki' : 'Poznaj artystę'} <Arrow /></span>
              </span>
            </>
          )
          return a.external ? (
            <a key={a.slug} className="acard" href={a.external} target="_blank" rel="noreferrer">
              {inner}
            </a>
          ) : (
            <Link key={a.slug} className="acard" to={`/artysci/${a.slug}`}>
              {inner}
            </Link>
          )
        })}
      </div>
      <div className="wrap artists__ctrl">
        <div className="counter" aria-hidden="true">
          {artists.map((_, i) => (
            <span key={i} className={i === cur ? 'is-on' : ''}>
              0{i + 1}
            </span>
          ))}
        </div>
        <div className="artists__btns">
          <button className="round" onClick={() => go(-1)} aria-label="Poprzedni artysta">
            <Arrow />
          </button>
          <button className="round" onClick={() => go(1)} aria-label="Następny artysta">
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  )
}

export function EventRows({ limit }: { limit?: number }) {
  return (
    <ol className="erows">
      {events.slice(0, limit).map((e) => {
        const d = formatDate(e.date)
        return (
          <li key={e.slug} className="rv">
            <Link to={`/eventy/${e.slug}`} className="erow">
              <time dateTime={e.date}>
                <b>{d.day}.{d.month}</b>
                <span>{d.year}</span>
              </time>
              <span className="erow__title">{e.title}</span>
              <span className="erow__place">{e.place}</span>
              <span className="erow__go">
                <Arrow />
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

export default function Home() {
  const { add } = useCart()
  const picks = [products.find((p) => p.slug === 'robe-pointe')!, products.find((p) => p.slug === 'martin-mac-aura-xip')!]
  const strip = ['galeria/polandrock-festival/10', 'galeria/dni-debicy/01', 'galeria/jaka-to-melodia/03']

  return (
    <>
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...about.scope, ...about.scope, ...about.scope, ...about.scope].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>

      <section className="section about">
        <div className="wrap">
          <div className="about__head rv">
            <p className="eyebrow">01 — redART</p>
            <h2 className="shead__title">Scena, którą znamy <em>od 1996 roku</em></h2>
          </div>
          <div className="about__cols rv">
            <p>{about.lead}</p>
            <p>{about.body}</p>
          </div>
          <ul className="chips rv" aria-label="Zakres realizacji">
            {about.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="about__strip">
            {strip.map((s, i) => (
              <div key={s} className="rv" style={{ transitionDelay: `${i * 80}ms` }}>
                <Img name={s} alt="Realizacja redART Events" small />
              </div>
            ))}
          </div>
          <div className="about__more rv">
            <Link className="btn btn--ghost" to="/o-nas">
              Więcej o redART
            </Link>
          </div>
        </div>
      </section>

      <ArtistSlider />

      <section className="section">
        <div className="wrap">
          <SectionHead title={<>Kalendarz <em>eventów</em></>} sub="03 — Wybrane koncerty i wydarzenia" to="/eventy" more="Wszystkie eventy" />
          <EventRows limit={6} />
        </div>
      </section>

      <section className="section">
        <div className="wrap rental">
          <div className="rental__main rv">
            <p className="eyebrow">04 — Rental</p>
            <h2>{rentalTeaser.title}</h2>
            {rentalTeaser.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <Link className="btn btn--red" to="/rental">
              Przejdź do sklepu
            </Link>
            <div className="rental__art" aria-hidden="true">
              <Img name="rental/claypaky-b-eye-k25" alt="" small />
            </div>
          </div>
          <div className="rental__side">
            {picks.map((p) => (
              <article key={p.id} className="pmini rv">
                <Link to={`/rental/${p.slug}`} className="pmini__img">
                  <Img name={p.image} alt={p.name} small />
                </Link>
                <div>
                  <h3>
                    <Link to={`/rental/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p>{pln(p.price)} / dzień</p>
                </div>
                <button className="round round--red" onClick={() => add(p.id)} aria-label={`Dodaj do koszyka: ${p.name}`}>
                  +
                </button>
              </article>
            ))}
            <Link className="rental__all rv" to="/rental">
              <span>Cały asortyment</span>
              <b>{products.length} urządzeń</b>
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead title={<>Galeria <em>realizacji</em></>} sub="05 — Zdjęcia z naszych wydarzeń" to="/galeria" more="Wszystkie galerie" />
          <div className="gtiles">
            {galleries.map((g, i) => (
              <Link key={g.slug} to={`/galeria/${g.slug}`} className="gtile rv" style={{ transitionDelay: `${i * 70}ms` }}>
                <Img name={galleryImages(g)[0]} alt={g.title} small />
                <span className="gtile__body">
                  <strong>{g.title}</strong>
                  <small>{g.count} zdjęć</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="news rv">
            <div>
              <p className="eyebrow">06 — Wiadomości</p>
              <h2>
                Bieżące informacje publikujemy <em>na Facebooku</em>
              </h2>
            </div>
            <a className="btn btn--dark" href={site.facebook} target="_blank" rel="noreferrer">
              facebook.com/redartevents <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="section section--last">
        <div className="wrap">
          <div className="cta rv">
            <h2>
              Planujesz koncert, festiwal lub <em>event firmowy?</em>
            </h2>
            <div className="cta__side">
              <a href={`tel:${site.contacts[0].phone.replace(/\s/g, '')}`}>{site.contacts[0].phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <Link className="btn btn--red" to="/kontakt">
                Napisz do nas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

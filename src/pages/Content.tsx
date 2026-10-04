// Podstrony treściowe: O nas, Artyści, Eventy, Galeria, Kontakt, Dofinansowanie
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Arrow, Crumbs, Img, Lightbox, PageHead } from '../components/ui'
import { artists } from '../content/artists'
import { events, formatDate } from '../content/events'
import { galleries, galleryImages } from '../content/galleries'
import { about, kpo, reactEu, site } from '../content/site'
import { submitContact, type SubmitResult } from '../lib/api'
import { EventRows } from './Home'

const tel = (p: string) => `tel:${p.replace(/\s/g, '')}`

export function NotFound() {
  return (
    <PageHead kicker="404" title={<>Nie ma takiej <em>strony</em></>}>
      <p>Adres mógł się zmienić po przebudowie serwisu.</p>
      <Link className="btn btn--red" to="/">
        Wróć na stronę główną
      </Link>
    </PageHead>
  )
}

export function About() {
  return (
    <>
      <PageHead kicker={`Od ${site.since} roku`} title={<>O <em>nas</em></>}>
        <p>{about.lead}</p>
      </PageHead>
      <section className="wrap split">
        <div className="split__media rv">
          <Img name="site/mikrofon" alt="Mikrofon na scenie" eager />
        </div>
        <div className="prose rv">
          <p>{about.body}</p>
          <ul className="chips">
            {about.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link className="btn btn--red" to="/kontakt">
            Porozmawiajmy o Twoim wydarzeniu
          </Link>
        </div>
      </section>

      <section className="wrap section" id="kpo">
        <div className="doc rv">
          <div className="doc__media">
            <Img name="site/kpo-plansza-2" alt="Plansza informacyjna projektu KPO" />
          </div>
          <div className="prose">
            <p className="eyebrow">Krajowy Plan Odbudowy</p>
            <p>{kpo.intro}</p>
            <p>{kpo.goal}</p>
            <p>{kpo.tasksLead}</p>
            <ul>
              {kpo.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p>{kpo.groups}</p>
            <p>{kpo.effectsLead}</p>
            <ul>
              {kpo.effects.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <dl className="facts">
              <div>
                <dt>Wartość przedsięwzięcia</dt>
                <dd>{kpo.value}</dd>
              </div>
              <div>
                <dt>Wartość dofinansowania z UE</dt>
                <dd>{kpo.funding}</dd>
              </div>
            </dl>
            <p className="tags">{kpo.tags.join(' ')}</p>
          </div>
        </div>
        <div className="doc__wide rv">
          <Img name="site/kpo-plansza" alt="Oznaczenia: Krajowy Plan Odbudowy, Rzeczpospolita Polska, NextGenerationEU" />
        </div>
      </section>
    </>
  )
}

export function Funding() {
  return (
    <>
      <PageHead kicker="Fundusze Europejskie" title={<>Dofinansowanie ze środków <em>REACT-EU</em></>} />
      <section className="wrap section--last">
        <div className="doc__wide rv">
          <Img name="site/react-eu-znaki" alt="Fundusze Europejskie, Rzeczpospolita Polska, Unia Europejska" eager />
        </div>
        <div className="prose prose--center rv">
          <p>{reactEu.intro}</p>
          <p>{reactEu.scopeLead}</p>
          <ul>
            {reactEu.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p>{reactEu.goal}</p>
          <h2>Efekty</h2>
          <p>{reactEu.effects}</p>
          <dl className="facts">
            <div>
              <dt>Beneficjent</dt>
              <dd>{reactEu.beneficiary}</dd>
            </div>
            <div>
              <dt>Wartość projektu</dt>
              <dd>{reactEu.value}</dd>
            </div>
            <div>
              <dt>Dofinansowanie projektu</dt>
              <dd>{reactEu.funding}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}

export function Artists() {
  return (
    <>
      <PageHead kicker="Management · booking" title={<>Nasi <em>artyści</em></>} />
      <section className="wrap alist section--last">
        {artists.map((a, i) => (
          <article key={a.slug} className="aitem rv">
            <div className="aitem__img">
              <Img name={a.image} alt={a.name} small={a.image.endsWith('-wide')} />
            </div>
            <div className="aitem__body">
              <span className="aitem__n">0{i + 1}</span>
              <h2>{a.name}</h2>
              <p>{a.excerpt}</p>
              {a.external ? (
                <a className="more" href={a.external} target="_blank" rel="noreferrer">
                  Strona artystki <Arrow />
                </a>
              ) : (
                <Link className="more" to={`/artysci/${a.slug}`}>
                  Więcej <Arrow />
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

export function ArtistPage() {
  const { slug } = useParams()
  const a = artists.find((x) => x.slug === slug && !x.external)
  if (!a) return <NotFound />
  return (
    <>
      <Crumbs items={[{ to: '/artysci', label: 'Artyści' }, { label: a.name }]} />
      <section className="wrap split split--top section--last">
        <div className="split__media split__media--sticky rv">
          <Img name={a.image} alt={a.name} eager />
        </div>
        <div className="prose rv">
          <p className="eyebrow">Artysta redART</p>
          <h1 className="phead__title phead__title--sm">{a.name}</h1>
          {a.bio.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <div className="links">
            {a.links.map((l) => (
              <a key={l.href} className="btn btn--ghost" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
            <Link className="btn btn--red" to="/kontakt">
              Zapytaj o koncert
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function Events() {
  return (
    <>
      <PageHead kicker="Kalendarz" title={<>Even<em>ty</em></>} />
      <section className="wrap events section--last">
        <EventRows />
        <div className="events__img rv">
          <Img name="eventy/eventy" alt="Koncert — publiczność pod sceną" />
        </div>
      </section>
    </>
  )
}

export function EventPage() {
  const { slug } = useParams()
  const e = events.find((x) => x.slug === slug)
  if (!e) return <NotFound />
  const d = formatDate(e.date)
  return (
    <>
      <Crumbs items={[{ to: '/eventy', label: 'Eventy' }, { label: e.title }]} />
      <section className={`wrap split split--top section--last${e.image ? '' : ' split--solo'}`}>
        {e.image && (
          <div className="split__media split__media--poster rv">
            <Img name={e.image} alt={e.title} eager />
          </div>
        )}
        <div className="prose rv">
          <p className="eyebrow">
            <time dateTime={e.date}>{d.full}</time> · {e.place}
          </p>
          <h1 className="phead__title phead__title--sm">{e.title}</h1>
          {e.body?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
          <div className="links">
            <Link className="btn btn--ghost" to="/eventy">
              Wszystkie eventy
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function Galleries() {
  return (
    <>
      <PageHead kicker="Zdjęcia z realizacji" title={<>Gale<em>rie</em></>} />
      <section className="wrap gtiles gtiles--page section--last">
        {galleries.map((g) => (
          <Link key={g.slug} to={`/galeria/${g.slug}`} className="gtile rv">
            <Img name={galleryImages(g)[0]} alt={g.title} small />
            <span className="gtile__body">
              <strong>{g.title}</strong>
              <small>
                Dodano: {g.added} · {g.count} zdjęć
              </small>
            </span>
          </Link>
        ))}
      </section>
    </>
  )
}

export function GalleryPage() {
  const { slug } = useParams()
  const [open, setOpen] = useState<number | null>(null)
  const g = galleries.find((x) => x.slug === slug)
  if (!g) return <NotFound />
  const images = galleryImages(g)
  return (
    <>
      <Crumbs items={[{ to: '/galeria', label: 'Galeria' }, { label: g.title }]} />
      <PageHead kicker={`Dodano: ${g.added}`} title={g.title} />
      <section className="wrap masonry section--last">
        {images.map((name, i) => (
          <button key={name} className="masonry__item rv" onClick={() => setOpen(i)} aria-label={`Powiększ zdjęcie ${i + 1}`}>
            <Img name={name} alt={`${g.title} — zdjęcie ${i + 1}`} small />
          </button>
        ))}
      </section>
      {open !== null && <Lightbox images={images} index={open} alt={g.title} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  )
}

export function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | SubmitResult>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('website')) return // honeypot
    setState('sending')
    setState(
      await submitContact({
        name: String(f.get('name')),
        email: String(f.get('email')),
        phone: String(f.get('phone')),
        topic: String(f.get('topic')),
        message: String(f.get('message')),
      }),
    )
  }

  const done = typeof state === 'object' && state.ok

  return (
    <>
      <PageHead kicker="Booking · management · rental" title={<>Kon<em>takt</em></>} />
      <section className="wrap contact section--last">
        <div className="contact__info rv">
          {site.contacts.map((c) => (
            <div key={c.role ?? c.name} className="contact__row">
              <span>{[c.name, c.role].filter(Boolean).join(' — ')}</span>
              <a href={tel(c.phone)}>{c.phone}</a>
            </div>
          ))}
          <div className="contact__row">
            <span>E-mail</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="contact__row">
            <span>Facebook</span>
            <a href={site.facebook} target="_blank" rel="noreferrer">
              redartevents
            </a>
          </div>
        </div>

        <div className="card rv">
          {done ? (
            <div className="done" role="status">
              <h2>Dziękujemy!</h2>
              <p>Numer zgłoszenia: {state.ref}</p>
              {state.test && <p className="note">Tryb testowy — wiadomość nie została jeszcze wysłana do redART. W pilnej sprawie zadzwoń lub napisz na {site.email}.</p>}
              <button className="btn btn--ghost" onClick={() => setState('idle')}>
                Nowa wiadomość
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit}>
              <h2>Napisz do nas</h2>
              <label>
                Imię i nazwisko
                <input name="name" required autoComplete="name" />
              </label>
              <div className="form__2">
                <label>
                  E-mail
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label>
                  Telefon
                  <input name="phone" type="tel" autoComplete="tel" />
                </label>
              </div>
              <label>
                Temat
                <select name="topic" defaultValue="Organizacja wydarzenia">
                  <option>Organizacja wydarzenia</option>
                  <option>Koncert artysty</option>
                  <option>Wypożyczenie sprzętu</option>
                  <option>Inny</option>
                </select>
              </label>
              <label>
                Wiadomość
                <textarea name="message" rows={5} required />
              </label>
              <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button className="btn btn--red" disabled={state === 'sending'}>
                {state === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

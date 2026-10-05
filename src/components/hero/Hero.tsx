import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { artists } from '../../content/artists'
import { products } from '../../content/products'
import { site } from '../../content/site'
import { asset } from '../../lib/asset'
import { Logo } from '../Logo'
import type { Pointer } from './Stage3D'

// three.js + modele ładują się osobnym chunkiem, dopiero gdy strona jest już interaktywna
const Stage3D = lazy(() => import('./Stage3D'))

const STATS = [
  { n: String(site.since), label: 'Na scenie od' },
  { n: 'Tysiące', label: 'Pomyślnych realizacji' },
  { n: String(artists.length).padStart(2, '0'), label: 'Artystów w managemencie' },
  { n: String(products.length).padStart(2, '0'), label: 'Urządzeń w wypożyczalni' },
]

export function Hero() {
  const stage = useRef<HTMLElement>(null)
  const logo = useRef<HTMLDivElement>(null)
  const pointer = useRef<Pointer>({ x: 0, y: 0, at: -1e9 })
  const [mount3d, setMount3d] = useState(false)
  const [active, setActive] = useState(true)
  // środek logo względem środka hero, w ułamku wysokości (dodatnie = wyżej) — tam celują reflektory
  const [aimY, setAimY] = useState(0.12)

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
    const id = idle(() => setMount3d(true))
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number)
  }, [])

  useEffect(() => {
    const el = stage.current!
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pointer.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      pointer.current.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)))
      pointer.current.at = performance.now()
    }
    // logo stoi w układzie strony (między belką a tytułem), więc cel wiązek bierzemy z jego faktycznego położenia
    const measure = () => {
      const r = el.getBoundingClientRect()
      const l = logo.current!.getBoundingClientRect()
      if (r.height) setAimY(0.5 - (l.top + l.height / 2 - r.top) / r.height)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    ro.observe(logo.current!)
    window.addEventListener('pointermove', move, { passive: true })
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => {
      window.removeEventListener('pointermove', move)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <section className="hero" ref={stage}>
      <div className="hero__bg">
        <video autoPlay muted loop playsInline preload="metadata" poster={asset('video/hero-poster.webp')} aria-hidden="true">
          <source src={asset('video/hero.webm')} type="video/webm" />
          <source src={asset('video/hero.mp4')} type="video/mp4" />
        </video>
      </div>
      <div className="hero__fx">
        {mount3d && (
          <Suspense fallback={null}>
            <Stage3D pointer={pointer} active={active} aimY={aimY} />
          </Suspense>
        )}
      </div>

      <div className="wrap hero__content">
        {/* strefa między belką z reflektorami a tytułem: logo w plamie światła, nad canvasem */}
        <div className="hero__zone">
          <div className="hero__logo" ref={logo}>
            <Logo />
          </div>
        </div>

        <div className="hero__bottom">
          <div>
            <p className="eyebrow rv">Od {site.since} roku na polskiej scenie</p>
            <h1 className="hero__title rv">
              Organizacja wydarzeń <em>artystycznych</em>
            </h1>
          </div>
          <div className="hero__side rv">
            <p>
              Koncerty, festiwale, dni miast i produkcje telewizyjne. Management artystów oraz wypożyczalnia sprzętu
              scenicznego — w jednym miejscu.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--red" to="/kontakt">
                Zapytaj o termin
              </Link>
              <Link className="btn btn--ghost" to="/rental">
                Wypożycz sprzęt
              </Link>
            </div>
          </div>
        </div>

        <ul className="hero__stats rv">
          {STATS.map((s, i) => (
            <li key={s.label}>
              <span>0{i + 1}</span>
              <b>{s.n}</b>
              <small>{s.label}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

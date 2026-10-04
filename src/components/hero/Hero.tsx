import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../../lib/asset'
import { Logo } from '../Logo'
import type { Pointer } from './Stage3D'

// three.js + modele ładują się osobnym chunkiem, dopiero gdy strona jest już interaktywna
const Stage3D = lazy(() => import('./Stage3D'))

export function Hero() {
  const stage = useRef<HTMLDivElement>(null)
  const fx = useRef<HTMLDivElement>(null)
  const pointer = useRef<Pointer>({ x: 0, y: 0, at: -1e9 })
  const [mount3d, setMount3d] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
    const id = idle(() => setMount3d(true))
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number)
  }, [])

  useEffect(() => {
    const el = stage.current!
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pointer.current.x = Math.max(-1.4, Math.min(1.4, ((e.clientX - r.left) / r.width) * 2 - 1))
      pointer.current.y = Math.max(-1.4, Math.min(1.4, -(((e.clientY - r.top) / r.height) * 2 - 1)))
      pointer.current.at = performance.now()
    }
    window.addEventListener('pointermove', move, { passive: true })
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => {
      window.removeEventListener('pointermove', move)
      io.disconnect()
    }
  }, [])

  const onAim = (x: number, y: number) => {
    fx.current?.style.setProperty('--ax', `${50 + x * 100}%`)
    fx.current?.style.setProperty('--ay', `${50 - y * 100}%`)
  }

  return (
    <section className="hero">
      <div className="wrap hero__head">
        <div className="hero__top rv">
          <p className="eyebrow">Od 1996 roku na polskiej scenie</p>
          <p className="hero__lead">
            Koncerty, festiwale, dni miast i produkcje telewizyjne. Management artystów oraz wypożyczalnia sprzętu
            scenicznego — w jednym miejscu.
          </p>
        </div>
        <h1 className="hero__title rv">
          Organizacja wydarzeń <em>artystycznych</em>
        </h1>
        <p className="hero__lead hero__lead--m">
          Koncerty, festiwale, dni miast i produkcje telewizyjne. Management artystów oraz wypożyczalnia sprzętu
          scenicznego — w jednym miejscu.
        </p>
      </div>

      <div className="wrap">
        <div className="stage" ref={stage}>
          <div className="stage__screen">
            <video autoPlay muted loop playsInline preload="metadata" poster={asset('video/hero-poster.webp')} aria-hidden="true">
              <source src={asset('video/hero.webm')} type="video/webm" />
              <source src={asset('video/hero.mp4')} type="video/mp4" />
            </video>
          </div>
          <div className="stage__fx" ref={fx}>
            <div className="stage__pool" />
            {mount3d && (
              <Suspense fallback={null}>
                <Stage3D pointer={pointer} active={active} onAim={onAim} />
              </Suspense>
            )}
            {/* logo nad canvasem: wiązki oświetlają plamę pod nim, a znak zostaje ostry */}
            <div className="stage__logo">
              <Logo />
            </div>
          </div>
          <div className="stage__cta">
            <Link className="btn btn--red" to="/kontakt">
              Zapytaj o termin
            </Link>
            <Link className="btn btn--light" to="/rental">
              Wypożycz sprzęt
            </Link>
          </div>
          <p className="stage__hint" aria-hidden="true">
            Porusz kursorem — reflektory podążają za Tobą
          </p>
        </div>
      </div>
    </section>
  )
}

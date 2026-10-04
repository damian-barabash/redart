import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { nav, site } from '../content/site'
import { useCart } from '../lib/cart'
import { asset } from '../lib/asset'
import { useReveal } from '../lib/useReveal'
import { Logo } from './Logo'

const tel = (p: string) => `tel:${p.replace(/\s/g, '')}`

function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', open)
    return () => document.documentElement.classList.remove('no-scroll')
  }, [open])

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap header__in">
        <Link to="/" className="header__logo" aria-label="redART Events — strona główna">
          <Logo />
        </Link>
        <nav className="header__nav" aria-label="Główna nawigacja">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header__side">
          <Link to="/koszyk" className="pill" aria-label={`Koszyk, pozycji: ${count}`}>
            Koszyk <span className="pill__n">{count}</span>
          </Link>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </div>
      {/* portal: nagłówek ma backdrop-filter, więc position:fixed liczyłoby się od niego, a nie od okna */}
      {createPortal(
        <div className={`menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
          <nav aria-label="Menu mobilne">
            {nav.map((n, i) => (
              <NavLink key={n.to} to={n.to} tabIndex={open ? 0 : -1} style={{ transitionDelay: `${60 + i * 40}ms` }}>
                <small>0{i + 1}</small>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="menu__foot">
            <a href={tel(site.contacts[0].phone)}>{site.contacts[0].phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>,
        document.body,
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo tone="dark" />
            <p>{site.tagline}. Od {site.since} roku.</p>
          </div>
          <div className="footer__col">
            <h3>Kontakt</h3>
            {site.contacts.slice(0, 2).map((c) => (
              <p key={c.role ?? c.name}>
                <span>{c.role ?? c.name}</span>
                <a href={tel(c.phone)}>{c.phone}</a>
              </p>
            ))}
            <p>
              <span>E-mail</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div className="footer__col">
            <h3>Strona</h3>
            {nav.map((n) => (
              <Link key={n.to} to={n.to}>
                {n.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <h3>Więcej</h3>
            <a href={site.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <Link to="/dofinansowanie-ze-srodkow-react-eu">Dofinansowanie REACT-EU</Link>
            <Link to="/o-nas#kpo">Projekt KPO</Link>
            <Link to="/koszyk">Koszyk</Link>
          </div>
        </div>
        <Link to="/dofinansowanie-ze-srodkow-react-eu" className="footer__eu" aria-label="Dofinansowanie ze środków REACT-EU">
          <img src={asset('media/site/react-eu-znaki.webp')} alt="Fundusze Europejskie, Rzeczpospolita Polska, Unia Europejska" loading="lazy" width={2400} height={370} />
        </Link>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {site.legalName}</span>
          <span>{site.www}</span>
        </div>
      </div>
    </footer>
  )
}

export function Layout() {
  const { pathname, hash } = useLocation()
  useReveal(pathname)

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) return el.scrollIntoView()
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a className="skip" href="#main">
        Przejdź do treści
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

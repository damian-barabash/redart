import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { media, mediaSize } from '../lib/asset'

export function Img({ name, alt, small, className, eager }: { name: string; alt: string; small?: boolean; className?: string; eager?: boolean }) {
  const { w, h } = mediaSize(name)
  return (
    <img
      className={className}
      src={media(name, small)}
      srcSet={small ? undefined : `${media(name, true)} 640w, ${media(name)} ${w}w`}
      sizes={small ? undefined : '(max-width: 720px) 100vw, 60vw'}
      width={w}
      height={h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export function PageHead({ kicker, title, children }: { kicker?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="phead wrap">
      {kicker && <p className="eyebrow rv">{kicker}</p>}
      <h1 className="phead__title rv">{title}</h1>
      {children && <div className="phead__lead rv">{children}</div>}
    </header>
  )
}

export function SectionHead({ title, sub, to, more }: { title: ReactNode; sub?: string; to?: string; more?: string }) {
  return (
    <div className="shead rv">
      <div>
        <h2 className="shead__title">{title}</h2>
        {sub && <p className="shead__sub">{sub}</p>}
      </div>
      {to && (
        <Link className="more" to={to}>
          {more ?? 'Zobacz wszystko'} <Arrow />
        </Link>
      )}
    </div>
  )
}

export const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Crumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav className="crumbs wrap" aria-label="Ścieżka">
      <Link to="/">Start</Link>
      {items.map((i) => (
        <span key={i.label}>{i.to ? <Link to={i.to}>{i.label}</Link> : i.label}</span>
      ))}
    </nav>
  )
}

export function Lightbox({ images, index, alt, onClose, onIndex }: { images: string[]; index: number; alt: string; onClose: () => void; onIndex: (i: number) => void }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(false), [index])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', key)
    document.documentElement.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', key)
      document.documentElement.classList.remove('no-scroll')
    }
  }, [index, images.length, onClose, onIndex])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button className="lightbox__close" aria-label="Zamknij" onClick={onClose}>
        ×
      </button>
      <button className="lightbox__nav lightbox__nav--prev" aria-label="Poprzednie zdjęcie" onClick={(e) => (e.stopPropagation(), onIndex((index - 1 + images.length) % images.length))}>
        ‹
      </button>
      <img
        key={images[index]}
        className={loaded ? 'is-loaded' : ''}
        src={media(images[index])}
        alt={`${alt} — zdjęcie ${index + 1} z ${images.length}`}
        onLoad={() => setLoaded(true)}
        onClick={(e) => e.stopPropagation()}
      />
      <button className="lightbox__nav lightbox__nav--next" aria-label="Następne zdjęcie" onClick={(e) => (e.stopPropagation(), onIndex((index + 1) % images.length))}>
        ›
      </button>
      <p className="lightbox__count">
        {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </p>
    </div>
  )
}

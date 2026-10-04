import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About, ArtistPage, Artists, Contact, EventPage, Events, Funding, Galleries, GalleryPage, NotFound } from './pages/Content'
import Home from './pages/Home'
import { CartPage, ProductPage, Rental } from './pages/Shop'

// adresy ze starego WordPressa -> nowe (linki z Google i z materiałów klienta mają dalej działać)
const OldEvent = () => <Navigate to={`/eventy/${useParams().slug}`} replace />
const legacy: [string, string][] = [
  ['/category/artysta', '/artysci'],
  ['/category/galeria', '/galeria'],
  ['/majka-jezowska', '/artysci/majka-jezowska'],
  ['/k-a-s-a', '/artysci/k-a-s-a'],
  ['/agnieszka-wiechnik', '/artysci/agnieszka-wiechnik'],
  ['/dni-debicy', '/galeria/dni-debicy'],
  ['/polandrock-festival', '/galeria/polandrock-festival'],
  ['/dni-gogolina', '/galeria/dni-gogolina'],
  ['/jaka-to-melodia', '/galeria/jaka-to-melodia'],
]

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="o-nas" element={<About />} />
        <Route path="artysci" element={<Artists />} />
        <Route path="artysci/:slug" element={<ArtistPage />} />
        <Route path="eventy" element={<Events />} />
        <Route path="eventy/:slug" element={<EventPage />} />
        <Route path="galeria" element={<Galleries />} />
        <Route path="galeria/:slug" element={<GalleryPage />} />
        <Route path="rental" element={<Rental />} />
        <Route path="rental/:slug" element={<ProductPage />} />
        <Route path="koszyk" element={<CartPage />} />
        <Route path="kontakt" element={<Contact />} />
        <Route path="dofinansowanie-ze-srodkow-react-eu" element={<Funding />} />
        <Route path="wydarzenie/:slug" element={<OldEvent />} />
        {legacy.map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

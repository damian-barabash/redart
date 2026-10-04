import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/montserrat/wght.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/base.css'
import './styles/site.css'
import './styles/pages.css'
import { App } from './App'
import { CartProvider } from './lib/cart'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)

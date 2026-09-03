import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Guarda o app inteiro em cache no primeiro acesso, para a queda de wi-fi da
// feira nao derrubar a bancada. So no build; em dev atrapalharia o hot reload.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* sem service worker o app continua funcionando, so nao abre offline */
    })
  })
}

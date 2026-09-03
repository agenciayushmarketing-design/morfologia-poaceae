import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: o dist/ funciona servido de qualquer caminho estatico (Vercel, subpasta, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // nada de data-uri surpresa; assets previsiveis para cache offline
  },
})

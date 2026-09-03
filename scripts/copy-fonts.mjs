// Copia os .woff2 do node_modules para public/fonts.
// Rodar uma vez (`npm run fonts`); os arquivos ficam versionados no repo,
// entao o build nao depende das devDependencies de fonte.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const destino = resolve(raiz, 'public/fonts')
mkdirSync(destino, { recursive: true })

const arquivos = [
  ['@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2', 'fraunces-variable-latin.woff2'],
  ['@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2', 'ibm-plex-sans-400.woff2'],
  ['@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2', 'ibm-plex-sans-600.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', 'ibm-plex-mono-400.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', 'ibm-plex-mono-500.woff2'],
]

for (const [origem, nome] of arquivos) {
  copyFileSync(resolve(raiz, 'node_modules', origem), resolve(destino, nome))
  console.log('->', nome)
}

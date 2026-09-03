// Gera dist/sw.js depois do build.
//
// Motivo: a feira nao tem rede confiavel. Sem service worker, basta o visitante
// recarregar a pagina com o wi-fi caido para ver tela branca. Com ele, tudo o
// que foi baixado no primeiro acesso fica em cache e o app abre offline.
// Continua sendo front-end estatico puro: nenhuma requisicao externa, nenhum
// dado sai do aparelho.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(raiz, 'dist')

function listar(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome)
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho]
  })
}

const arquivos = listar(dist)
  .map((c) => '/' + relative(dist, c).split('\\').join('/'))
  .filter((u) => u !== '/sw.js')
  .sort()

// a versao muda quando qualquer arquivo muda: cache velho e descartado no deploy
const versao = createHash('sha1')
  .update(arquivos.map((u) => u + statSync(join(dist, u.slice(1))).size).join('|'))
  .digest('hex')
  .slice(0, 10)

const sw = `// gerado por scripts/gerar-sw.mjs — nao editar a mao
const CACHE = 'poaceae-${versao}'
const ARQUIVOS = ${JSON.stringify(['/', ...arquivos], null, 2)}

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// cache primeiro: depois do primeiro acesso o app nao depende mais da rede
self.addEventListener('fetch', (evento) => {
  const req = evento.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return

  evento.respondWith(
    caches.match(req, { ignoreSearch: true }).then((achou) => {
      if (achou) return achou
      return fetch(req)
        .then((resposta) => {
          if (resposta.ok && resposta.type === 'basic') {
            const copia = resposta.clone()
            caches.open(CACHE).then((c) => c.put(req, copia))
          }
          return resposta
        })
        .catch(() => (req.mode === 'navigate' ? caches.match('/') : Promise.reject(new Error('offline'))))
    })
  )
})
`

writeFileSync(join(dist, 'sw.js'), sw)
console.log(`sw.js gerado — ${arquivos.length} arquivos, versão ${versao}`)

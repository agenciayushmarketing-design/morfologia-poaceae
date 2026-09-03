import { useEffect, useRef } from 'react'
import { secoes, ui } from '../data/site'
import useSecaoAtiva from '../hooks/useSecaoAtiva'
import useMovimentoReduzido from '../hooks/useMovimentoReduzido'

const IDS = secoes.map((s) => s.id)

export default function Nav() {
  const ativa = useSecaoAtiva(IDS)
  const movimentoReduzido = useMovimentoReduzido()
  const pilulas = useRef({})

  // a barra rola na horizontal a 375px; manter a pilula ativa a vista e o que
  // faz o visitante perceber que existem cinco modulos, e nao tres
  useEffect(() => {
    const el = pilulas.current[ativa]
    if (el?.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [ativa])

  const irPara = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: movimentoReduzido ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label={ui.navegacao}
      className="sticky top-0 z-40 border-b border-oliva/50 bg-pedra/95 backdrop-blur-sm"
    >
      <div className="relative mx-auto max-w-bancada">
        <ul className="rolagem-limpa flex gap-1.5 overflow-x-auto px-3 py-2 sm:px-6">
          {secoes.map((s) => {
            const sel = s.id === ativa
            return (
              <li key={s.id} className="shrink-0">
                <button
                  ref={(el) => {
                    pilulas.current[s.id] = el
                  }}
                  type="button"
                  onClick={() => irPara(s.id)}
                  aria-current={sel ? 'true' : undefined}
                  className={[
                    'toque flex items-center gap-2 rounded-plana border px-3 transition-colors duration-curta',
                    sel ? 'border-tinta bg-palha text-tinta' : 'border-oliva/50 bg-papel text-tinta',
                  ].join(' ')}
                >
                  <span className="font-mono text-micro tabular-nums">{String(s.n).padStart(2, '0')}</span>
                  <span className="text-apoio font-semibold">{s.nav}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {/* esmaecimento na borda: sinaliza que a barra continua */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-pedra to-transparent sm:hidden"
        />
      </div>
    </nav>
  )
}

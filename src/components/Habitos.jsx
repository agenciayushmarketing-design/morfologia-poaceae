import { useRef, useState } from 'react'
import HabitoSVG from './HabitoSVG'
import { habitos, notaHabitos } from '../data/habitos'
import { ui } from '../data/site'

function Medidor({ nivel }) {
  return (
    <span className="flex shrink-0 items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={[
            'block h-3 w-2.5 rounded-[1px] border border-tinta/60',
            i <= nivel ? 'bg-palha' : 'bg-transparent',
          ].join(' ')}
        />
      ))}
    </span>
  )
}

export default function Habitos() {
  const [ativo, setAtivo] = useState(habitos[0].id)
  const habito = habitos.find((h) => h.id === ativo)
  const abas = useRef({})

  // padrao de abas completo: setas, Home e End movem selecao e foco juntos
  const aoTeclar = (e) => {
    const passos = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }
    let destino = null
    if (e.key in passos) {
      const i = habitos.findIndex((h) => h.id === ativo)
      destino = habitos[(i + passos[e.key] + habitos.length) % habitos.length].id
    } else if (e.key === 'Home') destino = habitos[0].id
    else if (e.key === 'End') destino = habitos[habitos.length - 1].id
    if (!destino) return
    e.preventDefault()
    setAtivo(destino)
    abas.current[destino]?.focus()
  }

  return (
    <div>
      {/* alternancia por botao — nada depende de :hover */}
      <div
        role="tablist"
        aria-label={ui.habitos.abas}
        onKeyDown={aoTeclar}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {habitos.map((h) => {
          const sel = h.id === ativo
          return (
            <button
              key={h.id}
              ref={(el) => {
                abas.current[h.id] = el
              }}
              role="tab"
              type="button"
              id={`aba-${h.id}`}
              aria-selected={sel}
              aria-controls="painel-habito"
              tabIndex={sel ? 0 : -1}
              onClick={() => setAtivo(h.id)}
              className={[
                'toque flex flex-col items-start justify-center gap-0.5 rounded-plana border px-3 py-2 text-left',
                'transition-colors duration-curta',
                sel ? 'border-tinta bg-tinta text-pedra' : 'border-oliva/50 bg-papel text-tinta',
              ].join(' ')}
            >
              <span className="text-apoio font-semibold leading-tight">{h.nome}</span>
              <span
                className={['font-mono text-micro leading-tight', sel ? 'text-pedra/75' : 'text-legenda'].join(' ')}
              >
                {h.resumo}
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="painel-habito"
        role="tabpanel"
        aria-labelledby={`aba-${habito.id}`}
        className="mt-4 grid gap-4 lg:grid-cols-2"
      >
        <figure className="cartao overflow-hidden">
          <div className="px-2 py-2">
            <HabitoSVG habito={habito} />
          </div>
          <figcaption className="border-t border-oliva/45 px-4 py-3">
            <p className="font-mono text-micro text-legenda">
              <em>{habito.exemplo}</em> — {habito.exemploPopular}
            </p>
          </figcaption>
        </figure>

        <div className="space-y-4">
          <p className="text-corpo text-tinta">{habito.descricao}</p>

          <div className="cartao px-4 py-3">
            <p className="rotulo text-legenda">{ui.habitos.consequencia}</p>
            <p className="mt-2 text-apoio text-tinta">{habito.consequencia}</p>
          </div>

          <ul className="cartao divide-y divide-oliva/35">
            {habito.indicadores.map((ind) => (
              <li key={ind.rotulo} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="font-mono text-micro uppercase tracking-wide text-legenda">{ind.rotulo}</span>
                <span className="flex items-center gap-2.5">
                  <span className="font-mono text-apoio font-medium text-tinta">{ind.valor}</span>
                  <Medidor nivel={ind.nivel} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 max-w-leitura font-mono text-micro leading-relaxed text-legenda">— {notaHabitos}</p>
    </div>
  )
}

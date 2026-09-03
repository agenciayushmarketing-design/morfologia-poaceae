import { useState } from 'react'
import { especies, rodapeEspecies } from '../data/especies'
import { ui } from '../data/site'

function Selo({ children, forte }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-plana border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wide',
        forte ? 'border-tinta bg-palha text-tinta' : 'border-oliva/60 text-legenda',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export default function Especies() {
  const [aberta, setAberta] = useState(null)

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {especies.map((e) => {
          const expandida = aberta === e.id
          return (
            <li key={e.id} className="cartao overflow-hidden">
              <button
                type="button"
                onClick={() => setAberta(expandida ? null : e.id)}
                aria-expanded={expandida}
                aria-controls={`ficha-${e.id}`}
                className="toque flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-curta"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-corpo leading-tight text-tinta">
                    <em className="font-semibold">{e.cientifico}</em>
                    {e.cultivar ? <span className="text-legenda"> {e.cultivar}</span> : null}
                  </span>
                  <span className="mt-0.5 block font-mono text-micro text-legenda">{e.popular}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-oliva/60 font-mono text-micro text-tinta"
                >
                  {expandida ? '−' : '+'}
                </span>
              </button>

              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                <Selo>{e.habito}</Selo>
                <Selo forte={e.rota === 'C3'}>{e.rota}</Selo>
              </div>

              <dl className="divide-y divide-oliva/35 border-t border-oliva/45">
                {e.medidas.map((m) => (
                  <div key={m.rotulo} className="flex items-baseline justify-between gap-3 px-4 py-2">
                    <dt className="font-mono text-micro uppercase tracking-wide text-legenda">{m.rotulo}</dt>
                    <dd className="font-mono text-apoio font-medium text-tinta tabular-nums">{m.valor}</dd>
                  </div>
                ))}
              </dl>

              {expandida ? (
                <div id={`ficha-${e.id}`} className="space-y-3 border-t border-oliva/45 px-4 py-4">
                  <p className="text-apoio text-tinta">{e.descricao}</p>
                  <div>
                    <p className="rotulo text-legenda">{ui.especies.atencao}</p>
                    <p className="mt-1 text-apoio text-tinta">{e.atencao}</p>
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      <p className="mt-5 max-w-leitura font-mono text-micro leading-relaxed text-legenda">— {rodapeEspecies}</p>
    </div>
  )
}

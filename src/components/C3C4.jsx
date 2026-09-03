import { useState } from 'react'
import {
  rotas,
  eficiencia,
  escalaTemperatura,
  regiao,
  inversao,
  comparativo,
  notaFotossintese,
} from '../data/fotossintese'
import { ui } from '../data/site'

const { min, max, passo, inicial } = escalaTemperatura
const pos = (t) => ((t - min) / (max - min)) * 100
const TICKS = [10, 15, 20, 25, 30, 35, 40]

export default function C3C4() {
  const [t, setT] = useState(inicial)

  const valores = rotas.map((r) => ({ rota: r, valor: eficiencia(r, t) }))
  const lider = valores[0].valor >= valores[1].valor ? valores[0] : valores[1]
  const perdedor = lider === valores[0] ? valores[1] : valores[0]
  const vantagem = perdedor.valor > 0 ? lider.valor / perdedor.valor : null

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
      <div className="cartao px-4 py-5 sm:px-6">
        {/* leitura grande */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <label htmlFor="termometro" className="rotulo block text-legenda">
              {ui.fotossintese.temperatura}
            </label>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="display text-[clamp(3rem,14vw,4.5rem)] leading-none text-tinta tabular-nums">
                {t}
              </span>
              <span className="font-mono text-guia text-legenda">{ui.fotossintese.unidade}</span>
            </p>
          </div>
          <p className="rounded-plana bg-tinta px-3 py-2 font-mono text-micro leading-relaxed text-pedra">
            {ui.fotossintese.vantagem}: <span className="font-medium text-palha">{lider.rota.nome}</span>
            {vantagem ? <> · {vantagem.toFixed(1).replace('.', ',')}× a {perdedor.rota.nome}</> : null}
          </p>
        </div>

        {/* controle */}
        <div className="mt-5">
          <input
            id="termometro"
            className="termometro"
            type="range"
            min={min}
            max={max}
            step={passo}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            aria-valuetext={`${t} ${ui.fotossintese.leituraGraus}`}
          />

          {/* regua: faixa da regiao em cima, marcacao numerica embaixo,
              sem nada cruzando os numeros */}
          <div className="mx-[17px]">
            <div className="relative h-5 border-t border-oliva/60" aria-hidden="true">
              {/* faixa tipica da regiao da feira */}
              <div
                className="absolute inset-y-0 border-x border-dashed border-tinta bg-palha/45"
                style={{ left: `${pos(regiao.min)}%`, width: `${pos(regiao.max) - pos(regiao.min)}%` }}
              />
              {/* ponto de inversao */}
              {inversao ? (
                <div
                  className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-tinta"
                  style={{ left: `${pos(inversao)}%` }}
                />
              ) : null}
            </div>

            <div className="relative h-7" aria-hidden="true">
              {TICKS.map((tick) => (
                <div
                  key={tick}
                  className="absolute top-0 -translate-x-1/2"
                  style={{ left: `${pos(tick)}%` }}
                >
                  <div className="mx-auto h-1.5 w-px bg-oliva" />
                  <div className="mt-1 font-mono text-[0.625rem] text-legenda tabular-nums">{tick}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-micro text-legenda">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 border border-dashed border-tinta bg-palha/40" aria-hidden="true" />
              {regiao.nome} · {regiao.min}–{regiao.max} {ui.fotossintese.unidade}
            </span>
            {inversao ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-px bg-tinta" aria-hidden="true" />
                {ui.fotossintese.inversaoEm} {String(inversao).replace('.', ',')} {ui.fotossintese.unidade}
              </span>
            ) : null}
          </div>
        </div>

        {/* barras */}
        <div className="mt-6 space-y-3">
          {valores.map(({ rota, valor }) => {
            const ehLider = rota.id === lider.rota.id
            return (
              <div key={rota.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-apoio font-medium text-tinta">
                    {rota.nome}
                    <span className="ml-2 font-normal text-legenda">{rota.apelido}</span>
                  </p>
                  <p className="font-mono text-apoio font-medium text-tinta tabular-nums">
                    {Math.round(valor)}
                    <span className="text-legenda">%</span>
                  </p>
                </div>
                <div className="mt-1.5 h-8 w-full border border-tinta/30 bg-papel">
                  <div
                    className={[
                      'h-full border-r transition-[width] duration-curta ease-out',
                      rota.id === 'c4' ? 'bg-palha border-tinta' : 'bg-tinta border-tinta',
                    ].join(' ')}
                    style={{ width: `${Math.max(1.5, valor)}%` }}
                    role="meter"
                    aria-valuenow={Math.round(valor)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${ui.fotossintese.leituraBarra} ${rota.nome} a ${t} ${ui.fotossintese.leituraGraus}`}
                  />
                </div>
                <p className="mt-1 font-mono text-micro text-legenda">
                  {ehLider ? <span className="font-medium text-tinta">{ui.fotossintese.emVantagem} · </span> : null}
                  {ui.fotossintese.otimo} {rota.otimo} {ui.fotossintese.unidade} · {rota.exemplos}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* tres linhas em mono */}
      <div className="space-y-3">
        {comparativo.map((c) => (
          <div key={c.id} className="cartao px-4 py-3">
            <p className="rotulo text-legenda">{c.rotulo}</p>
            <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-apoio">
              <div className="flex items-baseline gap-2">
                <dt className="text-legenda">C3</dt>
                <dd className="font-medium text-tinta">{c.c3}</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-legenda">C4</dt>
                <dd className="font-medium text-tinta">{c.c4}</dd>
              </div>
            </dl>
            <p className="mt-2 text-apoio text-tinta">{c.texto}</p>
          </div>
        ))}
        <p className="max-w-leitura font-mono text-micro leading-relaxed text-legenda">— {notaFotossintese}</p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { questoes, desfechos, chaveRecorde } from '../data/quiz'
import { ui } from '../data/site'

function lerRecorde() {
  try {
    const bruto = window.localStorage.getItem(chaveRecorde)
    const n = Number(bruto)
    return Number.isFinite(n) && n >= 0 && n <= questoes.length ? n : null
  } catch {
    return null
  }
}

function gravarRecorde(n) {
  try {
    window.localStorage.setItem(chaveRecorde, String(n))
  } catch {
    /* modo privado, cota cheia: o app segue funcionando sem recorde */
  }
}

const ESTADO_INICIAL = { indice: 0, escolha: null, acertos: 0, terminou: false }

export default function Quiz() {
  const [estado, setEstado] = useState(ESTADO_INICIAL)
  const [recorde, setRecorde] = useState(null)

  useEffect(() => {
    setRecorde(lerRecorde())
  }, [])

  const { indice, escolha, acertos, terminou } = estado
  const questao = questoes[indice]
  const respondida = escolha !== null

  const recomecar = () => setEstado(ESTADO_INICIAL)

  const responder = (i) => {
    if (respondida) return
    setEstado((s) => ({
      ...s,
      escolha: i,
      acertos: s.acertos + (i === questao.correta ? 1 : 0),
    }))
  }

  const avancar = () => {
    if (indice + 1 >= questoes.length) {
      setEstado((s) => ({ ...s, terminou: true }))
      if (recorde === null || acertos > recorde) {
        gravarRecorde(acertos)
        setRecorde(acertos)
      }
      return
    }
    setEstado((s) => ({ ...s, indice: s.indice + 1, escolha: null }))
  }

  const desfecho = desfechos.find((d) => acertos >= d.minimo) || desfechos[desfechos.length - 1]

  return (
    <div className="max-w-leitura">
      {/* barra de estado — o Recomecar fica sempre visivel */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-micro uppercase tracking-wide text-legenda">
          {terminou ? ui.quiz.resultado : `${ui.quiz.pergunta} ${indice + 1} ${ui.quiz.de} ${questoes.length}`}
        </p>
        <button type="button" onClick={recomecar} className="btn-vazado border-oliva/60 px-3">
          {ui.quiz.recomecar}
        </button>
      </div>

      <div className="mt-3 flex gap-1" aria-hidden="true">
        {questoes.map((q, i) => (
          <span
            key={q.id}
            className={[
              'h-1.5 flex-1 rounded-[1px] border border-tinta/30',
              terminou || i < indice || (i === indice && respondida) ? 'bg-tinta' : 'bg-transparent',
            ].join(' ')}
          />
        ))}
      </div>

      {terminou ? (
        <div className="mt-5">
          <div className="sobre-tinta rounded-card bg-tinta px-5 py-6 text-pedra">
            <p className="rotulo text-pedra/70">{ui.quiz.acertos}</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="display text-placar text-palha tabular-nums">{acertos}</span>
              <span className="font-mono text-guia text-pedra/70">
                {ui.quiz.de} {questoes.length}
              </span>
            </p>
            <p className="display-leve mt-3 text-guia text-pedra">{desfecho.titulo}</p>
            <p className="mt-1 text-apoio text-pedra/80">{desfecho.texto}</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-micro text-legenda">
              {ui.quiz.recorde}{' '}
              <span className="font-medium text-tinta">
                {recorde === null ? ui.quiz.semRecorde : `${recorde}/${questoes.length}`}
              </span>
            </p>
            <button type="button" onClick={recomecar} className="btn-acento">
              {ui.quiz.recomecarLongo}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="rotulo text-legenda">{questao.origem}</p>
          <h3 className="display-leve mt-2 text-guia leading-snug text-tinta">{questao.pergunta}</h3>

          <ul className="mt-4 space-y-2">
            {questao.opcoes.map((opcao, i) => {
              const certa = i === questao.correta
              const minha = i === escolha
              let estilo = 'border-oliva/50 bg-papel text-tinta'
              if (respondida && certa) estilo = 'border-tinta bg-palha text-tinta'
              else if (respondida && minha) estilo = 'border-tinta bg-papel text-tinta'
              else if (respondida) estilo = 'border-oliva/40 bg-papel text-legenda'

              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => responder(i)}
                    disabled={respondida}
                    className={[
                      'toque flex w-full items-start gap-3 rounded-plana border px-3 py-3 text-left',
                      'transition-colors duration-curta disabled:cursor-default',
                      estilo,
                    ].join(' ')}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current font-mono text-micro"
                    >
                      {respondida && certa ? '✓' : respondida && minha ? '✕' : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-apoio leading-snug">{opcao}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div aria-live="polite">
            {respondida ? (
              <div className="mt-4 cartao px-4 py-4">
                <p className="rotulo text-legenda">
                  {escolha === questao.correta ? ui.quiz.certo : ui.quiz.errado}
                </p>
                <p className="mt-2 text-apoio text-tinta">{questao.explicacao}</p>
                <button type="button" onClick={avancar} className="btn-solido mt-4 w-full sm:w-auto">
                  {indice + 1 >= questoes.length ? ui.quiz.verResultado : ui.quiz.proximaPergunta}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import PranchaSVG from './PranchaSVG'
import { estruturas, legendaPrancha } from '../data/estruturas'
import { ui } from '../data/site'
import useMovimentoReduzido from '../hooks/useMovimentoReduzido'

export default function Prancha() {
  const [selecionado, setSelecionado] = useState(null)
  const movimentoReduzido = useMovimentoReduzido()

  // a sequencia de crescimento roda uma vez, quando a prancha entra em cena
  const [visivel, setVisivel] = useState(false)
  const alvoRef = useRef(null)
  useEffect(() => {
    const el = alvoRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          obs.disconnect()
        }
      },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const atual = estruturas.find((e) => e.id === selecionado) || null
  const indice = atual ? estruturas.indexOf(atual) : -1

  const irPara = (passo) => {
    const proximo = (indice + passo + estruturas.length) % estruturas.length
    setSelecionado(estruturas[proximo].id)
  }

  const animar = visivel && !movimentoReduzido

  return (
    <div ref={alvoRef} className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
      <div className="min-w-0">
        {/* ---- a prancha ---- */}
        <figure className="cartao overflow-hidden">
          <figcaption className="border-b border-oliva/45 px-4 py-3">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="rotulo text-tinta">{legendaPrancha.titulo}</span>
              <span className="font-mono text-micro text-legenda">{legendaPrancha.subtitulo}</span>
            </span>
            <span className="mt-2 inline-block rounded-plana bg-palha px-2 py-1 font-mono text-micro text-tinta">
              {legendaPrancha.instrucao}
            </span>
          </figcaption>
          <div className="px-2 pb-3 pt-4 sm:px-4">
            <PranchaSVG selecionado={selecionado} onSelecionar={setSelecionado} animar={animar} />
          </div>
          <ul className="space-y-1 border-t border-oliva/45 px-4 py-3">
            {legendaPrancha.notas.map((nota) => (
              <li key={nota} className="font-mono text-micro leading-relaxed text-legenda">
                — {nota}
              </li>
            ))}
          </ul>
        </figure>

        {/* ---- painel: gruda no rodape da tela enquanto a prancha rola.
                so existe quando ha selecao, para nao roubar area a toa ---- */}
        {atual ? (
          <div className="sticky bottom-0 z-30 mt-4 pb-3 lg:hidden">
            <Painel estrutura={atual} onFechar={() => setSelecionado(null)} onNavegar={irPara} />
          </div>
        ) : null}

        {/* ---- legenda: os controles de verdade, com alvo de 44px ---- */}
        <div className="mt-6">
          <p className="rotulo text-legenda">{ui.prancha.legenda}</p>
          <ul className="mt-3 grid grid-cols-2 gap-1.5 lg:grid-cols-3">
            {estruturas.map((e) => {
              const ativo = e.id === selecionado
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelecionado(ativo ? null : e.id)}
                    aria-pressed={ativo}
                    className={[
                      'toque flex w-full items-center gap-3 rounded-plana border px-2.5 py-2 text-left',
                      'transition-colors duration-curta',
                      ativo ? 'border-tinta bg-tinta text-pedra' : 'border-oliva/50 bg-papel text-tinta',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-apoio font-medium',
                        ativo
                          ? 'border-palha bg-palha text-tinta'
                          : e.destaque
                            ? 'border-folha bg-folha/15 text-tinta'
                            : 'border-oliva/60 text-tinta',
                      ].join(' ')}
                    >
                      {e.n}
                    </span>
                    <span className="text-apoio leading-tight">{e.curto || e.nome}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* ---- painel lateral no desktop ---- */}
      <div className="hidden lg:sticky lg:top-24 lg:block">
        <Painel estrutura={atual} onFechar={() => setSelecionado(null)} onNavegar={irPara} />
      </div>
    </div>
  )
}

function Painel({ estrutura, onFechar, onNavegar }) {
  if (!estrutura) {
    return (
      <div className="cartao flex items-center gap-3 px-4 py-3">
        <span className="rotulo text-legenda">{ui.prancha.painel}</span>
        <span className="font-mono text-micro text-legenda">{ui.prancha.aguardando}</span>
      </div>
    )
  }

  return (
    <div
      className="cartao max-h-[54vh] overflow-y-auto shadow-[0_-8px_28px_-14px_rgba(27,42,47,0.45)] lg:max-h-none lg:shadow-none"
      role="region"
      aria-live="polite"
      aria-label={`${ui.prancha.estrutura} ${estrutura.n}: ${estrutura.nome}`}
    >
      <div className="sticky top-0 flex items-start gap-3 border-b border-oliva/45 bg-papel px-4 py-3">
        <span
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-corpo font-medium text-tinta',
            estrutura.destaque ? 'border-folha bg-folha/25' : 'border-tinta bg-palha',
          ].join(' ')}
        >
          {estrutura.n}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="display-leve text-guia leading-tight text-tinta">{estrutura.nome}</h3>
          {estrutura.destaque ? <p className="rotulo mt-1 text-folha">{ui.prancha.pontoChave}</p> : null}
        </div>
        <button
          type="button"
          onClick={onFechar}
          aria-label={ui.prancha.fechar}
          className="toque -mr-3 -mt-2 flex items-center justify-center rounded-plana text-legenda"
        >
          <span aria-hidden="true" className="text-guia leading-none">
            ×
          </span>
        </button>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div>
          <p className="rotulo text-legenda">{ui.prancha.oQueE}</p>
          <p className="mt-1 text-apoio text-tinta">{estrutura.funcao}</p>
        </div>
        <div>
          <p className="rotulo text-legenda">{ui.prancha.porQueImporta}</p>
          {estrutura.importa.split('\n\n').map((paragrafo) => (
            <p key={paragrafo.slice(0, 24)} className="mt-1 text-apoio text-tinta">
              {paragrafo}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-oliva/45 bg-papel px-3 py-2">
        <button type="button" onClick={() => onNavegar(-1)} className="btn-vazado border-oliva/60 px-3">
          <span aria-hidden="true">←</span> {ui.prancha.anterior}
        </button>
        <span className="font-mono text-micro text-legenda">
          {estrutura.n} / {estruturas.length}
        </span>
        <button type="button" onClick={() => onNavegar(1)} className="btn-vazado border-oliva/60 px-3">
          {ui.prancha.proxima} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

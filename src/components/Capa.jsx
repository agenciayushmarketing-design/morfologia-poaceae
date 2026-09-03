import { capa } from '../data/site'
import useMovimentoReduzido from '../hooks/useMovimentoReduzido'

export default function Capa() {
  const movimentoReduzido = useMovimentoReduzido()

  const comecar = () => {
    const el = document.getElementById('prancha')
    if (el) el.scrollIntoView({ behavior: movimentoReduzido ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <header className="trama">
      <div className="mx-auto w-full max-w-bancada px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-20">
        <p className="rotulo text-legenda">{capa.etiqueta}</p>
        <h1 className="display mt-4 max-w-[16ch] text-[clamp(2.25rem,10vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-tinta">
          {capa.titulo}
        </h1>
        <div className="filete my-6 max-w-leitura" />
        <p className="max-w-leitura text-guia text-tinta">{capa.chamada}</p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button type="button" onClick={comecar} className="btn-acento px-5">
            {capa.acao}
            <span aria-hidden="true">↓</span>
          </button>
          <span className="font-mono text-micro text-legenda">{capa.duracao}</span>
        </div>
      </div>
    </header>
  )
}

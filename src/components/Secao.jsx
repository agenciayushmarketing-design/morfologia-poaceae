import { ui } from '../data/site'

export default function Secao({ id, n, titulo, chamada, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="trama border-t border-oliva/40">
      <div className="mx-auto w-full max-w-bancada px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-8 max-w-leitura">
          <p className="rotulo text-legenda">
            {ui.modulo} {String(n).padStart(2, '0')}
          </p>
          <h2 id={`${id}-titulo`} className="display mt-3 text-titulo text-tinta">
            {titulo}
          </h2>
          <p className="mt-3 text-guia text-legenda">{chamada}</p>
        </header>
        {children}
      </div>
    </section>
  )
}

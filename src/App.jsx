import Capa from './components/Capa'
import Nav from './components/Nav'
import Secao from './components/Secao'
import Prancha from './components/Prancha'
import Habitos from './components/Habitos'
import C3C4 from './components/C3C4'
import Quiz from './components/Quiz'
import Especies from './components/Especies'
import { secoes, rodape, ui } from './data/site'

const CONTEUDO = {
  prancha: Prancha,
  habitos: Habitos,
  fotossintese: C3C4,
  desafio: Quiz,
  especies: Especies,
}

export default function App() {
  return (
    <>
      <a href="#prancha" className="pular btn-solido">
        {ui.pularParaConteudo}
      </a>

      <Capa />
      <Nav />

      <main>
        {secoes.map((s) => {
          const Conteudo = CONTEUDO[s.id]
          return (
            <Secao key={s.id} id={s.id} n={s.n} titulo={s.titulo} chamada={s.chamada}>
              <Conteudo />
            </Secao>
          )
        })}
      </main>

      <footer className="trama border-t border-oliva/50">
        <div className="mx-auto w-full max-w-bancada space-y-2 px-4 py-10 sm:px-6">
          {rodape.linhas.map((linha) => (
            <p key={linha} className="max-w-leitura text-apoio text-legenda">
              {linha}
            </p>
          ))}
          <p className="pt-2 font-mono text-micro uppercase tracking-wide text-legenda">
            {rodape.creditoTipografia}
          </p>
        </div>
      </footer>
    </>
  )
}

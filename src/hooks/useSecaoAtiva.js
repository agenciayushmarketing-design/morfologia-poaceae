import { useEffect, useState } from 'react'

/** Devolve o id da secao que ocupa a faixa de leitura da tela. */
export default function useSecaoAtiva(ids) {
  const [ativa, setAtiva] = useState(ids[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const alvos = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!alvos.length) return

    const visiveis = new Map()
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => visiveis.set(e.target.id, e.intersectionRatio))
        let melhor = null
        let maior = 0
        visiveis.forEach((ratio, id) => {
          if (ratio > maior) {
            maior = ratio
            melhor = id
          }
        })
        if (melhor && maior > 0) setAtiva(melhor)
      },
      // ignora a faixa coberta pela barra fixa e o rodape da tela
      { rootMargin: '-76px 0px -45% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] }
    )
    alvos.forEach((a) => obs.observe(a))
    return () => obs.disconnect()
  }, [ids])

  return ativa
}

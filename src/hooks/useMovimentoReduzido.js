import { useEffect, useState } from 'react'

const CONSULTA = '(prefers-reduced-motion: reduce)'

/** true quando o visitante pediu menos movimento no sistema. */
export default function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(CONSULTA).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(CONSULTA)
    const aoMudar = (e) => setReduzido(e.matches)
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [])

  return reduzido
}

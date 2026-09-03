import { useMemo } from 'react'
import { construirLamina, construirRaizes, construirHasteRasteira } from './svgPartes'

// Mesmo motor da prancha (modulo 1), montado em quatro arranjos diferentes.
const VB = { largura: 400, altura: 250 }

const TRACO = { fill: 'none', stroke: 'rgb(var(--tinta))', strokeLinecap: 'round', strokeLinejoin: 'round' }
const APOIO = { fill: 'none', stroke: 'rgb(var(--oliva))', strokeLinecap: 'round' }
const VIVO = { fill: 'none', stroke: 'rgb(var(--folha))', strokeLinecap: 'round', strokeLinejoin: 'round' }

/**
 * Touceira vegetativa: um leque de laminas longas saindo de uma base
 * comprimida. Na fase vegetativa a gramínea nao mostra colmo — o que se ve
 * e exatamente isso, um chumaco de folhas que sobem e arqueiam.
 */
function laminasDaTouceira({ x, y, altura, espalhamento, escala }) {
  const n = 9
  return Array.from({ length: n }, (_, i) => {
    const s = (i / (n - 1) - 0.5) * 2 // -1 .. 1
    // ruido deterministico, para o leque nao sair simetrico como um desenho de CAD
    const ruido = Math.sin(i * 12.9898 + x * 0.017)
    const hb = altura * (0.6 + 0.4 * (1 - Math.abs(s) * 0.9)) * (1 + ruido * 0.08)
    const lateral = s * espalhamento * (1 + ruido * 0.12)
    return construirLamina({
      base: [x + s * 4, y],
      c1: [x + s * 7, y - hb * 0.56],
      c2: [x + lateral * 0.55, y - hb * (1.03 + ruido * 0.04)],
      ponta: [x + lateral, y - hb * 0.72],
      largura: 10 * escala,
      nervuras: 1,
      afinamento: 1,
    })
  })
}

function Folha({ dados, vivo, largura = 1.3 }) {
  const cor = vivo ? 'rgb(var(--folha))' : 'rgb(var(--tinta))'
  return (
    <g>
      <path
        d={dados.contorno}
        fill={vivo ? 'rgb(var(--folha) / 0.12)' : 'rgb(var(--papel))'}
        stroke={cor}
        strokeWidth={largura}
        strokeLinejoin="round"
      />
      {dados.nervuras.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={vivo ? 'rgb(var(--folha) / 0.6)' : 'rgb(var(--oliva))'}
          strokeWidth="0.7"
        />
      ))}
    </g>
  )
}

function Touceira({
  x,
  y,
  altura = 112,
  espalhamento = 62,
  escala = 1,
  alcanceRaiz = 26,
  profundidadeRaiz = 46,
  vivo = false,
}) {
  const folhas = useMemo(
    () => laminasDaTouceira({ x, y, altura, espalhamento, escala }),
    [x, y, altura, espalhamento, escala]
  )
  const raizes = useMemo(
    () =>
      profundidadeRaiz > 0
        ? construirRaizes({ x, y, quantidade: 8, alcance: alcanceRaiz, profundidade: profundidadeRaiz })
        : { principais: [], finas: [] },
    [x, y, alcanceRaiz, profundidadeRaiz]
  )

  return (
    <g>
      <g {...TRACO} strokeWidth="1.1">
        {raizes.principais.map((d, i) => (
          <path key={`r${i}`} d={d} />
        ))}
      </g>
      {folhas.map((f, i) => (
        <Folha key={i} dados={f} vivo={vivo} largura={1.4} />
      ))}
      {/* base comprimida: as bainhas encaixadas */}
      <g fill="none" stroke={vivo ? 'rgb(var(--folha))' : 'rgb(var(--tinta))'} strokeWidth="1.3" strokeLinecap="round">
        <path d={`M${x - 7},${y} C${x - 6},${y - 12 * escala} ${x - 4},${y - 18 * escala} ${x - 3},${y - 24 * escala}`} />
        <path d={`M${x + 7},${y} C${x + 6},${y - 12 * escala} ${x + 4},${y - 18 * escala} ${x + 3},${y - 24 * escala}`} />
      </g>
    </g>
  )
}

function Solo({ y, x1 = 12, x2 = 388 }) {
  const ticks = Math.floor((x2 - x1) / 16)
  return (
    <g {...APOIO} strokeWidth="1.2">
      <path d={`M${x1},${y} L${x2},${y}`} />
      {Array.from({ length: ticks }, (_, i) => (
        <path key={i} d={`M${x1 + 6 + i * 16},${y + 2} l-6,7`} />
      ))}
    </g>
  )
}

function Rotulo({ x, y, children, ancora = 'start' }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={ancora}
      className="font-mono"
      fontSize="13"
      fontWeight="500"
      fill="rgb(var(--oliva-texto))"
    >
      {children}
    </text>
  )
}

/* ------------------------------------------------------------------ */

function Cespitoso({ rotulos }) {
  return (
    <g>
      <Solo y={168} />
      <Touceira x={106} y={168} altura={118} espalhamento={64} />
      <Touceira x={294} y={168} altura={102} espalhamento={56} escala={0.92} />
      {/* o vao de solo descoberto entre as touceiras */}
      <g fill="none" stroke="rgb(var(--oliva-texto))" strokeWidth="1.3" strokeLinecap="round">
        <path d="M144,198 L256,198" strokeDasharray="5 4" />
        <path d="M144,192 L144,204" />
        <path d="M256,192 L256,204" />
      </g>
      <Rotulo x={200} y={222} ancora="middle">
        {rotulos.nota}
      </Rotulo>
      <Rotulo x={14} y={26}>
        {rotulos.vista}
      </Rotulo>
    </g>
  )
}

function Decumbente({ rotulos }) {
  const contatos = [
    { x: 182, ctrl: [122, 106] },
    { x: 258, ctrl: [172, 92] },
    { x: 336, ctrl: [234, 108] },
  ]

  return (
    <g>
      <Solo y={168} />
      {/* touceira de origem, ainda ereta */}
      <Touceira x={64} y={168} altura={92} espalhamento={44} escala={0.85} alcanceRaiz={20} />

      {/* colmos que se deitam e enraizam onde o no toca o solo */}
      {contatos.map((c, i) => (
        <g key={i}>
          <path
            d={`M64,168 Q${c.ctrl[0]},${c.ctrl[1]} ${c.x},166`}
            fill="none"
            stroke="rgb(var(--tinta))"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx={c.x} cy={166} r="4.2" fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.7" />
          <g {...VIVO} strokeWidth="1.3">
            <path d={`M${c.x - 3},171 q-8,10 -12,24`} />
            <path d={`M${c.x},171 q1,12 2,26`} />
            <path d={`M${c.x + 3},171 q8,10 11,22`} />
          </g>
          <Touceira
            x={c.x}
            y={164}
            altura={54 - i * 4}
            espalhamento={30}
            escala={0.62}
            alcanceRaiz={0}
            profundidadeRaiz={0}
            vivo
          />
        </g>
      ))}
      <Rotulo x={14} y={26}>
        {rotulos.vista}
      </Rotulo>
      <Rotulo x={386} y={230} ancora="end">
        {rotulos.nota}
      </Rotulo>
    </g>
  )
}

function Roseta({ cx, cy, raio, vivo, folhas = 9 }) {
  const cor = vivo ? 'rgb(var(--folha))' : 'rgb(var(--tinta))'
  return (
    <g>
      {Array.from({ length: folhas }, (_, i) => {
        const a = (i / folhas) * Math.PI * 2 + 0.35
        const r = raio * (0.78 + 0.22 * Math.abs(Math.sin(i * 2.4)))
        return (
          <path
            key={i}
            d={`M${cx},${cy} Q${cx + Math.cos(a + 0.22) * r * 0.62},${cy + Math.sin(a + 0.22) * r * 0.62} ${
              cx + Math.cos(a) * r
            },${cy + Math.sin(a) * r}`}
            fill="none"
            stroke={cor}
            strokeWidth={vivo ? 1.5 : 1.7}
            strokeLinecap="round"
          />
        )
      })}
      <circle
        cx={cx}
        cy={cy}
        r={vivo ? 3.2 : 4.4}
        fill={vivo ? 'rgb(var(--folha) / 0.2)' : 'rgb(var(--papel))'}
        stroke={cor}
        strokeWidth="1.6"
      />
    </g>
  )
}

function Estolonifero({ rotulos }) {
  const centro = [200, 124]
  // estoloes radiando da planta-mae, em vista de cima
  const direcoes = useMemo(
    () => [
      { v: [-1, -0.55], comp: 150 },
      { v: [-1, 0.5], comp: 140 },
      { v: [-0.35, -0.95], comp: 76 },
      { v: [0.4, 0.95], comp: 76 },
      { v: [1, -0.45], comp: 155 },
      { v: [1, 0.55], comp: 145 },
    ],
    []
  )

  const estoloes = direcoes.map(({ v, comp }, i) => {
    const m = Math.hypot(v[0], v[1])
    const u = [v[0] / m, v[1] / m]
    const fim = [centro[0] + u[0] * comp, centro[1] + u[1] * comp]
    // controle deslocado perpendicularmente: o estolao serpenteia de leve
    const perp = [-u[1], u[0]]
    const desvio = (i % 2 === 0 ? 1 : -1) * comp * 0.16
    const ctrl = [
      centro[0] + u[0] * comp * 0.5 + perp[0] * desvio,
      centro[1] + u[1] * comp * 0.5 + perp[1] * desvio,
    ]
    const emT = (t) => {
      const um = 1 - t
      return [
        um * um * centro[0] + 2 * um * t * ctrl[0] + t * t * fim[0],
        um * um * centro[1] + 2 * um * t * ctrl[1] + t * t * fim[1],
      ]
    }
    return {
      d: `M${centro[0]},${centro[1]} Q${ctrl[0].toFixed(1)},${ctrl[1].toFixed(1)} ${fim[0].toFixed(1)},${fim[1].toFixed(1)}`,
      nos: [emT(0.52), emT(1)],
    }
  })

  return (
    <g>
      {/* superficie do solo, vista de cima */}
      <rect x="12" y="34" width="376" height="180" fill="rgb(var(--oliva) / 0.08)" stroke="rgb(var(--oliva) / 0.5)" />
      {estoloes.map((e, i) => (
        <g key={i}>
          <path d={e.d} fill="none" stroke="rgb(var(--tinta))" strokeWidth="2.2" strokeLinecap="round" />
          {e.nos.map(([x, y], k) => (
            <Roseta key={k} cx={x} cy={y} raio={k === 0 ? 15 : 19} folhas={7} vivo />
          ))}
        </g>
      ))}
      <Roseta cx={centro[0]} cy={centro[1]} raio={30} folhas={11} />
      <Rotulo x={14} y={26}>
        {rotulos.vista}
      </Rotulo>
      <Rotulo x={376} y={234} ancora="end">
        {rotulos.nota}
      </Rotulo>
    </g>
  )
}

function Rizomatoso({ rotulos }) {
  const rizomas = useMemo(
    () => [
      construirHasteRasteira({ x: 104, y: 150, comprimento: 200, nos: 3, ondulacao: 9, sentido: 1 }),
      construirHasteRasteira({ x: 300, y: 190, comprimento: 190, nos: 3, ondulacao: -8, sentido: -1 }),
    ],
    []
  )

  return (
    <g>
      {/* corte do solo */}
      <rect x="12" y="120" width="376" height="112" fill="rgb(var(--tinta) / 0.06)" />
      <Solo y={120} />

      <Touceira x={104} y={120} altura={72} espalhamento={40} escala={0.78} alcanceRaiz={14} profundidadeRaiz={26} />
      <Touceira x={300} y={120} altura={62} espalhamento={34} escala={0.72} alcanceRaiz={12} profundidadeRaiz={22} />

      {rizomas.map((rz, i) => (
        <g key={i}>
          <path d={rz.haste} fill="none" stroke="rgb(var(--tinta))" strokeWidth="3.4" strokeLinecap="round" />
          {rz.nos.map(([x, y], k) => (
            <g key={k}>
              <path d={`M${x - 7},${y - 5} L${x + 7},${y - 5}`} stroke="rgb(var(--papel))" strokeWidth="2" fill="none" />
              <circle cx={x} cy={y} r="4" fill="rgb(var(--folha) / 0.22)" stroke="rgb(var(--folha))" strokeWidth="1.6" />
              {/* broto que sobe */}
              <path
                d={`M${x},${y - 4} C${x + 2},${y - 22} ${x - 2},${y - 34} ${x + 1},${y - 46}`}
                {...VIVO}
                strokeWidth="1.8"
              />
              <path d={`M${x + 1},${y - 40} q10,-6 15,-16`} {...VIVO} strokeWidth="1.4" />
              {/* raizes que descem */}
              <path d={`M${x - 3},${y + 4} q-7,10 -9,22`} {...VIVO} strokeWidth="1.2" />
              <path d={`M${x + 3},${y + 4} q7,10 8,20`} {...VIVO} strokeWidth="1.2" />
            </g>
          ))}
        </g>
      ))}

      <Rotulo x={14} y={26}>
        {rotulos.vista}
      </Rotulo>
      <Rotulo x={386} y={224} ancora="end">
        {rotulos.nota}
      </Rotulo>
    </g>
  )
}

const VISTAS = {
  cespitoso: Cespitoso,
  decumbente: Decumbente,
  estolonifero: Estolonifero,
  rizomatoso: Rizomatoso,
}

export default function HabitoSVG({ habito }) {
  const Vista = VISTAS[habito.id] || Cespitoso
  return (
    <svg
      viewBox={`0 0 ${VB.largura} ${VB.altura}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`Esquema do hábito ${habito.nome}. ${habito.descricao}`}
    >
      <Vista rotulos={habito.rotulos} />
    </svg>
  )
}

import { useMemo } from 'react'
import { estruturas, legendaPrancha } from '../data/estruturas'
import {
  construirLamina,
  construirColmo,
  construirNo,
  construirBainha,
  construirRaizes,
  construirPanicula,
} from './svgPartes'

// Geometria do desenho. Os textos e a posicao dos chamados numerados vivem em
// src/data/estruturas.js; aqui ficam so as curvas do traco.
const VB = { largura: 400, altura: 1360 }
const EIXO = 208
const SOLO = 648
const APICE = 168
const NOS = [560, 470, 380, 285]
const COLAR_A = 205
const COLAR_B = 300
// os dois detalhes ampliados ficam empilhados: assim cabem grandes o bastante
// para serem lidos num celular de 375px
const DET_A = { cx: 200, cy: 910, r: 115 }
const DET_B = { cx: 200, cy: 1185, r: 115 }

const RAIO_MARCA = 15

function usarGeometria() {
  return useMemo(() => {
    const panicula = construirPanicula({
      x: EIXO,
      yBase: 172,
      yApice: 44,
      largura: 50,
      ramos: 13,
    })
    const colmo = construirColmo({
      x: EIXO,
      yBase: SOLO,
      yApice: APICE,
      larguraBase: 11,
      larguraApice: 6,
    })
    const nos = NOS.map((y) => construirNo({ x: EIXO, y, largura: 13 }))
    const bainhaA = construirBainha({ x: EIXO, yNo: 285, yColar: COLAR_A, largura: 17 })
    const bainhaB = construirBainha({ x: EIXO, yNo: 380, yColar: COLAR_B, largura: 17 })

    // folhas alternadas (disticas), como na gramínea de verdade — e de quebra
    // isso equilibra a mancha do desenho nos dois lados da prancha
    const laminaA = construirLamina({
      base: [EIXO, COLAR_A],
      c1: [250, 170],
      c2: [296, 158],
      ponta: [338, 186],
      largura: 34,
      nervuras: 3,
      afinamento: 0.75,
    })
    const laminaB = construirLamina({
      base: [EIXO, COLAR_B],
      c1: [164, 286],
      c2: [118, 296],
      ponta: [80, 330],
      largura: 30,
      nervuras: 3,
      afinamento: 0.75,
    })

    // perfilho jovem junto a coroa — desenhado em --folha (tecido vivo)
    const perfilhoColmo = 'M216,642 C230,618 242,600 250,562'
    const perfilhoFolhas = [
      construirLamina({
        base: [246, 590],
        c1: [268, 578],
        c2: [288, 582],
        ponta: [300, 604],
        largura: 12,
        nervuras: 2,
        afinamento: 0.8,
      }),
      construirLamina({
        base: [250, 566],
        c1: [272, 548],
        c2: [292, 544],
        ponta: [306, 562],
        largura: 11,
        nervuras: 2,
        afinamento: 0.8,
      }),
    ]

    const raizes = construirRaizes({
      x: EIXO,
      y: SOLO,
      quantidade: 13,
      alcance: 104,
      profundidade: 112,
    })

    const raizesDetalhe = construirRaizes({
      x: DET_B.cx,
      y: 1258,
      quantidade: 5,
      alcance: 62,
      profundidade: 46,
    })

    return {
      panicula,
      colmo,
      nos,
      bainhaA,
      bainhaB,
      laminaA,
      laminaB,
      perfilhoColmo,
      perfilhoFolhas,
      raizes,
      raizesDetalhe,
    }
  }, [])
}

/** Envolve uma peca do desenho e desenha um halo ocre atras quando selecionada. */
function Peca({ ativa, children }) {
  return (
    <g>
      {ativa ? (
        <g className="halo-selecao" aria-hidden="true">
          {children}
        </g>
      ) : null}
      {children}
    </g>
  )
}

export default function PranchaSVG({ selecionado, onSelecionar, animar }) {
  const g = usarGeometria()
  const ativo = (id) => selecionado === id
  const atrasoBase = animar ? 900 : 0

  const traco = {
    fill: 'none',
    stroke: 'rgb(var(--tinta))',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const apoio = { fill: 'none', stroke: 'rgb(var(--oliva))', strokeLinecap: 'round' }
  const viva = {
    stroke: 'rgb(var(--folha))',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <svg
      viewBox={`0 0 ${VB.largura} ${VB.altura}`}
      className="block h-auto w-full"
      role="img"
      aria-label={legendaPrancha.descricaoAcessivel}
    >
      <defs>
        <clipPath id="recorte-detalhe-a" clipPathUnits="userSpaceOnUse">
          <circle cx={DET_A.cx} cy={DET_A.cy} r={DET_A.r - 1} />
        </clipPath>
        <clipPath id="recorte-detalhe-b" clipPathUnits="userSpaceOnUse">
          <circle cx={DET_B.cx} cy={DET_B.cy} r={DET_B.r - 1} />
        </clipPath>
      </defs>

      {/* ===============================================================
          FIGURA PRINCIPAL — cresce da base para o apice
          =============================================================== */}
      <g
        className={animar ? 'cresce' : undefined}
        style={animar ? { transformOrigin: `${EIXO}px 780px` } : undefined}
      >
        {/* linha do solo */}
        <g {...apoio} strokeWidth="1.2">
          <path d={`M92,${SOLO} L324,${SOLO}`} />
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${96 + i * 17},${SOLO + 2} l-6,7`} />
          ))}
        </g>

        {/* raizes */}
        <Peca ativa={ativo('raizes')}>
          <g {...traco} strokeWidth="1.5">
            {g.raizes.principais.map((d, i) => (
              <path key={`r${i}`} d={d} />
            ))}
          </g>
          <g {...traco} strokeWidth="0.9" opacity="0.85">
            {g.raizes.finas.map((d, i) => (
              <path key={`rf${i}`} d={d} />
            ))}
          </g>
        </Peca>

        {/* colmo */}
        <Peca ativa={ativo('colmo')}>
          <path d={g.colmo} fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.6" />
        </Peca>

        {/* entreno: nao e uma peca separada, e o trecho entre dois nos — entao
            so aparece como faixa quando selecionado */}
        {ativo('entreno') ? (
          <g fill="none" strokeLinecap="butt">
            <path d={`M${EIXO},554 L${EIXO},476`} stroke="rgb(var(--palha))" strokeWidth="12" />
            <path
              d={`M${EIXO},554 L${EIXO},476`}
              stroke="rgb(var(--tinta))"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
          </g>
        ) : null}

        {/* nos */}
        <Peca ativa={ativo('no')}>
          <g>
            {g.nos.map((no, i) => (
              <g key={`n${i}`}>
                <path d={no.bojo} fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.5" />
                <path d={no.filete} {...traco} strokeWidth="1.2" />
              </g>
            ))}
          </g>
        </Peca>

        {/* perfilho jovem — tecido vivo, em --folha */}
        <Peca ativa={ativo('perfilho')}>
          <g>
            <path d={g.perfilhoColmo} {...viva} fill="none" strokeWidth="3.4" />
            {g.perfilhoFolhas.map((f, i) => (
              <g key={`pf${i}`}>
                <path d={f.contorno} fill="rgb(var(--folha) / 0.12)" {...viva} strokeWidth="1.5" />
                {f.nervuras.map((d, k) => (
                  <path key={k} d={d} fill="none" stroke="rgb(var(--folha) / 0.6)" strokeWidth="0.7" />
                ))}
              </g>
            ))}
          </g>
        </Peca>

        {/* bainhas — a de baixo e a rotulada */}
        <Peca ativa={ativo('bainha')}>
          <path d={g.bainhaB.corpo} fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.6" />
          <path d={g.bainhaB.dobra} {...apoio} strokeWidth="1" />
        </Peca>
        <path d={g.bainhaA.corpo} fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.6" />
        <path d={g.bainhaA.dobra} {...apoio} strokeWidth="1" />

        {/* laminas foliares */}
        <Peca ativa={ativo('lamina')}>
          <path d={g.laminaA.contorno} fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.7" />
          <path d={g.laminaB.contorno} fill="rgb(var(--papel))" stroke="rgb(var(--tinta))" strokeWidth="1.7" />
        </Peca>

        {/* nervuras paralelas */}
        <Peca ativa={ativo('nervuras')}>
          <g {...apoio} strokeWidth="1">
            {g.laminaA.nervuras.map((d, i) => (
              <path key={`va${i}`} d={d} />
            ))}
            {g.laminaB.nervuras.map((d, i) => (
              <path key={`vb${i}`} d={d} />
            ))}
          </g>
        </Peca>

        {/* colares */}
        <Peca ativa={ativo('colar')}>
          <g {...traco} strokeWidth="1.5">
            <path d={`M199,${COLAR_A} L217,${COLAR_A}`} />
            <path d={`M199,${COLAR_B} L217,${COLAR_B}`} />
          </g>
        </Peca>

        {/* inflorescencia */}
        <Peca ativa={ativo('inflorescencia')}>
          <g>
            <path d={g.panicula.raque} {...traco} strokeWidth="1.8" />
            <g {...traco} strokeWidth="1">
              {g.panicula.galhos.map((d, i) => (
                <path key={`gp${i}`} d={d} />
              ))}
            </g>
            <g>
              {g.panicula.espiguetas.map((e, i) => (
                <ellipse
                  key={`e${i}`}
                  cx={e.x}
                  cy={e.y}
                  rx={e.rx}
                  ry={e.ry}
                  transform={`rotate(${e.ang} ${e.x} ${e.y})`}
                  fill="rgb(var(--papel))"
                  stroke="rgb(var(--tinta))"
                  strokeWidth="1"
                />
              ))}
            </g>
          </g>
        </Peca>

        {/* marcas das regioes ampliadas */}
        <g {...apoio} strokeWidth="1.2" strokeDasharray="5 4">
          <circle cx={EIXO} cy={210} r={30} />
          <circle cx={EIXO} cy={618} r={34} />
        </g>
        <g className="font-mono" fill="rgb(var(--oliva-texto))" fontSize="18" fontWeight="500">
          <text x="164" y="216" textAnchor="middle">
            A
          </text>
          <text x="156" y="600" textAnchor="middle">
            B
          </text>
        </g>
      </g>

      {/* ===============================================================
          DETALHE A — regiao do colar
          =============================================================== */}
      <g
        className={animar ? 'chamada' : undefined}
        style={animar ? { animationDelay: `${atrasoBase + 520}ms` } : undefined}
      >
        <circle
          cx={DET_A.cx}
          cy={DET_A.cy}
          r={DET_A.r}
          fill="rgb(var(--papel))"
          stroke="rgb(var(--tinta))"
          strokeWidth="1.8"
        />
        <g clipPath="url(#recorte-detalhe-a)">
          {/* base da lamina, subindo */}
          <Peca ativa={ativo('colar')}>
            <path
              d="M166,916 C160,872 158,830 160,790 L240,790 C242,830 240,872 234,916 Z"
              fill="rgb(var(--papel))"
              stroke="rgb(var(--tinta))"
              strokeWidth="1.8"
            />
          </Peca>
          <g {...apoio} strokeWidth="1.1">
            <path d="M180,914 C175,872 174,830 176,792" />
            <path d="M200,914 C199,872 199,830 200,792" />
            <path d="M220,914 C224,872 225,830 224,792" />
          </g>

          {/* bainha, descendo */}
          <path
            d="M162,1032 C157,996 158,962 162,934 L238,934 C242,962 243,996 238,1032 Z"
            fill="rgb(var(--papel))"
            stroke="rgb(var(--tinta))"
            strokeWidth="1.8"
          />
          <path d="M224,1028 C221,994 221,960 224,940" {...apoio} strokeWidth="1.2" />

          {/* colar: a faixa de juncao */}
          <Peca ativa={ativo('colar')}>
            <path
              d="M156,916 L244,916 L244,934 L156,934 Z"
              fill="rgb(var(--tinta) / 0.09)"
              stroke="rgb(var(--tinta))"
              strokeWidth="1.8"
            />
          </Peca>

          {/* ligula */}
          <Peca ativa={ativo('ligula')}>
            <g>
              <path
                d="M172,914 L172,884 C186,874 214,874 228,884 L228,914 Z"
                fill="rgb(var(--tinta) / 0.16)"
                stroke="rgb(var(--tinta))"
                strokeWidth="1.7"
              />
              <g {...traco} strokeWidth="1.1">
                <path d="M180,879 l-2,-9" />
                <path d="M192,875 l-1,-10" />
                <path d="M204,874 l0,-10" />
                <path d="M216,876 l2,-10" />
              </g>
            </g>
          </Peca>

          {/* auriculas */}
          <Peca ativa={ativo('auricula')}>
            <g {...traco} strokeWidth="2">
              <path d="M157,922 C132,920 120,904 126,884 C134,896 148,904 160,908" />
              <path d="M243,922 C268,920 280,904 274,884 C266,896 252,904 240,908" />
            </g>
          </Peca>
        </g>
        <circle cx={DET_A.cx} cy={DET_A.cy} r={DET_A.r} fill="none" stroke="rgb(var(--tinta))" strokeWidth="1.8" />
      </g>

      {/* ===============================================================
          DETALHE B — base do perfilho (o ponto da historia)
          =============================================================== */}
      <g
        className={animar ? 'chamada' : undefined}
        style={animar ? { animationDelay: `${atrasoBase + 640}ms` } : undefined}
      >
        <circle
          cx={DET_B.cx}
          cy={DET_B.cy}
          r={DET_B.r}
          fill="rgb(var(--papel))"
          stroke="rgb(var(--tinta))"
          strokeWidth="1.8"
        />
        <g clipPath="url(#recorte-detalhe-b)">
          {/* solo */}
          <g {...apoio} strokeWidth="1.3">
            <path d="M92,1256 L308,1256" strokeDasharray="7 5" />
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={`M${100 + i * 18},1258 l-6,8`} />
            ))}
          </g>

          {/* raizes ampliadas */}
          <g {...traco} strokeWidth="1.5">
            {g.raizesDetalhe.principais.map((d, i) => (
              <path key={`rd${i}`} d={d} />
            ))}
          </g>

          {/* cartucho de bainhas encaixadas */}
          <path
            d="M150,1272 C143,1226 146,1170 154,1122 L246,1122 C254,1170 257,1226 250,1272 Z"
            fill="rgb(var(--papel))"
            stroke="rgb(var(--tinta))"
            strokeWidth="1.9"
          />
          <path d="M162,1268 C155,1224 158,1172 165,1128" {...apoio} strokeWidth="1.3" />
          <path d="M238,1268 C245,1224 242,1172 235,1128" {...apoio} strokeWidth="1.3" />
          <path d="M175,1264 C169,1222 172,1176 178,1136" {...apoio} strokeWidth="1.1" />
          <path d="M225,1264 C231,1222 228,1176 222,1136" {...apoio} strokeWidth="1.1" />

          {/* nos basais, comprimidos */}
          <g {...traco} strokeWidth="1.4">
            <path d="M152,1232 L248,1232" />
            <path d="M158,1206 L242,1206" />
          </g>

          {/* gema axilar */}
          <Peca ativa={ativo('gema')}>
            <path
              d="M162,1230 C138,1226 126,1206 134,1188 C147,1197 161,1208 166,1224 Z"
              fill="rgb(var(--folha) / 0.24)"
              {...viva}
              strokeWidth="1.9"
            />
          </Peca>

          {/* meristema apical */}
          <Peca ativa={ativo('meristema')}>
            <g>
              <path
                d="M180,1180 C180,1148 220,1148 220,1180 Z"
                fill="rgb(var(--folha) / 0.26)"
                {...viva}
                strokeWidth="2.1"
              />
              <path d="M185,1164 C192,1150 208,1150 215,1164" fill="none" {...viva} strokeWidth="1.5" />
              <path d="M191,1155 C196,1146 204,1146 209,1155" fill="none" {...viva} strokeWidth="1.3" />
            </g>
          </Peca>

          {/* altura de corte / pastejo */}
          <path
            d="M96,1122 L304,1122"
            fill="none"
            stroke="rgb(var(--tinta))"
            strokeWidth="1.9"
            strokeDasharray="9 6"
          />
          <text
            x={DET_B.cx}
            y="1110"
            textAnchor="middle"
            className="font-mono"
            fontSize="16"
            fontWeight="500"
            fill="rgb(var(--oliva-texto))"
          >
            {legendaPrancha.linhaCorte}
          </text>
        </g>
        <circle cx={DET_B.cx} cy={DET_B.cy} r={DET_B.r} fill="none" stroke="rgb(var(--tinta))" strokeWidth="1.8" />
      </g>

      {/* legendas dos detalhes */}
      <g
        className={`font-mono ${animar ? 'chamada' : ''}`}
        style={animar ? { animationDelay: `${atrasoBase + 760}ms` } : undefined}
        fill="rgb(var(--oliva-texto))"
        fontSize="16"
        fontWeight="500"
      >
        <text x={DET_A.cx} y="1052" textAnchor="middle">
          {legendaPrancha.detalheColar}
        </text>
        <text x={DET_B.cx} y="1327" textAnchor="middle">
          {legendaPrancha.detalheBase}
        </text>
      </g>

      {/* ===============================================================
          CHAMADAS NUMERADAS
          =============================================================== */}
      <g>
        {estruturas.map((e, i) => {
          const [mx, my] = e.marcador
          const [ax, ay] = e.ancora
          const dx = ax - mx
          const dy = ay - my
          const dist = Math.hypot(dx, dy) || 1
          const ix = mx + (dx / dist) * (RAIO_MARCA + 2)
          const iy = my + (dy / dist) * (RAIO_MARCA + 2)
          const sel = ativo(e.id)

          return (
            <g
              key={e.id}
              className={animar ? 'chamada' : undefined}
              style={animar ? { animationDelay: `${atrasoBase + 120 + i * 55}ms` } : undefined}
            >
              <line
                x1={ix}
                y1={iy}
                x2={ax}
                y2={ay}
                stroke={sel ? 'rgb(var(--tinta))' : 'rgb(var(--oliva))'}
                strokeWidth={sel ? 1.8 : 1.1}
              />
              <circle
                cx={ax}
                cy={ay}
                r={sel ? 3.6 : 2.2}
                fill={sel ? 'rgb(var(--tinta))' : 'rgb(var(--oliva))'}
              />
              <g onClick={() => onSelecionar(e.id)} style={{ cursor: 'pointer' }} aria-hidden="true">
                {/* area de toque generosa, invisivel */}
                <circle cx={mx} cy={my} r={26} fill="transparent" />
                <circle
                  cx={mx}
                  cy={my}
                  r={RAIO_MARCA}
                  fill={sel ? 'rgb(var(--palha))' : 'rgb(var(--papel))'}
                  stroke="rgb(var(--tinta))"
                  strokeWidth={sel ? 2.4 : 1.4}
                  className="transition-colors duration-curta"
                />
                <text
                  x={mx}
                  y={my + 6.5}
                  textAnchor="middle"
                  className="select-none font-mono"
                  fontSize="18"
                  fontWeight="500"
                  fill="rgb(var(--tinta))"
                >
                  {e.n}
                </text>
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

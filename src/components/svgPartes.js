// Motor de desenho compartilhado pela prancha (modulo 1) e pelos habitos
// (modulo 2). Gera strings de path a partir de curvas-guia — nada de icone
// pronto, nada de raster. Tudo deterministico: o mesmo indice sempre produz o
// mesmo traco, sem Math.random, para o desenho nao "tremer" entre renders.

const r = (n) => Math.round(n * 10) / 10

function cubica(p0, p1, p2, p3, t) {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    y: a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  }
}

function derivada(p0, p1, p2, p3, t) {
  const u = 1 - t
  const a = 3 * u * u
  const b = 6 * u * t
  const c = 3 * t * t
  return {
    x: a * (p1[0] - p0[0]) + b * (p2[0] - p1[0]) + c * (p3[0] - p2[0]),
    y: a * (p1[1] - p0[1]) + b * (p2[1] - p1[1]) + c * (p3[1] - p2[1]),
  }
}

// ruido deterministico, para as raizes nao sairem todas iguais
function jitter(i, escala = 1) {
  const v = Math.sin(i * 12.9898) * 43758.5453
  return (v - Math.floor(v) - 0.5) * 2 * escala
}

/**
 * Lamina foliar: percorre a curva-guia (base -> ponta) e desloca o contorno
 * perpendicularmente, afinando ate zero na ponta. Devolve tambem as nervuras
 * paralelas, que sao a mesma curva deslocada por fracoes da largura.
 */
export function construirLamina({
  base,
  c1,
  c2,
  ponta,
  largura = 16,
  nervuras = 4,
  amostras = 28,
  afinamento = 1.3,
}) {
  const eixo = []
  for (let i = 0; i <= amostras; i++) {
    const t = i / amostras
    const p = cubica(base, c1, c2, ponta, t)
    const d = derivada(base, c1, c2, ponta, t)
    const m = Math.hypot(d.x, d.y) || 1
    eixo.push({
      p,
      n: { x: -d.y / m, y: d.x / m },
      w: (largura / 2) * Math.pow(1 - t, afinamento),
    })
  }

  const lado = (k) =>
    eixo.map(({ p, n, w }) => `${r(p.x + n.x * w * k)},${r(p.y + n.y * w * k)}`)

  const contorno = `M${lado(1).join(' L')} L${lado(-1).reverse().join(' L')} Z`

  const linhas = []
  for (let v = 0; v < nervuras; v++) {
    // distribui as nervuras dentro da lamina, sem encostar no contorno
    const k = -0.72 + (1.44 * v) / Math.max(1, nervuras - 1)
    linhas.push(`M${lado(k).join(' L')}`)
  }

  return { contorno, nervuras: linhas, eixo }
}

/** Colmo com leve conicidade: mais grosso na base, mais fino no apice. */
export function construirColmo({ x, yBase, yApice, larguraBase = 9, larguraApice = 5 }) {
  const meio = (yBase + yApice) / 2
  const lb = larguraBase / 2
  const la = larguraApice / 2
  return [
    `M${x - lb},${yBase}`,
    `C${r(x - lb)},${r(meio)} ${r(x - la)},${r(meio)} ${r(x - la)},${yApice}`,
    `L${r(x + la)},${yApice}`,
    `C${r(x + la)},${r(meio)} ${r(x + lb)},${r(meio)} ${r(x + lb)},${yBase}`,
    'Z',
  ].join(' ')
}

/** No: um leve engrossamento do colmo mais o filete transversal. */
export function construirNo({ x, y, largura = 11 }) {
  const w = largura / 2
  return {
    bojo: `M${r(x - w + 1.5)},${r(y - 5)} C${r(x - w)},${r(y - 1)} ${r(x - w)},${r(y + 1)} ${r(
      x - w + 1.5
    )},${r(y + 5)} L${r(x + w - 1.5)},${r(y + 5)} C${r(x + w)},${r(y + 1)} ${r(x + w)},${r(
      y - 1
    )} ${r(x + w - 1.5)},${r(y - 5)} Z`,
    filete: `M${r(x - w + 1)},${y} L${r(x + w - 1)},${y}`,
  }
}

/**
 * Bainha: cilindro aberto que abraca o colmo do no ate o colar.
 * Desenhada como duas laterais levemente abauladas + a linha de sobreposicao.
 */
export function construirBainha({ x, yNo, yColar, largura = 15 }) {
  const w = largura / 2
  const meio = (yNo + yColar) / 2
  return {
    corpo: `M${r(x - w * 0.55)},${yColar} C${r(x - w)},${r(meio)} ${r(x - w * 0.9)},${r(
      yNo - 6
    )} ${r(x - w * 0.4)},${yNo} L${r(x + w * 0.4)},${yNo} C${r(x + w * 0.9)},${r(yNo - 6)} ${r(
      x + w
    )},${r(meio)} ${r(x + w * 0.55)},${yColar} Z`,
    dobra: `M${r(x + w * 0.15)},${r(yColar + 3)} C${r(x + w * 0.45)},${r(meio)} ${r(
      x + w * 0.35
    )},${r(yNo - 8)} ${r(x + w * 0.05)},${r(yNo - 2)}`,
  }
}

/**
 * Sistema radicular fasciculado: feixe de raizes de calibre parecido, todas
 * saindo da coroa, sem raiz principal. Cada uma ganha 1–2 radicelas.
 */
export function construirRaizes({ x, y, quantidade = 13, alcance = 105, profundidade = 118 }) {
  const principais = []
  const finas = []

  for (let i = 0; i < quantidade; i++) {
    const t = quantidade === 1 ? 0.5 : i / (quantidade - 1)
    const desvio = (t - 0.5) * 2 // -1 .. 1
    const px = x + desvio * alcance + jitter(i * 3.1, 7)
    const prof = y + profundidade * (0.62 + 0.38 * (1 - Math.abs(desvio))) + jitter(i * 5.7, 12)
    const c1x = x + desvio * alcance * 0.22 + jitter(i * 2.3, 5)
    const c1y = y + profundidade * 0.3
    const c2x = px - desvio * 12
    const c2y = y + profundidade * 0.66

    principais.push(
      `M${r(x + desvio * 5)},${r(y)} C${r(c1x)},${r(c1y)} ${r(c2x)},${r(c2y)} ${r(px)},${r(prof)}`
    )

    // radicelas
    for (let k = 0; k < 2; k++) {
      const tt = 0.45 + k * 0.28
      const p = cubica([x + desvio * 5, y], [c1x, c1y], [c2x, c2y], [px, prof], tt)
      const lado = k % 2 === 0 ? 1 : -1
      finas.push(
        `M${r(p.x)},${r(p.y)} q${r(lado * (9 + jitter(i + k, 4)))},${r(9 + jitter(i * 1.7 + k, 4))} ${r(
          lado * (13 + jitter(i * 2.9 + k, 5))
        )},${r(21 + jitter(i * 4.3 + k, 6))}`
      )
    }
  }

  return { principais, finas }
}

/**
 * Panicula: raque central e ramos alternados carregando espiguetas.
 * As espiguetas sao elipses inclinadas na direcao do ramo.
 */
export function construirPanicula({ x, yBase, yApice, largura = 62, ramos = 9 }) {
  const raque = `M${x},${yBase} C${r(x - 3)},${r(yBase - (yBase - yApice) * 0.4)} ${r(x + 3)},${r(
    yApice + (yBase - yApice) * 0.35
  )} ${r(x + 1)},${yApice}`

  const galhos = []
  const espiguetas = []

  for (let i = 0; i < ramos; i++) {
    const t = i / (ramos - 1)
    const y = yBase - (yBase - yApice) * (0.06 + t * 0.9)
    const lado = i % 2 === 0 ? -1 : 1
    // ramos mais longos embaixo, curtos no apice — silhueta de panicula
    const comp = largura * (1 - t * 0.72) * (0.78 + 0.22 * jitter(i * 7.3, 1))
    const fim = [x + lado * comp, y - 14 - t * 5]
    const ctrl = [x + lado * comp * 0.45, y - 3]

    galhos.push(`M${x},${r(y)} Q${r(ctrl[0])},${r(ctrl[1])} ${r(fim[0])},${r(fim[1])}`)

    // espiguetas densas ao longo do ramo — panicula cheia, nao penacho ralo
    const nEsp = 4
    for (let e = 0; e < nEsp; e++) {
      const te = 0.24 + (e / (nEsp - 1)) * 0.76
      const p = cubica([x, y], ctrl, ctrl, fim, te)
      const ang = (Math.atan2(fim[1] - y, fim[0] - x) * 180) / Math.PI
      espiguetas.push({ x: r(p.x), y: r(p.y), ang: r(ang - lado * 6), rx: 5.4, ry: 2.5 })
    }
  }

  return { raque, galhos, espiguetas }
}

/** Estolao / rizoma: haste horizontal com nos e brotos verticais. */
export function construirHasteRasteira({
  x,
  y,
  comprimento = 210,
  nos = 4,
  ondulacao = 10,
  sentido = 1,
}) {
  const passo = comprimento / nos
  let d = `M${x},${y}`
  const pontos = []
  for (let i = 1; i <= nos; i++) {
    const px = x + sentido * passo * i
    const py = y + Math.sin(i * 1.6) * ondulacao
    d += ` Q${r(px - sentido * passo * 0.5)},${r(py + ondulacao * (i % 2 ? 1 : -1))} ${r(px)},${r(py)}`
    pontos.push([r(px), r(py)])
  }
  return { haste: d, nos: pontos }
}


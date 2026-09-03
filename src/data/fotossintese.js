// Modulo 3 — C3 x C4.
//
// >>> AJUSTE AQUI A REGIAO DA FEIRA <<<
// A faixa marcada na regua deve ser a da regiao onde o app vai ser exposto.
// Valor atual: Jaguariuna/SP (clima Cwa), media das minimas e das maximas na
// estacao de crescimento (outubro a marco). Troque `regiao` e pronto — nada
// mais depende disso.
export const regiao = {
  nome: 'Jaguariúna/SP',
  detalhe: 'média das mínimas e máximas na estação de crescimento (out–mar)',
  min: 18,
  max: 30,
}

export const escalaTemperatura = { min: 10, max: 40, passo: 1, inicial: 22 }

// Curvas de eficiencia fotossintetica RELATIVA, normalizadas pelo teto da rota
// C4. Sao gaussianas assimetricas — modelo didatico, nao dado experimental:
// servem para mostrar a forma das curvas e o ponto de inversao, nao para
// estimar produtividade.
export const rotas = [
  {
    id: 'c3',
    nome: 'C3',
    apelido: 'clima temperado',
    otimo: 21,
    teto: 72,
    sigmaAbaixo: 8,
    sigmaAcima: 11,
    exemplos: 'azevém, aveia, trigo, festuca',
  },
  {
    id: 'c4',
    nome: 'C4',
    apelido: 'clima tropical',
    otimo: 35,
    teto: 100,
    sigmaAbaixo: 11,
    sigmaAcima: 6,
    exemplos: 'braquiária, mombaça, tifton, milho',
  },
]

export function eficiencia(rota, t) {
  const sigma = t < rota.otimo ? rota.sigmaAbaixo : rota.sigmaAcima
  const d = t - rota.otimo
  return rota.teto * Math.exp(-(d * d) / (2 * sigma * sigma))
}

// Temperatura em que a vantagem troca de mao. Calculada por varredura para nao
// ficar um numero solto no texto: se alguem mexer nas curvas, isto acompanha.
export const inversao = (() => {
  const [c3, c4] = rotas
  let anterior = eficiencia(c3, escalaTemperatura.min) - eficiencia(c4, escalaTemperatura.min)
  for (let t = escalaTemperatura.min + 0.1; t <= escalaTemperatura.max; t += 0.1) {
    const atual = eficiencia(c3, t) - eficiencia(c4, t)
    if (anterior > 0 && atual <= 0) return Math.round(t * 10) / 10
    anterior = atual
  }
  return null
})()

export const comparativo = [
  {
    id: 'kranz',
    rotulo: 'anatomia Kranz',
    c3: 'ausente',
    c4: 'presente',
    texto:
      'Na C4 as células ao redor da nervura formam uma coroa (Kranz, em alemão) que isola o CO₂ e o concentra onde a fotossíntese acontece. A C3 não tem essa dupla câmara e fixa o carbono num compartimento só.',
  },
  {
    id: 'compensacao',
    rotulo: 'ponto de compensação de CO₂',
    c3: '40–70 ppm',
    c4: '< 10 ppm',
    texto:
      'É a concentração de CO₂ abaixo da qual a planta gasta mais do que produz. A C4 continua no lucro com quase nada de CO₂ disponível; a C3 para muito antes — e no calor perde parte do que fixou em fotorrespiração.',
  },
  {
    id: 'agua',
    rotulo: 'água por kg de matéria seca',
    c3: '450–700 L',
    c4: '250–350 L',
    texto:
      'Concentrando CO₂ internamente, a C4 pode manter os estômatos mais fechados e ainda assim produzir. Faz aproximadamente o dobro de matéria seca com a mesma água — a razão de o pasto tropical aguentar veranico melhor que o de inverno.',
  },
]

export const notaFotossintese =
  'Curvas didáticas de eficiência relativa. No campo o resultado também depende de luz, água, nitrogênio e do estádio da planta.'

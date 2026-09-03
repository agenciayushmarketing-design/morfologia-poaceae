// Textos de moldura: cabecalho, navegacao, rodape.

export const capa = {
  etiqueta: 'Prancha de bancada · Poaceae',
  titulo: 'Morfologia funcional das gramíneas',
  chamada:
    'Toda a pecuária a pasto depende de um detalhe de anatomia: a gramínea guarda o ponto de crescimento perto do chão. Cinco módulos para ver por que isso muda tudo.',
  duracao: '5 módulos · ~4 min',
  acao: 'Começar pela prancha',
}

export const secoes = [
  { id: 'prancha', n: 1, nav: 'Prancha', titulo: 'A prancha anatômica', chamada: 'Catorze estruturas de um perfilho, e o que cada uma resolve.' },
  { id: 'habitos', n: 2, nav: 'Hábitos', titulo: 'Hábitos de crescimento', chamada: 'Quatro maneiras de ocupar o terreno — e o que cada uma cobra do manejo.' },
  { id: 'fotossintese', n: 3, nav: 'C3 × C4', titulo: 'C3 × C4 na régua', chamada: 'Mexa na temperatura e veja a vantagem trocar de lado.' },
  { id: 'desafio', n: 4, nav: 'Desafio', titulo: 'Desafio da bancada', chamada: 'Seis perguntas. Tudo já apareceu nos módulos anteriores.' },
  { id: 'especies', n: 5, nav: 'Espécies', titulo: 'Fichas de espécies', chamada: 'Seis forrageiras, com hábito, rota fotossintética e medidas de manejo.' },
]

// Rotulos de interface. Ficam aqui, e nao espalhados pelos componentes, para
// que ajustar a linguagem da bancada seja mexer num arquivo so.
export const ui = {
  pularParaConteudo: 'Pular para o conteúdo',
  modulo: 'Módulo',
  navegacao: 'Módulos',
  prancha: {
    legenda: 'Legenda da prancha',
    painel: 'Painel',
    aguardando: 'aguardando seleção',
    oQueE: 'O que é',
    porQueImporta: 'Por que importa',
    pontoChave: 'O ponto-chave',
    fechar: 'Fechar painel',
    anterior: 'Anterior',
    proxima: 'Próxima',
    estrutura: 'Estrutura',
  },
  habitos: {
    abas: 'Hábitos de crescimento',
    consequencia: 'Consequência prática',
  },
  fotossintese: {
    temperatura: 'Temperatura do ar',
    vantagem: 'vantagem',
    emVantagem: '▲ em vantagem',
    otimo: 'ótimo',
    inversaoEm: 'inversão em',
    unidade: '°C',
    leituraGraus: 'graus Celsius',
    leituraBarra: 'Eficiência relativa da rota',
  },
  quiz: {
    resultado: 'resultado',
    pergunta: 'pergunta',
    de: 'de',
    recomecar: 'Recomeçar',
    recomecarLongo: 'Recomeçar para o próximo visitante',
    acertos: 'acertos',
    recorde: 'melhor resultado do dia:',
    semRecorde: '—',
    certo: 'certo — e o motivo é este',
    errado: 'não é essa — veja por quê',
    proximaPergunta: 'Próxima pergunta',
    verResultado: 'Ver resultado',
  },
  especies: {
    atencao: 'Ponto de atenção',
  },
}

export const rodape = {
  linhas: [
    'Aplicativo de bancada para feira acadêmica. Conteúdo didático de morfologia e fisiologia de Poaceae.',
    'Funciona sem conexão depois do primeiro carregamento. Nenhum dado é enviado para fora deste aparelho.',
  ],
  creditoTipografia: 'Fraunces · IBM Plex Sans · IBM Plex Mono',
}

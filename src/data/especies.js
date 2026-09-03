// Modulo 5 — fichas de especies.
// `medidas` sao as linhas em mono que aparecem no card fechado.
// Faixas de referencia; a nota de rodape do modulo deixa isso explicito.

export const especies = [
  {
    id: 'marandu',
    cientifico: 'Urochloa brizantha',
    cultivar: "cv. Marandu",
    popular: 'capim-marandu',
    habito: 'Cespitoso',
    rota: 'C4',
    medidas: [
      { rotulo: 'entrada', valor: '30 cm' },
      { rotulo: 'saída', valor: '15 cm' },
      { rotulo: 'matéria seca', valor: '10–15 t/ha/ano' },
    ],
    descricao:
      'A gramínea mais plantada do Brasil Central. Touceira robusta, boa adaptação a solos de fertilidade média e resposta consistente à adubação nitrogenada.',
    atencao:
      'Sensível a solo encharcado e à morte-do-braquiarão em áreas mal drenadas. Rebaixar abaixo de 15 cm consome o estoque de gemas basais e atrasa a rebrota.',
  },
  {
    id: 'decumbens',
    cientifico: 'Urochloa decumbens',
    cultivar: 'cv. Basilisk',
    popular: 'capim-braquiária',
    habito: 'Decumbente',
    rota: 'C4',
    medidas: [
      { rotulo: 'entrada', valor: '25 cm' },
      { rotulo: 'saída', valor: '10 cm' },
      { rotulo: 'matéria seca', valor: '8–12 t/ha/ano' },
    ],
    descricao:
      'Colmos que se deitam e enraízam nos nós, formando um tapete contínuo. Tolera solo de baixa fertilidade melhor que a maioria e cobre o terreno rapidamente.',
    atencao:
      'Associada a fotossensibilização em bezerros, sobretudo em rebrota nova. Produz menos que o marandu e concentra a massa perto do chão.',
  },
  {
    id: 'mombaca',
    cientifico: 'Megathyrsus maximus',
    cultivar: 'cv. Mombaça',
    popular: 'capim-mombaça',
    habito: 'Cespitoso',
    rota: 'C4',
    medidas: [
      { rotulo: 'entrada', valor: '90 cm' },
      { rotulo: 'saída', valor: '30–40 cm' },
      { rotulo: 'matéria seca', valor: '20–25 t/ha/ano' },
    ],
    descricao:
      'Touceira alta e de altíssima produção, feita para pastejo rotacionado com boa fertilidade e adubação. A entrada aos 90 cm corresponde ao ponto em que o dossel intercepta cerca de 95% da luz.',
    atencao:
      'Exige solo fértil e manejo disciplinado. Passar do ponto de entrada faz a touceira alongar o colmo, elevar o meristema e despencar em qualidade.',
  },
  {
    id: 'tifton85',
    cientifico: 'Cynodon spp.',
    cultivar: 'cv. Tifton 85',
    popular: 'tifton',
    habito: 'Estolonífero e rizomatoso',
    rota: 'C4',
    medidas: [
      { rotulo: 'entrada', valor: '25–30 cm' },
      { rotulo: 'saída', valor: '10–15 cm' },
      { rotulo: 'matéria seca', valor: '15–20 t/ha/ano' },
    ],
    descricao:
      'Avança por estolão na superfície e por rizoma abaixo dela — as duas estratégias na mesma planta. Alta digestibilidade e a melhor tolerância a pisoteio do grupo, o que o torna padrão em piquetes de alta lotação e em feno.',
    atencao:
      'Propagação por mudas, não por semente: implantação mais cara e mais lenta. Responde muito a nitrogênio e cobra essa adubação para manter a produção.',
  },
  {
    id: 'napier',
    cientifico: 'Pennisetum purpureum',
    cultivar: 'cv. Napier',
    popular: 'capim-elefante',
    habito: 'Cespitoso alto',
    rota: 'C4',
    medidas: [
      { rotulo: 'corte', valor: '1,5–2,0 m' },
      { rotulo: 'uso', valor: 'capineira, silagem' },
      { rotulo: 'matéria seca', valor: '30–40 t/ha/ano' },
    ],
    descricao:
      'A maior produtora de matéria seca da lista. Usada sobretudo em capineira, picada no cocho, ou ensilada — não em pastejo direto, dado o porte.',
    atencao:
      'Cortar tarde derruba a qualidade rápido: o colmo engrossa, a relação folha/colmo cai e sobra fibra. A produção só se realiza com adubação pesada.',
  },
  {
    id: 'azevem',
    cientifico: 'Lolium multiflorum',
    cultivar: '',
    popular: 'azevém',
    habito: 'Cespitoso',
    rota: 'C3',
    medidas: [
      { rotulo: 'entrada', valor: '25–30 cm' },
      { rotulo: 'saída', valor: '10 cm' },
      { rotulo: 'matéria seca', valor: '6–10 t/ha/ano' },
    ],
    descricao:
      'A única C3 da lista, e é exatamente por isso que ela existe aqui: cresce no frio, quando as tropicais param. Forragem de qualidade alta, semeada no outono para cobrir o vazio do inverno.',
    atencao:
      'Ciclo anual e produção que despenca quando a temperatura sobe — pela curva do módulo 3, acima de 25 °C a vantagem já passou para as C4.',
  },
]

export const rodapeEspecies =
  'Os valores são faixas de referência para leitura comparativa. Alturas de manejo e produção de matéria seca variam com fertilidade do solo, adubação, clima, estação do ano e método de pastejo.'

// Modulo 2 — habitos de crescimento.
// `nivel` vai de 1 a 4 e alimenta a barrinha de leitura rapida ao lado de cada
// indicador. `vista` diz qual desenho o motor SVG compartilhado deve montar.

export const habitos = [
  {
    id: 'cespitoso',
    nome: 'Cespitoso',
    resumo: 'Touceira',
    exemplo: 'Megathyrsus maximus',
    exemploPopular: 'capim-mombaça, capim-tanzânia',
    descricao:
      'Os perfilhos nascem de gemas na base da planta e crescem para cima, todos juntos. O resultado é uma touceira compacta e alta, com solo descoberto entre uma touceira e outra.',
    consequencia:
      'Produz muita massa por touceira e rebrota rápido, mas deixa o solo exposto entre as plantas — o que cobra planta bem espaçada, manejo de altura correto e cuidado redobrado com pisoteio, porque a touceira não se refaz por rastejo.',
    indicadores: [
      { rotulo: 'cobertura do solo', valor: 'parcial', nivel: 2 },
      { rotulo: 'tolerância a pisoteio', valor: 'baixa', nivel: 1 },
      { rotulo: 'velocidade de rebrota', valor: 'alta', nivel: 4 },
      { rotulo: 'resistência à erosão', valor: 'média', nivel: 2 },
    ],
    rotulos: { vista: 'vista lateral', nota: 'solo descoberto' },
  },
  {
    id: 'decumbente',
    nome: 'Decumbente',
    resumo: 'Colmos deitados',
    exemplo: 'Urochloa decumbens',
    exemploPopular: 'capim-braquiária',
    descricao:
      'Os colmos partem eretos, mas se inclinam e encostam no solo. Onde um nó toca a terra, ele emite raízes e origina uma planta nova, ligada à mãe.',
    consequencia:
      'Fecha o terreno em todas as direções e forma um tapete contínuo, o que segura o solo muito bem. Em compensação a massa fica mais rente ao chão e boa parte dela é colmo — forragem mais fibrosa que a da touceira.',
    indicadores: [
      { rotulo: 'cobertura do solo', valor: 'alta', nivel: 4 },
      { rotulo: 'tolerância a pisoteio', valor: 'média-alta', nivel: 3 },
      { rotulo: 'velocidade de rebrota', valor: 'média', nivel: 2 },
      { rotulo: 'resistência à erosão', valor: 'alta', nivel: 4 },
    ],
    rotulos: { vista: 'vista lateral', nota: 'nó enraizado = planta nova' },
  },
  {
    id: 'estolonifero',
    nome: 'Estolonífero',
    resumo: 'Estolões na superfície',
    exemplo: 'Cynodon dactylon',
    exemploPopular: 'grama-seda, tifton',
    descricao:
      'Emite estolões — hastes que correm por cima do solo. A cada nó do estolão brotam raízes e um novo perfilho, e a planta caminha pela área.',
    consequencia:
      'Cicatriza falhas sozinho: uma área pisoteada ou descoberta é reocupada pelo avanço dos estolões. É o hábito que melhor tolera tráfego intenso, o que explica seu uso em piquetes de alta lotação e em gramados.',
    indicadores: [
      { rotulo: 'cobertura do solo', valor: 'muito alta', nivel: 4 },
      { rotulo: 'tolerância a pisoteio', valor: 'alta', nivel: 4 },
      { rotulo: 'velocidade de rebrota', valor: 'alta', nivel: 4 },
      { rotulo: 'resistência à erosão', valor: 'alta', nivel: 4 },
    ],
    rotulos: { vista: 'vista superior', nota: 'estolões avançam sobre o solo' },
  },
  {
    id: 'rizomatoso',
    nome: 'Rizomatoso',
    resumo: 'Rizomas subterrâneos',
    exemplo: 'Paspalum notatum, Cynodon spp.',
    exemploPopular: 'grama-batatais, tifton',
    descricao:
      'Os caules de propagação correm por baixo do solo. Do rizoma partem raízes e perfilhos que emergem à distância da planta-mãe.',
    consequencia:
      'As gemas ficam enterradas, longe do dente, do casco e do fogo — por isso é o hábito mais difícil de eliminar e o mais persistente sob pressão. Ocupa a área devagar, mas o que ocupa não devolve.',
    indicadores: [
      { rotulo: 'cobertura do solo', valor: 'alta', nivel: 3 },
      { rotulo: 'tolerância a pisoteio', valor: 'muito alta', nivel: 4 },
      { rotulo: 'velocidade de rebrota', valor: 'média', nivel: 2 },
      { rotulo: 'resistência à erosão', valor: 'muito alta', nivel: 4 },
    ],
    rotulos: { vista: 'corte do solo', nota: 'gemas protegidas sob a terra' },
  },
]

export const notaHabitos =
  'Muitas espécies combinam dois hábitos. O Tifton 85, por exemplo, avança por estolão na superfície e por rizoma abaixo dela.'

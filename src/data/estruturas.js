// Modulo 1 — prancha anatomica.
// Cada estrutura carrega o texto E a geometria do seu chamado na prancha:
//   marcador  : onde fica o circulo numerado
//   ancora    : para onde a linha-guia aponta
//   ancoragem : 'margem' (coluna lateral) | 'detalheColar' | 'detalheBase'
// A numeracao segue a leitura da prancha, do apice para a raiz — convencao de
// prancha botanica, nao ordem decorativa.

export const estruturas = [
  {
    id: 'inflorescencia',
    n: 1,
    curto: 'Inflorescência',
    nome: 'Inflorescência',
    funcao:
      'Conjunto de espiguetas no topo do colmo. É onde a gramínea floresce e produz sementes.',
    importa:
      'Quando a planta emite a inflorescência, ela desvia energia da produção de folhas para a semente: a forragem perde proteína e ganha fibra. Por isso o manejo de pastagem procura colher a planta antes desse ponto.',
    ancoragem: 'margem',
    marcador: [356, 62],
    ancora: [228, 100],
  },
  {
    id: 'lamina',
    n: 2,
    nome: 'Lâmina foliar',
    funcao:
      'A parte plana e expandida da folha, a partir do colar. É a superfície que captura a luz e faz a fotossíntese.',
    importa:
      'É a fração mais nutritiva da planta e a primeira que o animal procura. Quanto mais lâmina viva sobra depois do pastejo, mais rápido o capim se recupera — porque é ela que financia a rebrota.',
    ancoragem: 'margem',
    marcador: [356, 130],
    ancora: [325, 179],
  },
  {
    id: 'nervuras',
    n: 3,
    curto: 'Nervuras',
    nome: 'Nervuras paralelas',
    funcao:
      'Feixes condutores que correm lado a lado da base à ponta da lâmina, sem se ramificar em rede.',
    importa:
      'É a assinatura das monocotiledôneas: em vez de uma nervura central com ramificações, a folha tem vias paralelas. Se uma é rompida pelo dente do animal, as vizinhas continuam conduzindo água e açúcar — a folha rasgada segue funcionando.',
    ancoragem: 'margem',
    marcador: [356, 222],
    ancora: [240, 183],
  },
  {
    id: 'colar',
    n: 4,
    nome: 'Colar',
    funcao:
      'A faixa que marca a junção entre a bainha e a lâmina, na parte de trás da folha.',
    importa:
      'É a dobradiça da folha: define o ângulo com que a lâmina se abre e, portanto, quanta luz ela intercepta. O formato do colar, da lígula e da aurícula é o que permite identificar a espécie mesmo sem inflorescência.',
    ancoragem: 'detalheColar',
    marcador: [270, 960],
    ancora: [240, 924],
  },
  {
    id: 'ligula',
    n: 5,
    nome: 'Lígula',
    funcao:
      'Pequena projeção — membranosa ou formada por pelos — na face interna da folha, exatamente onde a lâmina se separa do colmo.',
    importa:
      'Funciona como uma vedação: impede que água de chuva, poeira e esporos escorram para dentro da bainha, onde ficariam parados contra o tecido jovem. Seu formato é um dos caracteres mais usados na identificação de gramíneas.',
    ancoragem: 'detalheColar',
    marcador: [130, 862],
    ancora: [200, 890],
  },
  {
    id: 'auricula',
    n: 6,
    nome: 'Aurícula',
    funcao:
      'Par de apêndices em forma de garra que, quando presentes, abraçam o colmo nas laterais do colar.',
    importa:
      'Pode ser bem desenvolvida, reduzida ou ausente conforme a espécie — e essa variação é chave de identificação. Ajuda a prender a bainha ao colmo, dando firmeza mecânica à folha jovem que ainda está se abrindo.',
    ancoragem: 'detalheColar',
    marcador: [288, 878],
    ancora: [262, 888],
  },
  {
    id: 'bainha',
    n: 7,
    nome: 'Bainha',
    funcao:
      'A base da folha, que envolve o colmo como um cilindro aberto e sobe do nó até o colar.',
    importa:
      'É armadura e almoxarifado. Protege o entrenó jovem e a gema que estão embaixo dela e acumula reservas usadas na rebrota. Bainha preservada depois do pastejo é energia disponível para a próxima folha.',
    ancoragem: 'margem',
    marcador: [36, 372],
    ancora: [200, 360],
  },
  {
    id: 'colmo',
    n: 8,
    nome: 'Colmo',
    funcao:
      'O caule das gramíneas: cilíndrico, dividido em nós e entrenós, geralmente oco entre os nós.',
    importa:
      'Sustenta as folhas e conduz água e nutrientes. Colmo em excesso na pastagem significa forragem fibrosa e de baixa digestibilidade — a relação folha/colmo é um dos indicadores diretos da qualidade do pasto.',
    ancoragem: 'margem',
    marcador: [36, 432],
    ancora: [204, 424],
  },
  {
    id: 'no',
    n: 9,
    nome: 'Nó',
    funcao:
      'Ponto sólido e levemente inchado do colmo, de onde saem a folha, a gema e, em algumas espécies, raízes.',
    importa:
      'Cada nó é um ponto de reinício. Em capins decumbentes ou estoloníferos, o nó que encosta no solo emite raiz e forma uma planta nova — é assim que a touceira se espalha sem depender de semente.',
    ancoragem: 'margem',
    marcador: [36, 492],
    ancora: [201, 470],
  },
  {
    id: 'entreno',
    n: 10,
    nome: 'Entrenó',
    funcao: 'O segmento de colmo entre dois nós consecutivos.',
    importa:
      'Enquanto a planta está vegetativa, os entrenós ficam curtos e comprimidos na base. Quando o entrenó alonga, o ponto de crescimento sobe junto — e passa a ficar ao alcance do dente do animal e da lâmina da roçadeira.',
    ancoragem: 'margem',
    marcador: [36, 552],
    ancora: [204, 515],
  },
  {
    id: 'gema',
    n: 11,
    nome: 'Gema axilar',
    funcao:
      'Broto adormecido alojado em cada nó, protegido pela bainha da folha correspondente.',
    importa:
      'É o estoque de plantas futuras. Cada gema basal pode acordar e virar um perfilho inteiro. Rebaixar demais o pasto destrói essas gemas — e sem gema não existe rebrota, por mais adubo que se aplique.',
    ancoragem: 'detalheBase',
    marcador: [118, 1170],
    ancora: [150, 1212],
  },
  {
    id: 'perfilho',
    n: 12,
    nome: 'Perfilho',
    funcao:
      'Uma haste completa e independente — com folhas, colmo e raízes próprias — nascida de uma gema basal da planta-mãe.',
    importa:
      'A gramínea não é um indivíduo só: é uma população de perfilhos que nascem e morrem o tempo todo. A produção do pasto é o resultado dessa contabilidade. Manejo que mantém alta a taxa de aparecimento de perfilhos mantém alta a produção.',
    ancoragem: 'margem',
    marcador: [356, 600],
    ancora: [252, 584],
  },
  {
    id: 'meristema',
    n: 13,
    curto: 'Meristema',
    nome: 'Meristema apical',
    destaque: true,
    funcao:
      'O tecido que origina todas as folhas novas. Na fase vegetativa da gramínea ele permanece próximo à base da planta, agachado dentro do cartucho de bainhas — e não no alto do caule.',
    importa:
      'Aqui está o motivo de existir pastagem. Como o ponto de crescimento fica abaixo da altura em que o animal pastejou ou a roçadeira cortou, ele escapa ileso da desfolha. Somado às gemas basais, que emitem novos perfilhos, isso permite que a mesma planta seja desfolhada dezenas de vezes e rebrote sempre.\n\nA maioria das dicotiledôneas tem o meristema apical exposto na ponta do caule: cortou a ponta, perdeu o ponto de crescimento. A gramínea, não.\n\nQuando ela entra em fase reprodutiva, porém, o entrenó alonga e eleva o meristema. Se o corte acontece nesse momento, o ponto de crescimento vai junto — e a rebrota passa a depender inteiramente das gemas basais.',
    ancoragem: 'detalheBase',
    marcador: [286, 1150],
    ancora: [218, 1166],
  },
  {
    id: 'raizes',
    n: 14,
    curto: 'Raízes',
    nome: 'Sistema radicular fasciculado',
    funcao:
      'Um feixe denso de raízes finas e de calibre parecido, saindo todas da base da planta — sem raiz principal dominante.',
    importa:
      'Essa malha ocupa o volume de solo mais próximo da superfície e segura as partículas: é o que dá à pastagem bem manejada seu poder de conter erosão. As raízes também param de crescer quando a parte aérea é rebaixada demais — desfolha severa poda a raiz junto, mesmo sem ninguém tocar no solo.',
    ancoragem: 'margem',
    marcador: [356, 726],
    ancora: [246, 706],
  },
]

export const legendaPrancha = {
  titulo: 'Prancha I',
  subtitulo: 'Perfilho de gramínea · Poaceae · fase vegetativa · vista lateral',
  instrucao: 'Toque num número da prancha — ou num nome da legenda abaixo.',
  detalheColar: 'A · região do colar',
  detalheBase: 'B · base do perfilho',
  linhaCorte: 'corte · pastejo',
  descricaoAcessivel:
    'Prancha botânica de um perfilho de gramínea, com quatorze estruturas numeradas e dois detalhes ampliados: a região do colar e a base do perfilho. Use a legenda abaixo para ler cada estrutura.',
  notas: [
    'Bainhas removidas do terço médio do colmo, para expor nó, entrenó e gema.',
    'No detalhe B, a linha tracejada marca a altura do pastejo. Repare onde fica o meristema (13).',
    'Desenho esquemático, sem escala: as proporções foram ajustadas para leitura.',
  ],
}

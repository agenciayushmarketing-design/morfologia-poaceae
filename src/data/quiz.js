// Modulo 4 — desafio.
// Todas as respostas estao nos modulos 1 a 3. E reforco, nao pegadinha:
// quem percorreu o app acerta. `origem` diz de onde veio a resposta.

export const questoes = [
  {
    id: 'q1',
    origem: 'Prancha · estrutura 13',
    pergunta:
      'Por que uma gramínea aguenta ser pastejada muitas vezes e continuar rebrotando?',
    opcoes: [
      'Porque cresce mais rápido que as outras plantas',
      'Porque o ponto de crescimento fica perto da base, abaixo da altura do corte',
      'Porque as raízes armazenam água suficiente para repor as folhas',
    ],
    correta: 1,
    explicacao:
      'Na fase vegetativa o meristema apical fica agachado perto do solo, protegido dentro das bainhas. O animal leva a lâmina, mas não leva a fábrica de folhas. Na maioria das dicotiledôneas esse ponto fica exposto no alto do caule — cortou a ponta, acabou.',
  },
  {
    id: 'q2',
    origem: 'Prancha · estruturas 11 e 12',
    pergunta: 'De onde nasce um perfilho novo?',
    opcoes: [
      'De uma gema axilar alojada num nó da base da planta',
      'De uma semente caída ao lado da touceira',
      'De uma ramificação da raiz principal',
    ],
    correta: 0,
    explicacao:
      'Cada nó guarda uma gema adormecida, protegida pela bainha. Quando ela desperta, vira um perfilho completo — com folhas, colmo e raízes próprias. É por isso que rebaixar demais o pasto compromete a rebrota: destrói o estoque de gemas.',
  },
  {
    id: 'q3',
    origem: 'Prancha · estrutura 3',
    pergunta:
      'A folha da gramínea tem nervuras paralelas, sem rede de ramificações. Que vantagem prática isso traz sob pastejo?',
    opcoes: [
      'Deixa a folha mais dura e menos atrativa para o animal',
      'Faz a folha crescer da ponta para a base',
      'Se uma nervura é rompida, as vizinhas continuam conduzindo — a folha rasgada segue funcionando',
    ],
    correta: 2,
    explicacao:
      'São vias paralelas e independentes. O dente do animal rasga a lâmina, mas não interrompe o transporte de água e açúcar do resto dela. Numa folha de nervação em rede, o mesmo rasgo isolaria toda a região acima do corte.',
  },
  {
    id: 'q4',
    origem: 'Hábitos de crescimento',
    pergunta:
      'Um piquete vai receber lotação alta e tráfego pesado de animais. Que hábito de crescimento tende a se sair melhor?',
    opcoes: [
      'Cespitoso, porque a touceira produz mais massa por planta',
      'Estolonífero, porque os estolões reocupam sozinhos as falhas abertas pelo casco',
      'Tanto faz: o hábito não interfere na tolerância a pisoteio',
    ],
    correta: 1,
    explicacao:
      'O estolão corre pela superfície e enraíza a cada nó, então o capim cicatriza as áreas descobertas por conta própria. A touceira cespitosa não caminha: se um perfilho morre pisoteado, o espaço fica aberto até entrar semente.',
  },
  {
    id: 'q5',
    origem: 'C3 × C4 · régua de temperatura',
    pergunta: 'Perto de 35 °C, qual rota fotossintética é mais eficiente — e por quê?',
    opcoes: [
      'C3, porque tem o ciclo mais simples e gasta menos energia',
      'As duas igualmente: a temperatura não altera a eficiência',
      'C4, porque concentra CO₂ na anatomia Kranz e escapa da fotorrespiração',
    ],
    correta: 2,
    explicacao:
      'Quanto mais quente, mais a C3 perde carbono em fotorrespiração. A C4 blinda o CO₂ dentro da bainha vascular e mantém a eficiência subindo até perto de 35 °C. Abaixo de uns 25 °C a vantagem se inverte, e é aí que o azevém entra na cena.',
  },
  {
    id: 'q6',
    origem: 'C3 × C4 · uso da água',
    pergunta:
      'Numa seca prolongada, por que o capim tropical C4 costuma segurar melhor a produção que uma forrageira C3?',
    opcoes: [
      'Porque produz mais matéria seca com menos água, mantendo os estômatos mais fechados',
      'Porque tem raízes de calibre maior, que chegam ao lençol freático',
      'Porque interrompe a fotossíntese e vive das reservas até a chuva voltar',
    ],
    correta: 0,
    explicacao:
      'Como a C4 já concentra CO₂ internamente, ela pode fechar mais os estômatos, perder menos vapor de água e ainda assim fixar carbono. Na prática produz mais ou menos o dobro de matéria seca por litro de água que uma C3.',
  },
]

export const desfechos = [
  { minimo: 6, titulo: 'Domínio completo', texto: 'Nenhum erro. Você levou a morfologia inteira da bancada.' },
  { minimo: 5, titulo: 'Muito bem', texto: 'Faltou pouco. Vale reler a estrutura que escapou.' },
  { minimo: 4, titulo: 'Bom resultado', texto: 'A ideia central ficou. Volte na prancha para fechar o resto.' },
  { minimo: 2, titulo: 'Já pegou o fio', texto: 'Passe pela prancha e pela régua de temperatura e tente de novo.' },
  { minimo: 0, titulo: 'Comece pela prancha', texto: 'Toque na estrutura 13 — o meristema apical. É de lá que sai quase tudo.' },
]

export const chaveRecorde = 'poaceae:recorde-da-bancada'

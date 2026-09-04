# Prompts para recriar o app no Lovable

Cole **um bloco por vez**, na ordem. Espere cada um terminar e conferir antes de
mandar o próximo. O Lovable erra muito quando recebe tudo de uma vez.

Blocos 0 a 2 são obrigatórios nessa ordem. Do 3 em diante a ordem é livre.

---

## Bloco 0 — Fundação visual

> Vamos construir um app web estático de página única sobre morfologia funcional
> das gramíneas (Poaceae), para uma feira acadêmica em Jaguariúna/SP. O visitante
> escaneia um QR code e abre no próprio celular; ao mesmo tempo um tablet na
> bancada roda a mesma URL o dia inteiro.
>
> **Restrições inegociáveis, valem para tudo que você fizer daqui em diante:**
>
> 1. Mobile-first de verdade. Projete para 375px de largura primeiro. Desktop é
>    secundário. Sem scroll horizontal em nenhuma largura de 320px pra cima.
> 2. Nada depende de `:hover`. Toda interação funciona com um toque. `:hover`
>    só como reforço visual opcional.
> 3. Alvos de toque de no mínimo 44×44px. Sem exceção.
> 4. Todo texto e todo número visível ficam em arquivos dentro de `src/data/`.
>    Nenhum componente carrega conteúdo próprio, nem string de interface.
> 5. Sem persistência entre visitantes, exceto o recorde do quiz.
> 6. Idioma: português do Brasil. Decimal com vírgula (`1,4×`, não `1.4x`).
>
> **Direção visual: prancha de herbário / caderno de campo.** Registro
> científico, luz de pasto no fim da seca, tinta sobre papel encorpado.
>
> Está **proibido**: paleta óbvia de agronegócio (verde escuro + lima + branco);
> fundo creme com serifada de alto contraste e acento terracota; fundo quase
> preto com um acento neon. Se o resultado parecer template de SaaS, está errado.
>
> Defina estes tokens em `src/index.css` e consuma via Tailwind:
>
> ```
> --pedra       #E4E7DE   hsl(80 16% 89%)    fundo da moldura, nav
> --papel       #F2F3ED   hsl(70 20% 94%)    fundo de cartão, superfície de leitura
> --tinta       #1B2A2F   hsl(195 27% 15%)   texto principal, traço do desenho
> --palha       #D8A21D   hsl(43 76% 48%)    acento, com parcimônia
> --folha       #3F6B43   hsl(125 26% 33%)   SÓ para indicar tecido vivo nas ilustrações
> --oliva       #8A9483   hsl(95 7% 55%)     filetes, linhas de apoio, trama
> --oliva-texto #4A5449   hsl(115 7% 31%)    texto secundário
> ```
>
> **Atenção crítica de contraste, não ignore.** `--palha` sobre `--pedra` dá
> 2,8:1 e reprova em WCAG AA. Então `--palha` **nunca** aparece como cor de texto
> sobre fundo claro: ela entra sempre como *preenchimento* com texto `--tinta`
> por cima (6,9:1), em marcadores, estado ativo e barras. Pelo mesmo motivo,
> `--oliva` original fica restrita a filetes e traço de desenho; todo texto
> secundário usa `--oliva-texto` (7,1:1 sobre papel).
>
> **Tipografia, três papéis:**
> - **Fraunces** (variável, eixos SOFT e WONK levemente ligados): só em títulos
>   de seção e no número grande do placar. Uso restrito — se aparecer em texto
>   corrido, está errado.
> - **IBM Plex Sans**: corpo, botões, descrições.
> - **IBM Plex Mono**: toda medida numérica (altura em cm, t MS/ha, porcentagem),
>   rótulos de chamada e legendas de prancha. É a mono que carrega o registro de
>   caderno de campo e amarra a identidade.
>
> Duas espessuras por família, consistentes. Escala tipográfica com contraste
> real entre níveis — nada de tudo em 14px e 16px.
>
> **Único ornamento permitido:** uma trama de fundo de linhas verticais finas
> (1px, `--oliva` a 8% de opacidade, espaçamento 14px), ecoando a nervação
> paralela da folha de Poaceae. Nada além disso. Sem sombras difusas, sem
> gradientes decorativos, sem cantos muito arredondados, sem ícones genéricos.
>
> **Movimento:** uma única sequência orquestrada, que eu descrevo no bloco 2.
> Fora dela, só transições de estado de 150–200ms. Respeite
> `prefers-reduced-motion: reduce` desligando a sequência e revelando tudo
> estático — use `animation-fill-mode: backwards`, para que o estado final da
> animação seja sempre o estado natural do elemento.
>
> **Nesta primeira etapa, faça apenas isto:** os tokens, as fontes, a escala
> tipográfica, a classe da trama, e uma página com capa + barra de navegação
> grudenta no topo com cinco pílulas numeradas (01 Prancha · 02 Hábitos ·
> 03 C3 × C4 · 04 Desafio · 05 Espécies), que rolam suavemente até a seção
> correspondente e destacam a seção ativa via IntersectionObserver. A barra rola
> na horizontal a 375px, com esmaecimento na borda direita sinalizando que
> continua. Sem router: navegação por scroll e estado local.
>
> Textos da capa:
> - etiqueta: `Prancha de bancada · Poaceae`
> - título: `Morfologia funcional das gramíneas`
> - chamada: `Toda a pecuária a pasto depende de um detalhe de anatomia: a gramínea guarda o ponto de crescimento perto do chão. Cinco módulos para ver por que isso muda tudo.`
> - duração: `5 módulos · ~4 min`
> - botão: `Começar pela prancha`
>
> Não crie os cinco módulos agora. Só a moldura.

---

## Bloco 1 — Motor de desenho SVG

> Agora o motor de desenho. Ele será compartilhado pelos módulos 1 e 2, então
> faça como um módulo de funções puras em `src/components/svgPartes.ts`.
>
> Nada de imagem raster, nada de biblioteca de ícones, nada de SVG copiado de
> banco de imagens. Todas as formas são **geradas por código**, avaliando curvas
> de Bézier cúbicas.
>
> Função central, `construirLamina`: recebe quatro pontos de controle (base, c1,
> c2, ponta) e devolve o contorno de uma lâmina foliar. O algoritmo é:
>
> 1. Amostre a Bézier cúbica em ~28 pontos ao longo de t ∈ [0,1].
> 2. Em cada ponto calcule também a **derivada** da curva, e dela o vetor
>    perpendicular normalizado.
> 3. Deslocar o ponto ao longo da perpendicular por `(largura/2) * (1-t)^afinamento`
>    dá as duas margens da folha — que assim afina até a ponta.
> 4. O contorno é um lado, mais o outro lado invertido, fechado.
> 5. As nervuras são os mesmos deslocamentos com fatores intermediários entre
>    -0,72 e +0,72. Nervuras paralelas, nunca ramificadas em rede — isso é a
>    assinatura anatômica do grupo e precisa estar visualmente correta.
>
> Exporte também: `construirColmo`, `construirNo`, `construirBainha`,
> `construirRaizes` (feixe fasciculado, sem raiz principal dominante),
> `construirPanicula` e `construirHasteRasteira`.
>
> **Os desenhos precisam ser determinísticos.** Onde precisar de assimetria
> orgânica, não use `Math.random` — use ruído pseudoaleatório reproduzível, do
> tipo `Math.sin(i * 12.9898) * 43758.5453`. O traço não pode mudar entre
> renders.
>
> Traço em `--tinta` sobre fundo `--papel`. Preenchimento só onde indicar tecido
> vivo, aí em `--folha`.
>
> Cuidado com dois erros que dão errado sozinhos: lâminas estreitas demais fazem
> a planta parecer uma pena ou um feto; a panícula precisa ser densa (uns 13
> ramos, 4 espiguetas pequenas por ramo) ou vira fronde de samambaia.

---

## Bloco 2 — Módulo 1: a prancha anatômica (o elemento-assinatura)

> Este é o módulo âncora do app. É onde o projeto ganha ou perde.
>
> Desenhe, com o motor do bloco anterior, uma **prancha botânica de um perfilho
> de gramínea em fase vegetativa, vista lateral**, com linhas-guia numeradas
> apontando para cada estrutura. A numeração é legítima: é convenção científica
> real, e a legenda mapeia número → estrutura.
>
> **Composição (viewBox 400×1360, retrato alto):** o perfilho inteiro ocupa a
> parte de cima, com o solo por volta de y=648. Abaixo dele, **dois detalhes
> ampliados empilhados verticalmente** (círculos de raio ~115, não lado a lado —
> lado a lado fica ilegível a 375px):
> - **Detalhe A · região do colar** (centro ≈ 200,910): mostra colar, lígula e
>   aurícula em corte aumentado. Essas três estruturas ficam a milímetros uma da
>   outra na planta real; sem a ampliação não há como apontá-las.
> - **Detalhe B · base do perfilho** (centro ≈ 200,1185): mostra a gema axilar e
>   o meristema apical, **com uma linha tracejada horizontal marcando a altura do
>   pastejo**. O meristema tem que ficar visivelmente **abaixo** dessa linha.
>   Essa relação espacial é o argumento inteiro do app — se o desenho não deixar
>   isso óbvio, refaça.
>
> Lâminas em disposição dística (alternadas, uma para cada lado). Remova as
> bainhas do terço médio do colmo, para expor nó, entrenó e gema.
>
> **Interação.** Tocar num número seleciona a estrutura e abre um painel com:
> nome, `O que é` (função) e `Por que importa`. Mas o controle acessível de
> verdade **não** são os círculos do SVG: é a **legenda abaixo do desenho**, em
> duas colunas de botões reais, com foco de teclado visível e alvo de 44px. Os
> círculos numerados são reforço visual. Faça o painel `position: sticky;
> bottom: 0` dentro do container alto, para ele ficar preso na base da viewport
> enquanto a prancha rola. O painel só existe quando há seleção — nada de
> placeholder "aguardando seleção" roubando tela.
>
> **A sequência de movimento (a única do app):** ao a prancha entrar na viewport
> pela primeira vez (IntersectionObserver, dispara uma vez só), o perfilho
> "cresce" da base ao ápice em 900ms, com `transform-origin` na base, e em
> seguida as chamadas numeradas aparecem em cascata. Com
> `prefers-reduced-motion: reduce`, nada disso roda e tudo aparece estático.
>
> Legenda da prancha: título `Prancha I`, subtítulo `Perfilho de gramínea ·
> Poaceae · fase vegetativa · vista lateral`, instrução `Toque num número da
> prancha — ou num nome da legenda abaixo.` e três notas de rodapé: bainhas
> removidas do terço médio; a tracejada do detalhe B marca a altura do pastejo;
> desenho esquemático sem escala.
>
> As catorze estruturas, em ordem do ápice para a raiz. **Use estes textos
> exatamente como estão** — não reescreva, não resuma:
>
> **1. Inflorescência** — *O que é:* Conjunto de espiguetas no topo do colmo. É onde a gramínea floresce e produz sementes. *Por que importa:* Quando a planta emite a inflorescência, ela desvia energia da produção de folhas para a semente: a forragem perde proteína e ganha fibra. Por isso o manejo de pastagem procura colher a planta antes desse ponto.
>
> **2. Lâmina foliar** — *O que é:* A parte plana e expandida da folha, a partir do colar. É a superfície que captura a luz e faz a fotossíntese. *Por que importa:* É a fração mais nutritiva da planta e a primeira que o animal procura. Quanto mais lâmina viva sobra depois do pastejo, mais rápido o capim se recupera — porque é ela que financia a rebrota.
>
> **3. Nervuras paralelas** — *O que é:* Feixes condutores que correm lado a lado da base à ponta da lâmina, sem se ramificar em rede. *Por que importa:* É a assinatura das monocotiledôneas: em vez de uma nervura central com ramificações, a folha tem vias paralelas. Se uma é rompida pelo dente do animal, as vizinhas continuam conduzindo água e açúcar — a folha rasgada segue funcionando.
>
> **4. Colar** *(detalhe A)* — *O que é:* A faixa que marca a junção entre a bainha e a lâmina, na parte de trás da folha. *Por que importa:* É a dobradiça da folha: define o ângulo com que a lâmina se abre e, portanto, quanta luz ela intercepta. O formato do colar, da lígula e da aurícula é o que permite identificar a espécie mesmo sem inflorescência.
>
> **5. Lígula** *(detalhe A)* — *O que é:* Pequena projeção — membranosa ou formada por pelos — na face interna da folha, exatamente onde a lâmina se separa do colmo. *Por que importa:* Funciona como uma vedação: impede que água de chuva, poeira e esporos escorram para dentro da bainha, onde ficariam parados contra o tecido jovem. Seu formato é um dos caracteres mais usados na identificação de gramíneas.
>
> **6. Aurícula** *(detalhe A)* — *O que é:* Par de apêndices em forma de garra que, quando presentes, abraçam o colmo nas laterais do colar. *Por que importa:* Pode ser bem desenvolvida, reduzida ou ausente conforme a espécie — e essa variação é chave de identificação. Ajuda a prender a bainha ao colmo, dando firmeza mecânica à folha jovem que ainda está se abrindo.
>
> **7. Bainha** — *O que é:* A base da folha, que envolve o colmo como um cilindro aberto e sobe do nó até o colar. *Por que importa:* É armadura e almoxarifado. Protege o entrenó jovem e a gema que estão embaixo dela e acumula reservas usadas na rebrota. Bainha preservada depois do pastejo é energia disponível para a próxima folha.
>
> **8. Colmo** — *O que é:* O caule das gramíneas: cilíndrico, dividido em nós e entrenós, geralmente oco entre os nós. *Por que importa:* Sustenta as folhas e conduz água e nutrientes. Colmo em excesso na pastagem significa forragem fibrosa e de baixa digestibilidade — a relação folha/colmo é um dos indicadores diretos da qualidade do pasto.
>
> **9. Nó** — *O que é:* Ponto sólido e levemente inchado do colmo, de onde saem a folha, a gema e, em algumas espécies, raízes. *Por que importa:* Cada nó é um ponto de reinício. Em capins decumbentes ou estoloníferos, o nó que encosta no solo emite raiz e forma uma planta nova — é assim que a touceira se espalha sem depender de semente.
>
> **10. Entrenó** — *O que é:* O segmento de colmo entre dois nós consecutivos. *Por que importa:* Enquanto a planta está vegetativa, os entrenós ficam curtos e comprimidos na base. Quando o entrenó alonga, o ponto de crescimento sobe junto — e passa a ficar ao alcance do dente do animal e da lâmina da roçadeira.
>
> **11. Gema axilar** *(detalhe B)* — *O que é:* Broto adormecido alojado em cada nó, protegido pela bainha da folha correspondente. *Por que importa:* É o estoque de plantas futuras. Cada gema basal pode acordar e virar um perfilho inteiro. Rebaixar demais o pasto destrói essas gemas — e sem gema não existe rebrota, por mais adubo que se aplique.
>
> **12. Perfilho** — *O que é:* Uma haste completa e independente — com folhas, colmo e raízes próprias — nascida de uma gema basal da planta-mãe. *Por que importa:* A gramínea não é um indivíduo só: é uma população de perfilhos que nascem e morrem o tempo todo. A produção do pasto é o resultado dessa contabilidade. Manejo que mantém alta a taxa de aparecimento de perfilhos mantém alta a produção.
>
> **13. Meristema apical** *(detalhe B — DESTAQUE)* — *O que é:* O tecido que origina todas as folhas novas. Na fase vegetativa da gramínea ele permanece próximo à base da planta, agachado dentro do cartucho de bainhas — e não no alto do caule. *Por que importa (três parágrafos separados):*
> > Aqui está o motivo de existir pastagem. Como o ponto de crescimento fica abaixo da altura em que o animal pastejou ou a roçadeira cortou, ele escapa ileso da desfolha. Somado às gemas basais, que emitem novos perfilhos, isso permite que a mesma planta seja desfolhada dezenas de vezes e rebrote sempre.
> >
> > A maioria das dicotiledôneas tem o meristema apical exposto na ponta do caule: cortou a ponta, perdeu o ponto de crescimento. A gramínea, não.
> >
> > Quando ela entra em fase reprodutiva, porém, o entrenó alonga e eleva o meristema. Se o corte acontece nesse momento, o ponto de crescimento vai junto — e a rebrota passa a depender inteiramente das gemas basais.
>
> **14. Sistema radicular fasciculado** — *O que é:* Um feixe denso de raízes finas e de calibre parecido, saindo todas da base da planta — sem raiz principal dominante. *Por que importa:* Essa malha ocupa o volume de solo mais próximo da superfície e segura as partículas: é o que dá à pastagem bem manejada seu poder de conter erosão. As raízes também param de crescer quando a parte aérea é rebaixada demais — desfolha severa poda a raiz junto, mesmo sem ninguém tocar no solo.
>
> A estrutura 13 é o clímax conceitual do app. Dê a ela um tratamento visual
> distinto no painel — um rótulo `O ponto-chave` no lugar de `Por que importa`.
> É o "aha" de 15 segundos que o visitante leva pra casa.

---

## Bloco 3 — Módulo 2: hábitos de crescimento

> Quatro estados alternados por botão (padrão ARIA de abas, com tabindex móvel e
> navegação por setas), **reusando o mesmo motor SVG do módulo 1** — a planta
> desenhada em vista lateral, superior ou em corte do solo, conforme o hábito.
>
> Cada estado mostra: nome, espécie exemplo em itálico, nome popular, descrição,
> a consequência prática, e quatro indicadores com uma barrinha de leitura rápida
> de nível 1 a 4.
>
> **Cespitoso** · Touceira · *Megathyrsus maximus* · capim-mombaça, capim-tanzânia · vista lateral, nota `solo descoberto`
> Descrição: Os perfilhos nascem de gemas na base da planta e crescem para cima, todos juntos. O resultado é uma touceira compacta e alta, com solo descoberto entre uma touceira e outra.
> Consequência: Produz muita massa por touceira e rebrota rápido, mas deixa o solo exposto entre as plantas — o que cobra planta bem espaçada, manejo de altura correto e cuidado redobrado com pisoteio, porque a touceira não se refaz por rastejo.
> Indicadores: cobertura do solo `parcial` (2) · tolerância a pisoteio `baixa` (1) · velocidade de rebrota `alta` (4) · resistência à erosão `média` (2)
>
> **Decumbente** · Colmos deitados · *Urochloa decumbens* · capim-braquiária · vista lateral, nota `nó enraizado = planta nova`
> Descrição: Os colmos partem eretos, mas se inclinam e encostam no solo. Onde um nó toca a terra, ele emite raízes e origina uma planta nova, ligada à mãe.
> Consequência: Fecha o terreno em todas as direções e forma um tapete contínuo, o que segura o solo muito bem. Em compensação a massa fica mais rente ao chão e boa parte dela é colmo — forragem mais fibrosa que a da touceira.
> Indicadores: cobertura do solo `alta` (4) · tolerância a pisoteio `média-alta` (3) · velocidade de rebrota `média` (2) · resistência à erosão `alta` (4)
>
> **Estolonífero** · Estolões na superfície · *Cynodon dactylon* · grama-seda, tifton · vista superior, nota `estolões avançam sobre o solo`
> Descrição: Emite estolões — hastes que correm por cima do solo. A cada nó do estolão brotam raízes e um novo perfilho, e a planta caminha pela área.
> Consequência: Cicatriza falhas sozinho: uma área pisoteada ou descoberta é reocupada pelo avanço dos estolões. É o hábito que melhor tolera tráfego intenso, o que explica seu uso em piquetes de alta lotação e em gramados.
> Indicadores: cobertura do solo `muito alta` (4) · tolerância a pisoteio `alta` (4) · velocidade de rebrota `alta` (4) · resistência à erosão `alta` (4)
>
> **Rizomatoso** · Rizomas subterrâneos · *Paspalum notatum, Cynodon spp.* · grama-batatais, tifton · corte do solo, nota `gemas protegidas sob a terra`
> Descrição: Os caules de propagação correm por baixo do solo. Do rizoma partem raízes e perfilhos que emergem à distância da planta-mãe.
> Consequência: As gemas ficam enterradas, longe do dente, do casco e do fogo — por isso é o hábito mais difícil de eliminar e o mais persistente sob pressão. Ocupa a área devagar, mas o que ocupa não devolve.
> Indicadores: cobertura do solo `alta` (3) · tolerância a pisoteio `muito alta` (4) · velocidade de rebrota `média` (2) · resistência à erosão `muito alta` (4)
>
> Nota de rodapé do módulo: `Muitas espécies combinam dois hábitos. O Tifton 85, por exemplo, avança por estolão na superfície e por rizoma abaixo dela.`
>
> Dois desenhos que costumam sair errados: a touceira cespitosa vira palmeira ou
> agave se você desenhar colmo + folhas no topo — construa como um **leque de
> ~9 lâminas arqueadas saindo de uma base comprimida**, com assimetria de ruído
> determinístico. E os estolões viram um emaranhado em S se você deixar as curvas
> soltas — use **seis vetores de direção explícitos irradiando da planta-mãe**,
> Béziers quadráticas, com rosetas a 52% e a 100% de cada estolão.

---

## Bloco 4 — Módulo 3: C3 × C4 na régua

> Um slider de temperatura de 10 °C a 40 °C, passo 1, começando em **22 °C**.
> Duas barras respondem em tempo real mostrando a eficiência fotossintética
> relativa de cada rota. O visitante arrasta e **vê a inversão acontecer** — é
> isso que um slide não faz.
>
> Modele as curvas como gaussianas assimétricas (didáticas, não dado
> experimental), normalizadas pelo teto da C4:
>
> ```
> eficiencia(rota, t) = teto * exp( -(t - otimo)² / (2σ²) )
>   onde σ = sigmaAbaixo se t < otimo, senão sigmaAcima
>
> C3 · "clima temperado" · otimo 21 · teto 72  · σ↓ 8  · σ↑ 11
>      exemplos: azevém, aveia, trigo, festuca
> C4 · "clima tropical"  · otimo 35 · teto 100 · σ↓ 11 · σ↑ 6
>      exemplos: braquiária, mombaça, tifton, milho
> ```
>
> **Calcule o ponto de inversão por varredura numérica das próprias curvas** (dá
> ≈25,2 °C), não escreva o número solto no texto. Assim, se alguém mexer nas
> curvas, a marcação acompanha.
>
> **Marque na régua a faixa de temperatura de Jaguariúna/SP: 18–30 °C** (clima
> Cwa, média das mínimas e máximas na estação de crescimento, outubro a março).
> Faixa como retângulo `--palha` a 45% com bordas tracejadas em `--tinta`.
> Legenda embaixo: `Jaguariúna/SP · 18–30 °C` e `inversão em 25,2 °C`.
>
> Detalhe de layout que dá errado: **a linha vertical da inversão não pode
> cruzar os numerais da régua.** Separe em duas faixas empilhadas — uma faixa de
> ~20px só para a banda da região e o traço da inversão, e abaixo outra de ~28px
> só para os ticks e os números (10, 15, 20, 25, 30, 35, 40).
>
> A barra da C4 usa fundo `--palha` com borda `--tinta`; a da C3, fundo
> `--tinta`. Ambas com `role="meter"` e rótulo acessível.
>
> Mostre também a vantagem corrente numa etiqueta escura:
> `vantagem: C4 · 1,4× a C3` — com vírgula decimal.
>
> Abaixo, três linhas em mono explicando:
>
> **anatomia Kranz** — C3 `ausente` · C4 `presente` — Na C4 as células ao redor da nervura formam uma coroa (Kranz, em alemão) que isola o CO₂ e o concentra onde a fotossíntese acontece. A C3 não tem essa dupla câmara e fixa o carbono num compartimento só.
>
> **ponto de compensação de CO₂** — C3 `40–70 ppm` · C4 `< 10 ppm` — É a concentração de CO₂ abaixo da qual a planta gasta mais do que produz. A C4 continua no lucro com quase nada de CO₂ disponível; a C3 para muito antes — e no calor perde parte do que fixou em fotorrespiração.
>
> **água por kg de matéria seca** — C3 `450–700 L` · C4 `250–350 L` — Concentrando CO₂ internamente, a C4 pode manter os estômatos mais fechados e ainda assim produzir. Faz aproximadamente o dobro de matéria seca com a mesma água — a razão de o pasto tropical aguentar veranico melhor que o de inverno.
>
> Nota: `Curvas didáticas de eficiência relativa. No campo o resultado também depende de luz, água, nitrogênio e do estádio da planta.`

---

## Bloco 5 — Módulo 4: o desafio

> Seis perguntas de múltipla escolha, **uma por tela**, com feedback imediato que
> explica **o porquê** — não só certo/errado. É reforço, não pegadinha: quem
> percorreu os módulos 1 a 3 acerta.
>
> No fim, o placar em número grande na Fraunces. Guarde o recorde da bancada em
> `localStorage` sob a chave `poaceae:recorde-da-bancada` (dentro de try/catch),
> exibido como `melhor resultado do dia:`. O botão **`Recomeçar`** fica **sempre
> visível**, em toda tela do quiz, para o próximo visitante começar limpo.
>
> Painel de resultado com fundo `--tinta` e o número em `--palha` (6,9:1, passa
> AA). Alternativa correta destacada com fundo `--palha` e texto `--tinta`.
>
> **Q1** (Prancha · estrutura 13) — Por que uma gramínea aguenta ser pastejada muitas vezes e continuar rebrotando?
> a) Porque cresce mais rápido que as outras plantas
> b) ✅ Porque o ponto de crescimento fica perto da base, abaixo da altura do corte
> c) Porque as raízes armazenam água suficiente para repor as folhas
> *Explicação:* Na fase vegetativa o meristema apical fica agachado perto do solo, protegido dentro das bainhas. O animal leva a lâmina, mas não leva a fábrica de folhas. Na maioria das dicotiledôneas esse ponto fica exposto no alto do caule — cortou a ponta, acabou.
>
> **Q2** (Prancha · estruturas 11 e 12) — De onde nasce um perfilho novo?
> a) ✅ De uma gema axilar alojada num nó da base da planta
> b) De uma semente caída ao lado da touceira
> c) De uma ramificação da raiz principal
> *Explicação:* Cada nó guarda uma gema adormecida, protegida pela bainha. Quando ela desperta, vira um perfilho completo — com folhas, colmo e raízes próprias. É por isso que rebaixar demais o pasto compromete a rebrota: destrói o estoque de gemas.
>
> **Q3** (Prancha · estrutura 3) — A folha da gramínea tem nervuras paralelas, sem rede de ramificações. Que vantagem prática isso traz sob pastejo?
> a) Deixa a folha mais dura e menos atrativa para o animal
> b) Faz a folha crescer da ponta para a base
> c) ✅ Se uma nervura é rompida, as vizinhas continuam conduzindo — a folha rasgada segue funcionando
> *Explicação:* São vias paralelas e independentes. O dente do animal rasga a lâmina, mas não interrompe o transporte de água e açúcar do resto dela. Numa folha de nervação em rede, o mesmo rasgo isolaria toda a região acima do corte.
>
> **Q4** (Hábitos de crescimento) — Um piquete vai receber lotação alta e tráfego pesado de animais. Que hábito de crescimento tende a se sair melhor?
> a) Cespitoso, porque a touceira produz mais massa por planta
> b) ✅ Estolonífero, porque os estolões reocupam sozinhos as falhas abertas pelo casco
> c) Tanto faz: o hábito não interfere na tolerância a pisoteio
> *Explicação:* O estolão corre pela superfície e enraíza a cada nó, então o capim cicatriza as áreas descobertas por conta própria. A touceira cespitosa não caminha: se um perfilho morre pisoteado, o espaço fica aberto até entrar semente.
>
> **Q5** (C3 × C4 · régua de temperatura) — Perto de 35 °C, qual rota fotossintética é mais eficiente — e por quê?
> a) C3, porque tem o ciclo mais simples e gasta menos energia
> b) As duas igualmente: a temperatura não altera a eficiência
> c) ✅ C4, porque concentra CO₂ na anatomia Kranz e escapa da fotorrespiração
> *Explicação:* Quanto mais quente, mais a C3 perde carbono em fotorrespiração. A C4 blinda o CO₂ dentro da bainha vascular e mantém a eficiência subindo até perto de 35 °C. Abaixo de uns 25 °C a vantagem se inverte, e é aí que o azevém entra na cena.
>
> **Q6** (C3 × C4 · uso da água) — Numa seca prolongada, por que o capim tropical C4 costuma segurar melhor a produção que uma forrageira C3?
> a) ✅ Porque produz mais matéria seca com menos água, mantendo os estômatos mais fechados
> b) Porque tem raízes de calibre maior, que chegam ao lençol freático
> c) Porque interrompe a fotossíntese e vive das reservas até a chuva voltar
> *Explicação:* Como a C4 já concentra CO₂ internamente, ela pode fechar mais os estômatos, perder menos vapor de água e ainda assim fixar carbono. Na prática produz mais ou menos o dobro de matéria seca por litro de água que uma C3.
>
> Desfechos por número de acertos:
> - 6 · **Domínio completo** — Nenhum erro. Você levou a morfologia inteira da bancada.
> - 5 · **Muito bem** — Faltou pouco. Vale reler a estrutura que escapou.
> - 4 · **Bom resultado** — A ideia central ficou. Volte na prancha para fechar o resto.
> - 2–3 · **Já pegou o fio** — Passe pela prancha e pela régua de temperatura e tente de novo.
> - 0–1 · **Comece pela prancha** — Toque na estrutura 13 — o meristema apical. É de lá que sai quase tudo.

---

## Bloco 6 — Módulo 5: fichas de espécies

> Seis cards compactos. Fechado, cada um mostra: nome científico **em itálico**,
> cultivar, nome popular, hábito, rota fotossintética e as medidas de manejo em
> mono. **Toque expande** para revelar descrição e ponto de atenção.
>
> **Urochloa brizantha** cv. Marandu · capim-marandu · Cespitoso · C4
> entrada `30 cm` · saída `15 cm` · matéria seca `10–15 t/ha/ano`
> A gramínea mais plantada do Brasil Central. Touceira robusta, boa adaptação a solos de fertilidade média e resposta consistente à adubação nitrogenada.
> *Atenção:* Sensível a solo encharcado e à morte-do-braquiarão em áreas mal drenadas. Rebaixar abaixo de 15 cm consome o estoque de gemas basais e atrasa a rebrota.
>
> **Urochloa decumbens** cv. Basilisk · capim-braquiária · Decumbente · C4
> entrada `25 cm` · saída `10 cm` · matéria seca `8–12 t/ha/ano`
> Colmos que se deitam e enraízam nos nós, formando um tapete contínuo. Tolera solo de baixa fertilidade melhor que a maioria e cobre o terreno rapidamente.
> *Atenção:* Associada a fotossensibilização em bezerros, sobretudo em rebrota nova. Produz menos que o marandu e concentra a massa perto do chão.
>
> **Megathyrsus maximus** cv. Mombaça · capim-mombaça · Cespitoso · C4
> entrada `90 cm` · saída `30–40 cm` · matéria seca `20–25 t/ha/ano`
> Touceira alta e de altíssima produção, feita para pastejo rotacionado com boa fertilidade e adubação. A entrada aos 90 cm corresponde ao ponto em que o dossel intercepta cerca de 95% da luz.
> *Atenção:* Exige solo fértil e manejo disciplinado. Passar do ponto de entrada faz a touceira alongar o colmo, elevar o meristema e despencar em qualidade.
>
> **Cynodon spp.** cv. Tifton 85 · tifton · Estolonífero e rizomatoso · C4
> entrada `25–30 cm` · saída `10–15 cm` · matéria seca `15–20 t/ha/ano`
> Avança por estolão na superfície e por rizoma abaixo dela — as duas estratégias na mesma planta. Alta digestibilidade e a melhor tolerância a pisoteio do grupo, o que o torna padrão em piquetes de alta lotação e em feno.
> *Atenção:* Propagação por mudas, não por semente: implantação mais cara e mais lenta. Responde muito a nitrogênio e cobra essa adubação para manter a produção.
>
> **Pennisetum purpureum** cv. Napier · capim-elefante · Cespitoso alto · C4
> corte `1,5–2,0 m` · uso `capineira, silagem` · matéria seca `30–40 t/ha/ano`
> A maior produtora de matéria seca da lista. Usada sobretudo em capineira, picada no cocho, ou ensilada — não em pastejo direto, dado o porte.
> *Atenção:* Cortar tarde derruba a qualidade rápido: o colmo engrossa, a relação folha/colmo cai e sobra fibra. A produção só se realiza com adubação pesada.
>
> **Lolium multiflorum** · azevém · Cespitoso · **C3**
> entrada `25–30 cm` · saída `10 cm` · matéria seca `6–10 t/ha/ano`
> A única C3 da lista, e é exatamente por isso que ela existe aqui: cresce no frio, quando as tropicais param. Forragem de qualidade alta, semeada no outono para cobrir o vazio do inverno.
> *Atenção:* Ciclo anual e produção que despenca quando a temperatura sobe — pela curva do módulo 3, acima de 25 °C a vantagem já passou para as C4.
>
> Rodapé discreto do módulo: `Os valores são faixas de referência para leitura
> comparativa. Alturas de manejo e produção de matéria seca variam com
> fertilidade do solo, adubação, clima, estação do ano e método de pastejo.`

---

## Bloco 7 — Acabamento e auditoria

> Agora audite o que construímos e corrija. Verifique item por item e me diga o
> resultado de cada um:
>
> 1. **Sem scroll horizontal** em 320, 360, 375, 414, 768, 1024 e 1440px.
> 2. **Nenhum alvo de toque abaixo de 44×44px.** Meça todos os `button`, `a`,
>    `input` e `[role=tab]` e me liste os que reprovarem.
> 3. **Foco de teclado visível** em todos os controles — contorno de 2px, não
>    `outline: none`. Inclua um link "Pular para o conteúdo" que apareça no
>    primeiro Tab, com 44px de altura de verdade (cuidado: as utilidades
>    `not-sr-only` do Tailwind zeram o padding e vencem na cascata — use uma
>    classe própria com posicionamento fora da tela).
> 4. **Contraste WCAG AA** em todo texto. Confirme especialmente que `--palha`
>    não está sendo usada como cor de texto sobre fundo claro em lugar nenhum.
> 5. **`prefers-reduced-motion: reduce`** desliga a sequência de crescimento e
>    revela tudo estático, sem conteúdo invisível.
> 6. **Zero erro no console e zero 404.**
> 7. **Nenhuma string de interface hardcoded em componente.** Todo rótulo, todo
>    texto de aria, todo título de SVG vem de `src/data/`. Varra os componentes e
>    mova o que tiver escapado.
> 8. **Remova código morto:** exports não usados, campos de dados que nenhum
>    componente lê.
>
> Depois disso, faça uma crítica honesta do próprio resultado: o que ficou
> templated, genérico ou apertado a 375px? Corrija antes de me mostrar.

---

## Bloco 8 — Offline (opcional, mas é o que salva a feira)

> A feira tem wi-fi ruim. Depois do primeiro carregamento, o app precisa
> funcionar **sem conexão nenhuma**.
>
> 1. **Auto-hospede as fontes.** Suba os `.woff2` de Fraunces, IBM Plex Sans
>    (400/600) e IBM Plex Mono (400/500) para `public/fonts/` e declare
>    `@font-face` local. Nenhuma chamada a CDN, nenhum `<link>` para Google
>    Fonts, nenhuma requisição externa em runtime, nenhum analytics.
> 2. **Registre um service worker** com estratégia cache-first, que guarde o app
>    inteiro no primeiro acesso e responda navegações a partir do cache.
> 3. Teste com o navegador em modo offline: recarregue e confirme que a página
>    renderiza inteira.
>
> Observação: o Lovable serve fontes por CDN por padrão. Se ele resistir a
> auto-hospedar, insista — no contexto de uma feira isso não é preferência
> estética, é o que impede a bancada de cair.

---

## Observações sobre o Lovable

- Ele vai gerar **TypeScript** e provavelmente puxar **shadcn/ui**. Tudo bem,
  desde que os tokens de cor e a tipografia acima sejam respeitados. Se os
  componentes começarem a parecer dashboard genérico, mande: *"remova o visual
  padrão do shadcn deste componente e siga os tokens da prancha de herbário"*.
- O bloco 1 (motor SVG) é o mais provável de sair errado. Se o desenho ficar
  ruim, não peça "melhore" — descreva o defeito concreto: *"as lâminas estão
  finas demais e parecem penas; aumente a largura e reduza o afinamento"*.
- Se ele travar num bloco grande, corte o bloco ao meio e mande em duas partes.
- O código que já existe neste repositório é referência: quando o Lovable
  emperrar num detalhe, abra o arquivo equivalente em `src/` e cole o trecho.

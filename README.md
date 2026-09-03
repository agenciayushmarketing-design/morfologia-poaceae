# Morfologia funcional das gramíneas — app de bancada

Aplicativo web estático sobre morfologia funcional das Poaceae, feito para rodar
numa feira acadêmica: o visitante escaneia um QR code e abre no próprio celular,
enquanto um tablet na bancada roda a mesma URL o dia inteiro.

Sem backend, sem banco, **sem nenhuma requisição externa em runtime**. Fontes
auto-hospedadas. Depois do primeiro carregamento o app funciona offline.

## Rodar

```bash
npm install
npm run dev
```

## Build e deploy

```bash
npm run build
```

Gera `dist/`, que funciona servido de qualquer servidor estático. Na Vercel
basta importar o repositório: `vercel.json` já traz build command, diretório de
saída e os cabeçalhos de cache.

O build também gera `dist/sw.js` (script `scripts/gerar-sw.mjs`), um service
worker que guarda o app inteiro em cache no primeiro acesso. É o que garante que
uma queda de wi-fi no meio da feira não derrube a bancada.

## Onde mexer no conteúdo

Todo o texto e todo número visível vivem em `src/data/`. Nenhum componente
carrega conteúdo próprio.

| Arquivo | O que guarda |
| --- | --- |
| `src/data/estruturas.js` | As 14 estruturas da prancha: nome, função, por que importa, e onde fica cada chamado numerado |
| `src/data/habitos.js` | Os quatro hábitos de crescimento, consequências práticas e indicadores |
| `src/data/fotossintese.js` | Curvas C3/C4, faixa de temperatura da região e o comparativo em mono |
| `src/data/quiz.js` | As seis questões, explicações e mensagens de desfecho |
| `src/data/especies.js` | As seis fichas de espécies |
| `src/data/site.js` | Capa, títulos de seção, rótulos de interface e rodapé |

### Ajustar a região da feira

O módulo 3 marca na régua a faixa típica de temperatura da região onde o app vai
ser exposto. Está configurado para **Jaguariúna/SP, 18–30 °C** (clima Cwa, médias
da estação de crescimento). Para trocar, edite o objeto `regiao` no topo de
`src/data/fotossintese.js` — nada mais depende dele:

```js
export const regiao = {
  nome: 'Jaguariúna/SP',
  detalhe: 'média das mínimas e máximas na estação de crescimento (out–mar)',
  min: 18,
  max: 30,
}
```

O ponto de inversão entre as curvas (≈ 25,2 °C) é calculado por varredura a
partir das próprias curvas, então acompanha qualquer ajuste que você fizer nelas.

## Fontes

Os `.woff2` ficam versionados em `public/fonts/` e são declarados via `@font-face`
local em `src/index.css`. Nenhuma chamada a CDN.

Para regerá-los a partir das dependências:

```bash
npm run fonts
```

## Decisões de projeto

**Paleta.** Tokens em `:root` (`src/index.css`), consumidos pelo Tailwind
(`tailwind.config.js`) como triplas RGB, para permitir modificador de opacidade.

Uma variante foi acrescentada aos tokens originais: `--oliva-texto` (`#4A5449`),
exposta no Tailwind como `text-legenda`. A `--oliva` original (`#8A9483`) tem
apenas 2,8:1 sobre `--papel` e reprovaria em WCAG AA como texto — então ela ficou
restrita a filetes, linhas de apoio e traço de desenho, e o texto secundário usa
a versão escurecida (7,1:1). Pela mesma razão, `--palha` nunca aparece como texto
sobre fundo claro: ela entra como preenchimento com texto `--tinta` por cima
(6,9:1), em marcadores, estado ativo e barras.

**Toque, não hover.** Toda interação funciona com um toque. `:hover` não é
requisito em lugar nenhum. Alvos com no mínimo 44×44 px (utilitário `.toque`).

**A prancha.** SVG desenhado por geração de curvas em `src/components/svgPartes.js`
— nada de raster, nada de ícone pronto. O mesmo motor monta os quatro hábitos do
módulo 2. Os desenhos são determinísticos: sem `Math.random`, o traço não muda
entre renders.

Na prancha, tocar num número seleciona a estrutura, mas o controle acessível de
verdade é a legenda abaixo do desenho: são botões reais, com foco de teclado e
alvo de 44 px. Os círculos numerados do SVG são reforço visual.

**Movimento.** Uma única sequência orquestrada: o perfilho cresce da base ao
ápice em 900 ms e as chamadas numeradas aparecem em cascata. Fora dela, só
transições de estado de 160–200 ms. Com `prefers-reduced-motion: reduce` a
sequência não roda e tudo aparece estático — as animações usam `fill-mode:
backwards` de propósito, para que o estado final seja sempre o estado natural do
elemento.

**Estado persistente.** Só o recorde do quiz (`localStorage`, chave
`poaceae:recorde-da-bancada`). Nada mais sobrevive entre visitantes, e o botão
"Recomeçar" fica sempre visível.

## Estrutura

```
public/fonts/        .woff2 auto-hospedados
scripts/             copiar fontes, gerar service worker
src/data/            todo o conteúdo textual e numérico
src/components/      componentes e o motor de desenho SVG
src/hooks/           movimento reduzido, seção ativa
```

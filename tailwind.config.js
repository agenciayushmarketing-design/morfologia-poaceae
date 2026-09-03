/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pedra: 'rgb(var(--pedra) / <alpha-value>)',
        tinta: 'rgb(var(--tinta) / <alpha-value>)',
        palha: 'rgb(var(--palha) / <alpha-value>)',
        folha: 'rgb(var(--folha) / <alpha-value>)',
        oliva: 'rgb(var(--oliva) / <alpha-value>)',
        // variante escurecida da oliva, para TEXTO secundario passar em WCAG AA.
        // a --oliva original fica reservada a linhas de apoio e traco.
        legenda: 'rgb(var(--oliva-texto) / <alpha-value>)',
        papel: 'rgb(var(--papel) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces Variable', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // escala explicita, com salto real entre niveis
        'rotulo': ['0.6875rem', { lineHeight: '1.1', letterSpacing: '0.14em' }],
        'micro': ['0.75rem', { lineHeight: '1.45' }],
        'apoio': ['0.875rem', { lineHeight: '1.55' }],
        'corpo': ['1rem', { lineHeight: '1.65' }],
        'guia': ['1.125rem', { lineHeight: '1.6' }],
        'titulo': ['clamp(1.75rem, 7vw, 2.75rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'placar': ['clamp(4rem, 22vw, 7rem)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
      },
      borderRadius: { plana: '2px', card: '6px' },
      maxWidth: { leitura: '34rem', bancada: '68rem' },
      transitionDuration: { curta: '160ms', media: '200ms' },
    },
  },
  plugins: [],
}

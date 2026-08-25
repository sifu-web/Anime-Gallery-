import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#08080d',
        surface: '#121218',
        'surface-2': '#191922',
        edge: '#26262f',
        ink: '#eef0f7',
        muted: '#9494a6',
        sakura: '#ff5d8f',
        aurora: '#4fe0d0',
        amber: '#ffb454'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,93,143,0.15), 0 8px 40px -8px rgba(255,93,143,0.25)',
        'glow-aurora': '0 0 0 1px rgba(79,224,208,0.15), 0 8px 40px -8px rgba(79,224,208,0.25)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.6s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;

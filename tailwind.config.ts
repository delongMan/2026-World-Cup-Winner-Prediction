import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0f1e',
        'bg-card': '#111827',
        'bg-card-hover': '#1a2332',
        'accent-gold': '#f0c040',
        'accent-green': '#22c55e',
        'slot-empty': '#374151',
      },
      animation: {
        'pulse-slot': 'pulseSlot 2s ease-in-out infinite',
        'glow-line': 'glowLine 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseSlot: { '0%, 100%': { opacity: '0.3' }, '50%': { opacity: '0.6' } },
        glowLine: { '0%': { strokeDashoffset: '1000' }, '100%': { strokeDashoffset: '0' } },
      },
      containers: {
        bracket: '320px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config

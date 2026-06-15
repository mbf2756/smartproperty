import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1A2F1A',  // deep forest green (replaces navy)
          mid: '#243524',      // mid forest
          light: '#2E4A2E',    // lighter forest
        },
        gold: {
          DEFAULT: '#C9963A',  // warm gold (replaces teal)
          dim: '#A67C2E',      // deeper gold
          light: '#E8B86D',    // lighter gold
        },
        cream: {
          DEFAULT: '#F7F4EE',  // warm cream (replaces #F5F4F0)
          2: '#EDE8DF',        // deeper cream
        },
        sage: {
          DEFAULT: '#7A9B7A',  // muted sage for secondary text
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}

export default config

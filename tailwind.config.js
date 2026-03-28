/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        // Primary - Red (Impostor / danger)
        primary: '#ba0209',
        'primary-bright': '#C51111',
        'primary-container': '#ff7766',
        'primary-dim': '#a40006',
        'on-primary': '#ffefed',
        // Secondary - Blue (Crewmate / action)
        secondary: '#3046e3',
        'secondary-bright': '#132ED1',
        'secondary-container': '#caceff',
        'secondary-dim': '#1f37d7',
        'on-secondary': '#f3f1ff',
        // Tertiary - Yellow (accent / highlight)
        tertiary: '#5f5f00',
        'tertiary-bright': '#F6F657',
        'tertiary-container': '#fefe5e',
        'on-tertiary': '#fafa5a',
        // Surfaces
        surface: '#f3f6ff',
        'surface-bright': '#f3f6ff',
        'surface-dim': '#c6d6ec',
        'surface-lowest': '#ffffff',
        'surface-low': '#e9f1ff',
        'surface-container': '#dde9fc',
        'surface-high': '#d6e4f8',
        'surface-highest': '#cfdef4',
        // Text
        'on-surface': '#262f3b',
        'on-surface-variant': '#525c6a',
        // Errors
        error: '#b41340',
        'error-container': '#f74b6d',
        // Borders
        outline: '#6e7886',
        'outline-variant': '#a4aebd',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      boxShadow: {
        'chunky': '4px 4px 0px 0px #262f3b',
        'chunky-sm': '2px 2px 0px 0px #262f3b',
        'chunky-lg': '6px 6px 0px 0px #262f3b',
        'chunky-red': '4px 4px 0px 0px #ba0209',
        'chunky-blue': '4px 4px 0px 0px #3046e3',
        'float': '0 8px 32px 0 rgba(38,47,59,0.12)',
        'glow-red': '0 0 20px rgba(186,2,9,0.4)',
        'glow-blue': '0 0 20px rgba(48,70,227,0.4)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-6px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(6px)' },
        },
        flashbang: {
          '0%': { backgroundColor: 'rgba(255,255,255,0)' },
          '10%': { backgroundColor: 'rgba(255,255,255,0.95)' },
          '100%': { backgroundColor: 'rgba(255,255,255,0)' },
        },
        pulse_warning: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)', clipPath: 'inset(0 0 100% 0)' },
          '20%': { transform: 'translate(-4px, 2px)', clipPath: 'inset(20% 0 60% 0)' },
          '40%': { transform: 'translate(4px, -2px)', clipPath: 'inset(50% 0 30% 0)' },
          '60%': { transform: 'translate(-2px, 4px)', clipPath: 'inset(10% 0 80% 0)' },
          '80%': { transform: 'translate(2px, 0)', clipPath: 'inset(70% 0 10% 0)' },
          '100%': { transform: 'translate(0)', clipPath: 'inset(0 0 0 0)' },
        },
        float_up: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
      animation: {
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        flashbang: 'flashbang 1.5s ease-out forwards',
        pulse_warning: 'pulse_warning 0.8s ease-in-out infinite',
        glitch: 'glitch 0.4s linear',
        float_up: 'float_up 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

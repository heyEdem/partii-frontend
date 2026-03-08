import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Velvet Design System tokens
        'bg-primary': '#000000',
        'bg-elevated': '#111111',
        'bg-surface': '#1A1A1A',
        'accent-primary': '#9B8EC4',
        'accent-action': '#FF8C42',
        'text-primary': '#FFF8F0',
        'text-secondary': '#A0A0A0',
        success: '#4ADE80',
        warning: '#FACC15',
        error: '#EF4444',
        border: '#2A2A2A',
        // shadcn compatibility
        background: '#000000',
        foreground: '#FFF8F0',
        primary: {
          DEFAULT: '#FF8C42',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFF8F0',
        },
        muted: {
          DEFAULT: '#111111',
          foreground: '#A0A0A0',
        },
        accent: {
          DEFAULT: '#9B8EC4',
          foreground: '#FFF8F0',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#111111',
          foreground: '#FFF8F0',
        },
        popover: {
          DEFAULT: '#111111',
          foreground: '#FFF8F0',
        },
        input: '#2A2A2A',
        ring: '#9B8EC4',
      },
      borderRadius: {
        button: '12px',
        card: '16px',
        modal: '24px',
        avatar: '9999px',
        input: '10px',
        pill: '9999px',
        stat: '12px',
        logo: '12px',
        lg: '12px',
        md: '10px',
        sm: '8px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['18px', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['16px', { lineHeight: '1.2', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-medium': ['15px', { lineHeight: '1.6', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        label: ['11px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.5px' }],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
      maxWidth: {
        content: '1280px',
      },
      backgroundImage: {
        'avatar-gradient': 'linear-gradient(135deg, #9B8EC4, #FF8C42)',
        'logo-gradient': 'linear-gradient(135deg, #9B8EC4, #FF8C42)',
      },
      boxShadow: {
        'orange-glow': '0 4px 20px rgba(255, 140, 66, 0.35)',
        'orange-glow-sm': '0 0 12px rgba(255, 140, 66, 0.4)',
        'lavender-ring': '0 0 0 3px rgba(155, 142, 196, 0.15)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.7' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

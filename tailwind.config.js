/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#024F28',
          pine: '#024F28',
          dark: '#013A1D',
          hover: '#014322',
          light: '#E6EFEA',
          gold: '#E39F00',
          'gold-hover': '#CC8E00',
          'gold-light': '#FFF8EB',
        },
        warm: {
          50: '#FDFBF7',
          100: '#FAF8F3',
          200: '#F4EFEB',
          300: '#EAE3DA',
          400: '#D5CABE',
          500: '#B0A292',
          800: '#3D3833',
          900: '#1C1917',
        },
        charcoal: {
          DEFAULT: '#191817',
          muted: '#63605C',
          light: '#8C8882',
          faint: '#D1CDC7',
        },
        rise: {
          realise: {
            DEFAULT: '#024F28',
            hover: '#013D1F',
            light: '#E6EFEA',
            border: '#B6D6C4',
            accent: '#0B5D34',
          },
          imagine: {
            DEFAULT: '#0D485C',
            hover: '#0A3747',
            light: '#E7F2F5',
            border: '#B5D3DC',
            accent: '#135B73',
          },
          start: {
            DEFAULT: '#A3561A',
            hover: '#824313',
            light: '#FBF3E8',
            border: '#E8CDB5',
            accent: '#E39F00', // Phoszade Gold Accent
          },
          expand: {
            DEFAULT: '#4A2840',
            hover: '#371D2F',
            light: '#F6EDF3',
            border: '#DAC3D3',
            accent: '#6B3B5D',
          },
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'screen-in': 'screenEaseIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'icon-float': 'iconFloat 2s ease-in-out infinite',
      },
      keyframes: {
        screenEaseIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        iconFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-3px) scale(1.08)' },
        },
      }
    },
  },
  plugins: [],
}

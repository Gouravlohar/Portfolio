/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      fontFamily: {
        Outfit: ["Outfit", "sans-serif"],
        Ovo: ["Ovo", "serif"],
        Bamboly: ["'Bamboly Demo'", "Impact", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
        Inter: ["Inter", "sans-serif"]
      },
      animation: {
        'text-slide-2': 'text-slide-2 5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        'text-slide-3': 'text-slide-3 7.5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        'text-slide-4': 'text-slide-4 10s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'beyond-marquee': 'beyond-marquee-scroll 18s linear infinite',
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'translateUp': 'translateUp 0.8s ease-out forwards',
        'translateDown': 'translateDown 2s infinite ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        translateUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        translateDown: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'beyond-marquee-scroll': {
          'to': { transform: 'translateX(-50%)' }
        },
        'text-slide-3': {
          '0%, 26.66%': { transform: 'translateY(0%)' },
          '33.33%, 60%': { transform: 'translateY(-25%)' },
          '66.66%, 93.33%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(-75%)' },
        }
      },
      colors: {
        lightHover: '#fcf4ff',
        darkHover: '#2a004a',
        darkTheme: '#0F0715',
        brandGold: '#a18b3f',
        brandOrange: '#ec612c'
      }
    },
  },
  plugins: [],
}

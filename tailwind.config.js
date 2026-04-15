tailwind.config = {
    theme: {
        extend: {
            gridTemplateColumns: {
                'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
            },
            fontFamily: {
                Outfit: ["Outfit", "sans-serif"],
                Ovo: ["Ovo", "serif"]
            },
            animation: {
                'text-slide-2': 'text-slide-2 5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'text-slide-3': 'text-slide-3 7.5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'text-slide-4': 'text-slide-4 10s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'text-slide-5': 'text-slide-5 12.5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'text-slide-6': 'text-slide-6 15s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'text-slide-7': 'text-slide-7 17.5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'text-slide-8': 'text-slide-8 20s cubic-bezier(0.83, 0, 0.17, 1) infinite',
                'marquee': 'marquee 30s linear infinite',
                'marquee-reverse': 'marquee-reverse 30s linear infinite',
                'fadeIn': 'fadeIn 2s ease-out forwards',
                'translateUp': 'translateUp 1s ease-out forwards',
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
                'text-slide-2': {
                    '0%, 40%': {
                        transform: 'translateY(0%)',
                    },
                    '50%, 90%': {
                        transform: 'translateY(-33.33%)',
                    },
                    '100%': {
                        transform: 'translateY(-66.66%)',
                    },
                },
                'text-slide-3': {
                    '0%, 26.66%': {
                        transform: 'translateY(0%)',
                    },
                    '33.33%, 60%': {
                        transform: 'translateY(-25%)',
                    },
                    '66.66%, 93.33%': {
                        transform: 'translateY(-50%)',
                    },
                    '100%': {
                        transform: 'translateY(-75%)',
                    },
                },
                'text-slide-4': {
                    '0%, 20%': {
                        transform: 'translateY(0%)',
                    },
                    '25%, 45%': {
                        transform: 'translateY(-20%)',
                    },
                    '50%, 70%': {
                        transform: 'translateY(-40%)',
                    },
                    '75%, 95%': {
                        transform: 'translateY(-60%)',
                    },
                    '100%': {
                        transform: 'translateY(-80%)',
                    },
                },
                
            },
            colors: {
                lightHover: '#fcf4ff',
                darkHover: '#2a004a',
                darkTheme: '#0F0715'
            },
            boxShadow: {
                'black': '4px 4px 0 #000',
                'white': '4px 4px 0 #fff',
            }
        }
    },
    darkMode: 'class'
}
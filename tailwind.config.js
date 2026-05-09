/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./packages/studio/src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#d9ff00',
                    hover: '#c4e600',
                },
                accent: {
                    DEFAULT: '#7C3AED',
                    hover: '#6D28D9',
                    light: '#8B5CF6',
                },
                'accent-secondary': '#06B6D4',
                'app-bg': '#050505',
                'panel-bg': '#0a0a0a',
                'card-bg': '#141414',
                secondary: '#a1a1aa',
                muted: '#52525b',
                'dark-surface': '#0A0F1E',
                'dark-card': 'rgba(17, 24, 39, 0.8)',
                'admin-sidebar': '#0D1321',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(217, 255, 0, 0.4)',
                'glow-accent': '0 0 20px rgba(168, 85, 247, 0.4)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.8)',
            }
        },
    },
    plugins: [],
}

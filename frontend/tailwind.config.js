/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom color palette
                navy: {
                    DEFAULT: '#364F6B',
                    light: '#4a6a8a',
                    dark: '#2a3d52',
                    50: '#e8edf2',
                    100: '#d1dbe5',
                },
                teal: {
                    DEFAULT: '#3FC1C9',
                    light: '#5fd4db',
                    dark: '#2fa8af',
                    50: '#e6f7f8',
                    100: '#ccf0f2',
                },
                light: {
                    DEFAULT: '#F5F5F5',
                    50: '#FAFAFA',
                    100: '#EFEFEF',
                },
                coral: {
                    DEFAULT: '#FC5185',
                    light: '#fd7da3',
                    dark: '#e63d6d',
                    50: '#fff0f4',
                    100: '#ffe0e9',
                },
                // Keep success colors for best deal highlighting
                success: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                    light: '#34d399',
                    50: '#ecfdf5',
                },
                // Primary mapped to teal
                primary: {
                    DEFAULT: '#3FC1C9',
                    dark: '#2fa8af',
                    light: '#5fd4db',
                    50: '#e6f7f8',
                    100: '#ccf0f2',
                },
                // Secondary mapped to coral
                secondary: {
                    DEFAULT: '#FC5185',
                    dark: '#e63d6d',
                    light: '#fd7da3',
                },
                // Accent mapped to navy
                accent: {
                    DEFAULT: '#364F6B',
                    dark: '#2a3d52',
                    light: '#4a6a8a',
                    teal: '#3FC1C9',
                },
                // Header gradient colors
                header: {
                    start: '#364F6B',
                    mid: '#3FC1C9',
                    end: '#FC5185',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'gradient': 'gradient 8s ease infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backgroundSize: {
                '300%': '300%',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(63, 193, 201, 0.3)',
                'glow-coral': '0 0 20px rgba(252, 81, 133, 0.3)',
                'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
            }
        },
    },
    plugins: [],
}

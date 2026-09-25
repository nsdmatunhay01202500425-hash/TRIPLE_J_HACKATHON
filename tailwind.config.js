/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        agricon: {
          DEFAULT: '#2E7D32',
          deep: '#173B22',
          light: '#EAF4EB',
          faint: '#F5F9F5',
        },
        bg: '#FAFCFA',
        ink: '#17201A',
        muted: '#6F7971',
        line: '#E3E9E3',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 32, 26, 0.04), 0 1px 1px rgba(23, 32, 26, 0.03)',
      },
      borderRadius: {
        md: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}

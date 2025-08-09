/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#111111',
        'surface-light': '#1A1A1A',
        text: '#FFFFFF',
        muted: '#888888',
        'muted-light': '#AAAAAA',
        link: '#FFFFFF',
        accent: '#FFFFFF',
        border: 'rgba(255,255,255,0.1)',
        'border-light': 'rgba(255,255,255,0.05)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(255,255,255,0.05)',
        'card-hover': '0 8px 30px rgba(255,255,255,0.1)',
        glow: '0 0 20px rgba(255,255,255,0.1)',
      },
      fontFamily: {
        'heading': ['Inter Tight', 'Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

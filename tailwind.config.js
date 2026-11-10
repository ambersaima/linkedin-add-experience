export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Manrope', 'sans-serif'] },
    colors: { linkedin: '#0a66c2', ink: '#1d2226', canvas: '#f3f2ef' },
    boxShadow: { soft: '0 8px 30px rgba(0,0,0,0.06)' }
  }},
  plugins: []
}
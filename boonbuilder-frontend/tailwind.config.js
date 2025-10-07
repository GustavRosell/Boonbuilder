/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hades': {
          'dark': '#0a0a0a',
          'purple': '#7c3aed',
          'gold': '#fbbf24',
          'blue': '#3b82f6',
          'green': '#10b981',
          'red': '#ef4444',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'underworld': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)'
      }
    },
  },
  plugins: [],
}
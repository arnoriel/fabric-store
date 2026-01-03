/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          black: '#0f172a', // Slate 900 base
          gold: '#d4af37',  // Metallic Gold
          cream: '#f5f5f0', // Off-white
          gray: '#334155',  // Slate 700
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Font elegan untuk heading
        sans: ['"Lato"', 'sans-serif'],        // Font bersih untuk body
      }
    },
  },
  plugins: [],
}
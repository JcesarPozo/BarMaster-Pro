/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Esto asegura que los colores de tu App.tsx existan
        slate: {
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}

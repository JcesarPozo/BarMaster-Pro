/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",               // Busca en la raíz (para App.tsx y main.tsx)
    "./components/**/*.{js,ts,jsx,tsx}", // Busca en la carpeta components
    "./src/**/*.{js,ts,jsx,tsx}"         // Por seguridad, por si creas la carpeta luego
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617', // Tu color de fondo
        }
      }
    },
  },
  plugins: [],
}

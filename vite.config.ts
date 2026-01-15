import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // O el plugin que uses (vue, etc)

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // 1. IMPORTANTE: Esto ayuda a que Vercel encuentre los archivos
    base: './', 
    plugins: [react()],
    define: {
      // 2. Esto asegura que las variables estén disponibles
      'process.env': env
    }
  };
});

// geminiService.ts (Prueba temporal)
/*
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
export const askBartender = async (query: string) => { ... };
*/

// Agrega solo esto para que no de error de importación en otros archivos:
export const askBartender = async () => { return { answer: "test" } };
//import { GoogleGenerativeAI } from "@google/generative-ai";
//import { SearchResult } from '../types';

// 1. Configuración de la API Key (Asegúrate de tener VITE_ en tu .env)
//const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error("La clave de API de Gemini no está configurada. Revisa tu archivo .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const askBartender = async (query: string): Promise<SearchResult> => {
  try {
    // 2. Inicializar el modelo (puedes usar gemini-1.5-flash para mayor velocidad)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Realizar la petición
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    // 4. Formatear el resultado según tu interfaz SearchResult
    // Ajusta los campos según lo que necesite tu frontend
    return {
      answer: text,
      status: 'success',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error consultando al bartender AI:", error);
    
    // Lanzamos un error descriptivo
    throw new Error("El bartender está en un descanso. Intenta más tarde.");
  }
};

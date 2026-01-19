import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

export const askBartender = async (query: string): Promise<SearchResult> => {
  // 1. Obtenemos la llave justo cuando se necesita
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("API Key no configurada en Vercel.");
  }

  try {
    // 2. Inicializamos el motor AQUÍ adentro
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. Usamos gemini-1.5-flash que es el más moderno
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Llamada a la IA
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("La IA devolvió una respuesta vacía.");

    return {
      answer: text,
      id: Date.now().toString(),
      title: "Sugerencia del Maestro Mezclador",
    } as SearchResult;

  } catch (error: any) {
    // ESTO ES CLAVE: Vamos a imprimir el error real de Google en la consola
    console.error("ERROR REAL DE GOOGLE:", error);
    
    if (error.message?.includes("404")) {
      throw new Error("Error 404: El modelo no está disponible. Intenta cambiar la región de tu API Key en Google AI Studio.");
    }
    
    throw new Error("El bartender está ocupado. Intenta de nuevo.");
  }
};

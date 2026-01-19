import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;
// AÑADE ESTO PARA DEPURAR
if (!apiKey) {
  console.error("¡ERROR! La API Key no está llegando a la aplicación. Revisa Vercel.");
} else {
  console.log("API Key detectada (empieza por):", apiKey.substring(0, 3));
}

// Si no hay API Key, usamos un string vacío para que la web no se ponga en blanco al cargar,
// pero dará error si intentas preguntar algo.
const genAI = new GoogleGenerativeAI(apiKey || "NO_API_KEY");

export const askBartender = async (query: string): Promise<SearchResult> => {
  // ... (tus console.log de depuración)
  try {
    // Probamos con el nombre técnico exacto
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    return {
      answer: text,
      id: Date.now().toString(),
      title: "Sugerencia del Bartender",
    } as SearchResult;

  } catch (error) {
    console.error("Error detallado en la consulta:", error);
    throw new Error("El bartender no pudo responder. Revisa la consola o la API Key.");
  }
};

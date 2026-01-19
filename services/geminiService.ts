import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;

// Si no hay API Key, usamos un string vacío para que la web no se ponga en blanco al cargar,
// pero dará error si intentas preguntar algo.
const genAI = new GoogleGenerativeAI(apiKey || "NO_API_KEY");

export const askBartender = async (query: string): Promise<SearchResult> => {
  console.log("DEBUG: Usando modelo gemini-pro..."); // <--- AÑADE ESTO
  try {
    // 3. Configuramos el modelo (Gemini 1.5 Flash es el más rápido para apps web)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 4. Enviamos la pregunta a la IA
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    // 5. Retornamos el objeto exacto que espera tu aplicación
    // Ajusta los campos según lo que necesite tu componente (id, title, etc.)
    return {
      answer: text,
      id: Date.now().toString(),
      title: "Sugerencia del Bartender",
      // Si tu tipo SearchResult tiene otros campos obligatorios, añádelos aquí
    } as SearchResult;

  } catch (error) {
    console.error("Error detallado en la consulta:", error);
    throw new Error("El bartender no pudo responder. Revisa la consola o la API Key.");
  }
};

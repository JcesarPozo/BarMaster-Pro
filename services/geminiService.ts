import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

// 1. Obtenemos la clave de las variables de entorno de Vite
const apiKey = import.meta.env.VITE_API_KEY;

// 2. Inicializamos la conexión con Google
// Usamos "as any" o una validación simple para que no de error si la clave falta al inicio
const genAI = new GoogleGenerativeAI(apiKey || "");

export const askBartender = async (query: string): Promise<SearchResult> => {
  try {
    // 3. Configuramos el modelo (Gemini 1.5 Flash es el más rápido para apps web)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

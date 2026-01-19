import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

export const askBartender = async (query: string): Promise<SearchResult> => {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("API Key no configurada.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // CAMBIO CLAVE: Usamos la versión 2.0 que es la que ves en tu panel
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    return {
      answer: text,
      id: Date.now().toString(),
      title: "Sugerencia de Gemini 2.0",
    } as SearchResult;

  } catch (error: any) {
    console.error("ERROR CON GEMINI 2.0:", error);
    throw new Error("El bartender está actualizando sus recetas. Intenta de nuevo.");
  }
};

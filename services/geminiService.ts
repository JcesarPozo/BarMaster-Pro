import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

export const askBartender = async (query: string): Promise<SearchResult> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("Falta API KEY");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Usamos gemini-2.0-flash que es el estándar actual en AI Studio
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    // AQUÍ ESTÁ EL TRUCO: 
    // Creamos un objeto que tenga TODO lo que tu interfaz podría buscar
    // para que nunca dé "undefined".
    return {
      answer: text,
      id: Date.now().toString(),
      title: "Respuesta del Maestro Mezclador",
      sources: [], // Añadimos esto vacío para que l.sources no falle
      links: []    // Añadimos esto por si acaso
    } as any; // Usamos 'as any' temporalmente para saltar bloqueos de tipos

  } catch (error: any) {
    console.error("Error en servicio:", error);
    throw error;
  }
};

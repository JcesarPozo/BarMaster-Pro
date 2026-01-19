import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

export const askBartender = async (query: string): Promise<SearchResult> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("Falta API KEY");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    // Importante: devolvemos un objeto totalmente nuevo
    return {
      // Este ID aleatorio obliga a React a renderizar de nuevo
      id: Math.random().toString(36).substring(7),
      answer: text,
      title: `Resultado para: ${query}`, // Esto cambia con cada pregunta
      sources: [],
      links: []
    } as any;

  } catch (error: any) {
    console.error("Error en servicio:", error);
    throw error;
  }
};

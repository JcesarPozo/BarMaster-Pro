import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchResult } from '../types';

export const askBartender = async (query: string): Promise<SearchResult> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("Falta API KEY");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    console.log("Respuesta de la IA recibida:", text);

    // Devolvemos un objeto con todos los nombres posibles 
    // para que la interfaz encuentre lo que busca
    return {
      id: Date.now().toString(),
      answer: text,      // Algunos componentes buscan 'answer'
      response: text,    // Otros buscan 'response'
      content: text,     // Otros buscan 'content'
      text: text,        // Otros buscan 'text'
      title: "Sugerencia del Maestro",
      sources: [],
      links: []
    } as any;

  } catch (error: any) {
    console.error("Error en servicio:", error);
    throw error;
  }
};

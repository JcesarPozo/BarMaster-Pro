import { GoogleGenAI } from "@google/genai";
import { SearchResult } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const askBartender = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un bartender experto y carismático con décadas de experiencia. 
      Responde a la siguiente consulta del usuario sobre coctelería, historia de licores o tendencias actuales.
      Usa un tono profesional pero educativo, como si estuvieras enseñando a un aprendiz.
      Si la pregunta es sobre tendencias o noticias, usa la información de Google Search proporcionada.
      
      Consulta: "${query}"`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Lo siento, la barra está muy ocupada y no pude escuchar bien. ¿Podrías repetir?";
    
    // Extract grounding chunks for sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values()) as { title: string; uri: string }[];

    return {
      text,
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Error consultando al bartender AI:", error);
    throw new Error("El bartender está en un descanso. Intenta más tarde.");
  }
};

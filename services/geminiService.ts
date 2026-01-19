import { GoogleGenerativeAI } from "@google/generative-ai";

export const askBartender = async (query: string) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.error("Falta la API Key en las variables de entorno");
    throw new Error("Configuración incompleta");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Usamos el nombre más estándar para evitar el 404
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Enviando pregunta a Gemini:", query);

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    console.log("Respuesta recibida correctamente");

    // Retornamos un objeto limpio y con ID único garantizado
    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      answer: text,
      title: "Sugerencia del Bartender",
      sources: [],
      links: []
    };

  } catch (error) {
    console.error("Error detallado en el servicio:", error);
    throw error;
  }
};

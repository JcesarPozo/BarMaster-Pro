import { SearchResult } from '../types';

export const askBartender = async (query: string): Promise<SearchResult> => {
  if (!query || !query.trim()) {
    throw new Error('Por favor escribe tu consulta para el bartender.');
  }

  try {
    const response = await fetch('/api/bartender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query.trim() }),
    });

    if (!response.ok) {
      let errorMessage = `Error en el servidor (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback to response statusText if JSON parsing fails
        if (response.statusText) {
          errorMessage = response.statusText;
        }
      }
      throw new Error(errorMessage);
    }

    const data: SearchResult = await response.json();
    return {
      text: data.text || 'No se recibió respuesta del maestro.',
      sources: data.sources || [],
      cocktail: data.cocktail || null,
      cached: data.cached,
    };
  } catch (error: any) {
    console.error('Error consultando al bartender AI:', error);
    throw new Error(error.message || 'El maestro bartender está atendiendo otra mesa. Por favor, intenta de nuevo en un momento.');
  }
};

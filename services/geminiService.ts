import { SearchResult } from '../types';

export const askBartender = async (query: string, signal?: AbortSignal): Promise<SearchResult> => {
  if (!query || !query.trim()) {
    throw new Error('Por favor escribe tu consulta para el bartender.');
  }

  // Create an internal timeout controller if caller didn't provide an abort signal
  const timeoutMs = 25000;
  const internalController = new AbortController();
  const timeoutId = setTimeout(() => {
    internalController.abort(new Error('TIMEOUT'));
  }, timeoutMs);

  // Link caller signal if provided
  if (signal) {
    signal.addEventListener('abort', () => {
      internalController.abort(signal.reason);
    });
  }

  try {
    const response = await fetch('/api/bartender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query.trim() }),
      signal: internalController.signal,
    });

    clearTimeout(timeoutId);

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
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError' || error?.message === 'TIMEOUT' || internalController.signal.aborted) {
      if (error?.message === 'TIMEOUT') {
        throw new Error('El maestro tardó más de lo esperado en responder. Por favor reintenta o haz una nueva pregunta.');
      }
      throw new Error('Consulta cancelada.');
    }
    console.error('Error consultando al bartender AI:', error);
    throw new Error(error.message || 'El maestro bartender está atendiendo otra mesa. Por favor, intenta de nuevo en un momento.');
  }
};

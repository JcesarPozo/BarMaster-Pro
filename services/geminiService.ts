import { SearchResult } from '../types';
import { getCuratedCocktailResponse } from './cocktailKnowledge';
import { detectAndResolveCocktail } from './cocktailImageResolver';

export const askBartender = async (query: string, signal?: AbortSignal): Promise<SearchResult> => {
  const trimmed = query?.trim();
  if (!trimmed) {
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
      body: JSON.stringify({ query: trimmed }),
      signal: internalController.signal,
    });

    clearTimeout(timeoutId);

    // If server responds with 404 (e.g. Vercel serverless function not active or routing misconfiguration)
    if (response.status === 404) {
      console.warn('Endpoint /api/bartender retornó 404. Activando motor mixológico de contingencia en cliente.');
      return await fallbackClientBartender(trimmed);
    }

    if (!response.ok) {
      let errorMessage = `Error en el servidor (${response.status})`;
      try {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          if (response.statusText) {
            errorMessage = response.statusText;
          }
        }
      } catch {
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

    console.warn('Error al contactar el backend, intentando motor local:', error);

    // If it was a network error or fetch failure, execute client fallback
    try {
      return await fallbackClientBartender(trimmed);
    } catch {
      throw new Error(error.message || 'El maestro bartender está atendiendo otra mesa. Por favor, intenta de nuevo en un momento.');
    }
  }
};

/**
 * Resilient client-side fallback bartender: guarantees the user never gets blocked by a 404
 */
async function fallbackClientBartender(query: string): Promise<SearchResult> {
  const curated = getCuratedCocktailResponse(query);
  let text = '';

  if (curated) {
    text = curated + '\n\n*(Nota de servicio: Respuesta servida directamente por el catálogo maestro de coctelería. Para activar respuestas libres generadas en tiempo real por IA en Vercel, recuerda añadir la variable GEMINI_API_KEY en Vercel > Settings > Environment Variables y hacer Redeploy).*';
  } else {
    text = `¡Bienvenido a la barra de **BarMaster Pro**!

Hemos detectado que el endpoint de Inteligencia Artificial en Vercel respondió con un código 404 (Servicio no encontrado).

### ¿Cómo activar el Bartender IA en Vercel con tu API Key?
1. **Verifica la clave API**: En tu panel de **Vercel** ([vercel.com](https://vercel.com)), ingresa a tu proyecto y dirígete a **Settings** > **Environment Variables**.
2. **Añade la variable**: Crea la variable con el nombre exacto **\`GEMINI_API_KEY\`** e introduce tu clave gratuita obtenida de Google AI Studio.
3. **Asegúrate de marcar los entornos**: *Production*, *Preview* y *Development*.
4. **Haz Redeploy**: En la pestaña **Deployments**, haz clic en los tres puntos (...) del último commit y selecciona **Redeploy** para aplicar el archivo \`vercel.json\` actualizado.

---

### Mientras tanto, te invitamos a consultar nuestros cócteles estrella:
* **Old Fashioned:** Bourbon, Angostura Bitters y terrón de azúcar con piel de naranja.
* **Negroni:** 1:1:1 de Ginebra London Dry, Campari y Vermouth Rosso.
* **Daiquiri Clásico:** Ron blanco carta blanca, zumo fresco de lima y jarabe simple.
* **Dry Martini:** Ginebra y vermouth seco con aceituna sevillana.
* **Margarita:** Tequila 100% agave azul, licor de naranja y zumo de lima recién exprimido.`;
  }

  const detectedCocktail = await detectAndResolveCocktail(query, text);
  return {
    text,
    sources: [],
    cocktail: detectedCocktail,
    cached: false,
  };
}

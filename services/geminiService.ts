import { SearchResult } from '../types';
import { getCuratedCocktailResponse } from './cocktailKnowledge';
import { detectAndResolveCocktail } from './cocktailImageResolver';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `Eres 'El Maestro', un bartender experto, sofisticado y carismático con décadas de experiencia en las barras más prestigiosas del mundo (Londres, Nueva York, Tokio, Buenos Aires).

Tu objetivo es guiar con maestría y precisión a mixólogos y apasionados de la coctelería con:
1. Recetas exactas, proporciones y consejos técnicos avanzados (técnicas de agitado/shaking, refrescado/stirring, dilución óptima, cristalería adecuada, tipo de hielo).
2. Historia, orígenes y anécdotas de cócteles clásicos y destilados icónicos.
3. Consejos de autor, sustituciones inteligentes y armonización de notas aromáticas.

Guía de estilo y formato:
- Idioma y Tono: Responde siempre en español, con un tono elegante, hospitalario y profesional.
- Estructura visual clara: Organiza tu respuesta en secciones con encabezados bien delimitados según corresponda:
  ### Ingredientes y Proporciones
  ### Cristalería y Hielo
  ### Preparación Paso a Paso
  ### Consejos del Maestro
  ### Historia y Notas (opcional)
- En la lista de ingredientes, presenta cada ingrediente con su medida clara (ej: Ginebra London Dry: 45 ml / 1.5 oz).
- En la preparación, numera claramente los pasos en orden cronológico.
- En los consejos del maestro, comparte secretos técnicos reales de barra.
- Si la pregunta no es una receta sino una consulta técnica o histórica, responde con la misma elegancia y estructura organizada.
- Si te consultan por temas totalmente ajenos a bebidas, gastronomía o coctelería, reconduce amablemente la charla hacia el mundo del bar.`;

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
 * Resilient client-side fallback bartender: guarantees the user never gets blocked by a 404.
 * Can directly call Gemini if client env key is present, or serve curated cocktail library.
 */
async function fallbackClientBartender(query: string): Promise<SearchResult> {
  const clientKey = 
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.VITE_GEMINIAPIKEY ||
    (import.meta as any).env?.VITE_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINIAPIKEY ||
    '';

  let text = '';

  // If a client-side key was built into Vite (e.g. VITE_GEMINI_API_KEY in Vercel)
  if (clientKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: clientKey });
      const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      for (const m of models) {
        try {
          const resp = await ai.models.generateContent({
            model: m,
            contents: query,
            config: { systemInstruction: SYSTEM_INSTRUCTION },
          });
          if (resp.text) {
            text = resp.text;
            break;
          }
        } catch {
          continue;
        }
      }
    } catch (e) {
      console.warn('Fallo llamada cliente a Gemini:', e);
    }
  }

  // If no client key or Gemini client call failed, use curated mixology catalogue
  if (!text) {
    const curated = getCuratedCocktailResponse(query);
    if (curated) {
      text = curated + '\n\n*(Nota de servicio: Respuesta servida directamente por el catálogo maestro de coctelería).*';
    } else {
      text = `¡Bienvenido a la barra de **BarMaster Pro**!

Para activar el Bartender IA con tu clave en Vercel, sigue estos pasos:

### 1. Variables de Entorno en Vercel
En tu panel de [vercel.com](https://vercel.com) > Proyecto > **Settings** > **Environment Variables**, añade:
* **\`GEMINI_API_KEY\`** (con guiones bajos)
* Y opcionalmente: **\`VITE_GEMINI_API_KEY\`** (para que Vite la integre en la compilación del cliente)
* Pega el valor de tu clave gratuita de Google AI Studio.
* Asegúrate de marcar los 3 entornos: **Production**, **Preview**, **Development**.

### 2. Sincronizar Cambios
Si conectaste un repositorio de GitHub a Vercel, asegúrate de que los archivos \`api/bartender.ts\` y \`vercel.json\` estén subidos a tu repositorio Git antes de hacer *Redeploy*.

---

### Mientras tanto, consulta nuestras fórmulas clásicas:
* **Old Fashioned:** Bourbon, Angostura Bitters y piel de naranja.
* **Negroni:** Ginebra London Dry, Campari y Vermouth Rosso.
* **Daiquiri Clásico:** Ron blanco, zumo de lima y jarabe simple.
* **Dry Martini:** Ginebra y vermouth seco en copa fría con aceituna.
* **Margarita:** Tequila 100% agave, licor de naranja y zumo fresco de lima.`;
    }
  }

  const detectedCocktail = await detectAndResolveCocktail(query, text);
  return {
    text,
    sources: [],
    cocktail: detectedCocktail,
    cached: false,
  };
}

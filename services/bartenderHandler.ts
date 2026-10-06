import { GoogleGenAI } from '@google/genai';
import { getCuratedCocktailResponse } from './cocktailKnowledge';
import { detectAndResolveCocktail } from './cocktailImageResolver';
import { DetectedCocktail } from '../types';

// In-memory query cache to reduce redundant API calls and prevent quota exhaustion
const queryCache = new Map<string, { text: string; cocktail: DetectedCocktail | null }>();

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

export interface BartenderResult {
  text: string;
  sources: string[];
  cocktail: DetectedCocktail | null;
  cached?: boolean;
  missingApiKey?: boolean;
}

export async function handleBartenderQuery(query: string): Promise<BartenderResult> {
  const trimmedQuery = query?.trim() || '';
  if (!trimmedQuery) {
    throw new Error('La consulta no puede estar vacía.');
  }

  const cacheKey = trimmedQuery.toLowerCase();

  // Check cache first
  if (queryCache.has(cacheKey)) {
    const cached = queryCache.get(cacheKey)!;
    return {
      text: cached.text,
      sources: [],
      cocktail: cached.cocktail,
      cached: true,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  // Case 1: No API key configured in environment (common when first deployed to Vercel)
  if (!apiKey) {
    const curated = getCuratedCocktailResponse(trimmedQuery);
    let text = '';
    
    if (curated) {
      text = curated + '\n\n*(Nota técnica de despliegue en Vercel: La clave GEMINI_API_KEY no está configurada en las Variables de Entorno del proyecto. Se ha servido la receta desde el recetario maestro interno. Para activar la generación libre con IA, añade GEMINI_API_KEY en Vercel > Settings > Environment Variables).*';
    } else {
      text = `¡Bienvenido a la barra de BarMaster Pro!

Para activar el motor de Inteligencia Artificial del Maestro Bartender en tu despliegue de Vercel, es necesario configurar la variable de entorno:

1. Ingresa a tu panel de **Vercel** (vercel.com).
2. Selecciona tu proyecto y ve a **Settings** > **Environment Variables**.
3. Añade la variable con el nombre **\`GEMINI_API_KEY\`** y pega tu API Key gratuita de Google AI Studio.
4. Realiza un *Redeploy* para aplicar los cambios.

---

### Mientras tanto, te sugiero explorar nuestras fórmulas clásicas de la carta:
* **Old Fashioned:** El estándar de oro con Bourbon, Angostura y piel de naranja.
* **Negroni:** Proporción perfecta 1:1:1 con Ginebra, Campari y Vermouth rojo.
* **Daiquiri Clásico:** Ron blanco cubano, zumo fresco de lima y jarabe simple.
* **Dry Martini:** Ginebra London Dry con un beso de vermouth seco y aceituna.
* **Margarita Clásica:** Tequila 100% agave, triple sec y jugo de lima en copa escarchada.`;
    }

    const detectedCocktail = await detectAndResolveCocktail(trimmedQuery, text);
    return {
      text,
      sources: [],
      cocktail: detectedCocktail,
      missingApiKey: true,
    };
  }

  // Case 2: API key is present -> Call Google Gemini
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let text = '';

  const generateWithTimeout = async (model: string, queryStr: string, timeoutMs = 25000) => {
    return Promise.race([
      ai.models.generateContent({
        model,
        contents: queryStr,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('UPSTREAM_TIMEOUT')), timeoutMs)
      ),
    ]);
  };

  for (const model of modelsToTry) {
    try {
      const response = await generateWithTimeout(model, trimmedQuery, 25000);
      if (response.text) {
        text = response.text;
        break;
      }
    } catch {
      // Try next fallback model
      continue;
    }
  }

  // If AI was unreachable or timeout, fallback to curated library
  if (!text) {
    const curated = getCuratedCocktailResponse(trimmedQuery);
    if (curated) {
      text = curated;
    } else {
      text = `Acérquese a la barra, mi estimado. En este instante el Maestro se encuentra concurrido atendiendo un servicio de alta demanda.

Le sugiero consultar alguna de nuestras recetas de la carta clásica:
* **Old Fashioned:** El abuelo de los cócteles a base de Bourbon o Rye.
* **Negroni:** El balance entre Ginebra, Campari y Vermouth.
* **Daiquiri Clásico:** Pureza total con Ron blanco, lima y jarabe simple.
* **Dry Martini:** La máxima sobriedad en copa fría.
* **Tequila vs Mezcal:** Descubra los secretos del destilado de agave.

*Consejo del Maestro:* Realice nuevamente su consulta en unos instantes mientras preparamos la siguiente ronda.`;
    }
  }

  const detectedCocktail = await detectAndResolveCocktail(trimmedQuery, text);

  // Cache successful responses
  if (text && !text.includes('alta demanda') && !text.includes('concurrido')) {
    if (queryCache.size > 100) {
      const firstKey = queryCache.keys().next().value;
      if (firstKey) queryCache.delete(firstKey);
    }
    queryCache.set(cacheKey, { text, cocktail: detectedCocktail });
  }

  return {
    text,
    sources: [],
    cocktail: detectedCocktail,
  };
}

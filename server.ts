import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { getCuratedCocktailResponse } from './services/cocktailKnowledge.ts';
import { detectAndResolveCocktail } from './services/cocktailImageResolver.ts';
import { DetectedCocktail } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));

  // In-memory query cache to reduce redundant API calls and prevent quota exhaustion
  const queryCache = new Map<string, { text: string; cocktail: DetectedCocktail | null }>();

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

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

  // Endpoint para consultar al Maestro Bartender
  app.post('/api/bartender', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        res.status(400).json({ error: 'La consulta no puede estar vacía.' });
        return;
      }

      const trimmedQuery = query.trim();
      const cacheKey = trimmedQuery.toLowerCase();

      // Check cache first to preserve API quota
      if (queryCache.has(cacheKey)) {
        const cached = queryCache.get(cacheKey)!;
        res.json({
          text: cached.text,
          sources: [],
          cocktail: cached.cocktail,
          cached: true,
        });
        return;
      }

      // Prioritize gemini-3.1-flash-lite for active quota, then other models
      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
      let text = '';
      let lastError: any = null;

      for (const model of modelsToTry) {
        // Try up to 2 attempts for transient 503 spikes
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: trimmedQuery,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
              },
            });

            if (response.text) {
              text = response.text;
              break;
            }
          } catch (err: any) {
            lastError = err;
            const isTransient = err.status === 503 || (err.message && err.message.includes('high demand'));
            if (isTransient && attempt === 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              continue;
            }
            // For quota exhaustion (429), break immediately to try next model
            break;
          }
        }

        if (text) break;
      }

      // If AI models were unreachable or quota exhausted, consult curated database
      if (!text) {
        const curated = getCuratedCocktailResponse(trimmedQuery);
        if (curated) {
          text = curated;
        } else {
          // Graceful mixology guidance when upstream capacity is temporarily saturated
          text = `Acérquese a la barra, mi estimado. En este instante el Maestro se encuentra concurrido atendiendo un servicio de alta demanda.

Le sugiero consultar alguna de nuestras recetas de la carta clásica:
*   **Old Fashioned:** El abuelo de los cócteles a base de Bourbon o Rye.
*   **Negroni:** El balance entre Ginebra, Campari y Vermouth.
*   **Daiquiri Clásico:** Pureza total con Ron blanco, lima y jarabe simple.
*   **Dry Martini:** La máxima sobriedad en copa fría.
*   **Tequila vs Mezcal:** Descubra los secretos del destilado de agave.

*Consejo del Maestro:* Realice nuevamente su consulta en unos instantes mientras preparamos la siguiente ronda.`;
        }
      }

      // Detect if elaborating a cocktail and resolve its image
      const detectedCocktail = await detectAndResolveCocktail(trimmedQuery, text);

      // Cache successful response (up to 100 entries)
      if (queryCache.size > 100) {
        const firstKey = queryCache.keys().next().value;
        if (firstKey) queryCache.delete(firstKey);
      }
      queryCache.set(cacheKey, { text, cocktail: detectedCocktail });

      res.json({
        text,
        sources: [],
        cocktail: detectedCocktail,
      });
    } catch (err: any) {
      console.error('Error in /api/bartender:', err);
      const fallback = getCuratedCocktailResponse(req.body?.query || '');
      if (fallback) {
        const detectedCocktail = await detectAndResolveCocktail(req.body?.query || '', fallback);
        res.json({ text: fallback, sources: [], cocktail: detectedCocktail });
        return;
      }

      res.status(503).json({ 
        error: 'El servicio está experimentando alta demanda. Por favor, reintenta en unos instantes.' 
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BarMaster server running on http://localhost:${port}`);
  });
}

startServer();

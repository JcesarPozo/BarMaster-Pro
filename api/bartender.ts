import { handleBartenderQuery } from '../services/bartenderHandler';

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido. Se requiere POST.' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // body remains unchanged
      }
    }

    const query = body?.query;
    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'La consulta no puede estar vacía.' });
      return;
    }

    const result = await handleBartenderQuery(query);
    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error en /api/bartender (Vercel):', err);
    res.status(500).json({
      error: 'Error al procesar la consulta con el Maestro Bartender.',
      message: err?.message || 'Error interno',
    });
  }
}

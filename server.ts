import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleBartenderQuery } from './services/bartenderHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));

  // Endpoint para consultar al Maestro Bartender
  app.post('/api/bartender', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        res.status(400).json({ error: 'La consulta no puede estar vacía.' });
        return;
      }

      const result = await handleBartenderQuery(query);
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/bartender:', err);
      res.status(500).json({ 
        error: 'El servicio está experimentando alta demanda. Por favor, reintenta en unos instantes.',
        details: err?.message 
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

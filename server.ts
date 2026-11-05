import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { processChatRequest, formatErrorMessage, MODEL_INFO } from './api/_gemini';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

console.log(
  'Server initialized. GEMINI_API_KEY present:',
  Boolean(process.env.GEMINI_API_KEY),
  'length:',
  (process.env.GEMINI_API_KEY || '').length
);

app.get('/api/model-info', (_req, res) => {
  res.json(MODEL_INFO);
});

app.post('/api/chat', async (req, res) => {
  const reqStart = Date.now();
  console.log('Received /api/chat request at', new Date().toISOString());
  try {
    const data = await processChatRequest(req.body || {});
    console.log(`Gemini responded via ${data.modelUsed} in`, Date.now() - reqStart, 'ms');
    return res.json(data);
  } catch (error: any) {
    console.error('Error generating chat response in server.ts:', error);
    const errorMessage = formatErrorMessage(error);
    return res.status(500).json({ error: errorMessage });
  }
});

// Single refine/fill-bracket endpoint to make direct edits or auto-replace placeholders
app.post('/api/fill-placeholder', async (req, res) => {
  try {
    const { draft, placeholder, replacement } = req.body;
    if (!draft || !placeholder) {
      return res.status(400).json({ error: 'Draft and placeholder are required.' });
    }

    const updated = draft.split(placeholder).join(replacement);
    return res.json({ updatedDraft: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Error updating draft' });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { processChatRequest, formatErrorMessage } from './_gemini.js';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.status(400).json({ error: 'Invalid JSON request body.' });
        return;
      }
    }

    const data = await processChatRequest(body || {});
    res.status(200).json(data);
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    const formattedError = formatErrorMessage(error);
    res.status(500).json({ error: formattedError });
  }
}

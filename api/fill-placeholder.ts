export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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
        res.status(400).json({ error: 'Invalid JSON body.' });
        return;
      }
    }

    const { draft, placeholder, replacement } = body || {};
    if (!draft || !placeholder) {
      res.status(400).json({ error: 'Draft and placeholder are required.' });
      return;
    }

    const updated = draft.split(placeholder).join(replacement);
    res.status(200).json({ updatedDraft: updated });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Error filling placeholder.' });
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // Parse body manually (Vercel fix)
    const body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data || '{}'));
        } catch {
          resolve({});
        }
      });
    });

    const { number } = body;

    if (!number) {
      return res.status(400).json({ error: 'Number is required' });
    }

    // Forward request to external API
    const response = await fetch(
      `https://fam-official.serv00.net/api/database.php?number=${number}`
    );

    const data = await response.text();

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}

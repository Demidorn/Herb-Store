export default async function handler(req, res) {
  const { method, query, body } = req;
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';
  
  // Reconstruct path (e.g., /api/proxy/herbs -> /api/herbs)
  const path = Array.isArray(query.slug) ? query.slug.join('/') : query.slug || '';
  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(query).filter(([key]) => key !== 'slug'))
  ).toString();

  const targetUrl = `${backendUrl}/api/${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;

    const response = await fetch(targetUrl, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });

    const data = await response.text();
    res.status(response.status);
    
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
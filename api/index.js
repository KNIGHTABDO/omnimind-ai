import server from '../dist/server/server.js';

export default async function (req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    // Create a Web API Request object from the Node.js request
    const request = new Request(url.href, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      // @ts-ignore
      duplex: 'half'
    });

    // Call the TanStack Start server handler
    const response = await server.fetch(request);

    // Send the response back to Vercel
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = Buffer.from(await response.arrayBuffer());
    res.end(body);
  } catch (error) {
    console.error('Vercel Bridge Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

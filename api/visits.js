module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.COUNTERAPI_TOKEN;
  if (!token) {
    response.status(500).json({ error: 'CounterAPI token is not configured' });
    return;
  }

  const counterUrl = 'https://api.counterapi.dev/v2/niun-istasipals-team-6223/first-counter-6223/up';
  const counterResponse = await fetch(counterUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await counterResponse.text();
  response.status(counterResponse.status).setHeader('Content-Type', 'application/json').send(body);
};

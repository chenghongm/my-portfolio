export default async function handler(req, res) {
  // 1. 验证请求方法 —— 先校验方法，避免在非 POST 请求上访问 req.body
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Turnstile 验证 —— siteverify 需要 application/x-www-form-urlencoded，
  //    并且必须传入非空的 response，否则 Cloudflare 会返回 400。
  const turnstileToken = req.body?.turnstile_token;
  if (!turnstileToken) {
    return res.status(400).json({ error: 'Missing Turnstile token' });
  }
  if (!process.env.TURNSTILE_SECRET) {
    return res.status(500).json({ error: 'Turnstile secret not configured' });
  }

  const verifyParams = new URLSearchParams();
  verifyParams.append('secret', process.env.TURNSTILE_SECRET);
  verifyParams.append('response', turnstileToken);
  const remoteip = (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    ''
  ).toString().split(',')[0].trim();
  if (remoteip) verifyParams.append('remoteip', remoteip);

  const verify = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verifyParams.toString(),
    }
  );
  const result = await verify.json();
  if (!result.success) {
    return res.status(403).json({
      error: 'Turnstile verification failed',
      codes: result['error-codes'],
    });
  }

  const { system, messages, model } = req.body;
  const apiKey = process.env.ASSISTANT_ID; // Using ASSISTANT_ID for Claude

  if (!apiKey) {
    return res.status(500).json({ error: 'Claude API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-5', // or your preferred model
        max_tokens: 2048,
        system: system || '',
        messages: messages || [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Claude API error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const PROMPT_CHAR_LIMIT = 300;

function getPromptCharacterCount(messages = []) {
  return messages.reduce((total, message) => {
    return total + (typeof message?.content === 'string' ? message.content.length : 0);
  }, 0);
}

export default async function handler(req, res) {
  // 1. 验证请求方法
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages payload is required' });
  }

  if (getPromptCharacterCount(messages) > PROMPT_CHAR_LIMIT) {
    return res.status(400).json({ error: `Prompt limit is ${PROMPT_CHAR_LIMIT} characters per request` });
  }

  // Turnstile 验证
  const verify = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET,
        response: req.body.turnstile_token,
      }),
    }
  );
  const result = await verify.json();
  // console.log("Turnstile result - gemini:", JSON.stringify(result));
  if (!result.success) {
    return res.status(403).json({ error: "Bot detected" });
  }

  const apiKey = process.env.ASSISTANT_GEMINI_ID;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // 1. Adapt messages for Gemini format
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // 2. Construct Gemini payload
    const geminiPayload = {
      contents: geminiMessages,
      system_instruction: {
        parts: [{ text: system || '' }]
      },
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1,
      }
    };

    // 3. Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    const geminiData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: geminiData.error?.message || 'Gemini API error' });
    }

    // 4. Extract text and format as "Claude-like" response for the frontend
    const answerText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({
      content: [
        {
          type: "text",
          text: answerText
        }
      ],
      id: geminiData.responseId || "gen_id",
      model: "gemini-flash-latest",
      role: "assistant"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

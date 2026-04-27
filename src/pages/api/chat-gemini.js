export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages } = req.body;
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

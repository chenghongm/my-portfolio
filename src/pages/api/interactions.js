import { insertPortfolioLog } from "../../lib/portfolio-log-storage";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    await insertPortfolioLog("user_ai_interactions", "/interactions", {
      user_prompt: body.user_prompt,
      ai_model: body.ai_model,
      ai_output: body.ai_output,
      user_remote_addr: req.headers["x-forwarded-for"]?.split(",")[0].trim()
                        ?? req.headers["cf-connecting-ip"]
                        ?? null
    });

    return res.status(200).json({ ok: true });
  } catch {
    console.error("[log/interactions] Failed to write event");
    return res.status(500).json({ error: "Failed to write event" });
  }
}

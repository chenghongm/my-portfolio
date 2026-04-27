import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.mybase_SUPABASE_URL,
  process.env.mybase_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    const { data, error } = await supabase.from("user_ai_interactions").insert({
      user_prompt: body.user_prompt,
      ai_model: body.ai_model,
      ai_output: body.ai_output,
      user_remote_addr: req.headers["x-forwarded-for"]?.split(",")[0].trim()
                        ?? req.headers["cf-connecting-ip"]
                        ?? null,
      user_agent: req.headers["user-agent"] ?? null,
    });

    if (error) {
      console.error("[log/interaction] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[log/interaction] Runtime error:", e);
    return res.status(500).json({ error: e.message || "Failed to log interaction" });
  }
}

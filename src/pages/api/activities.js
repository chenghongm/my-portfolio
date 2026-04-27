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

    const { data, error } = await supabase.from("user_activities").insert({
      user_forward_ip: req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? null,
      user_remote_ip: req.headers["cf-connecting-ip"] ?? null,
      header_language: req.headers["accept-language"] ?? null,
      from_page: body.from_page ?? null,
      section_id: body.section_id ?? null,
      event: body.event ?? null,
      start_at: body.start_at ? new Date(body.start_at) : null,
      end_at: body.end_at ? new Date(body.end_at) : null,
      user_agent: req.headers["user-agent"] ?? null,
    });

    if (error) {
      console.error("[log/activity] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[log/activity] Runtime error:", e);
    return res.status(500).json({ error: e.message || "Failed to log activity" });
  }
}

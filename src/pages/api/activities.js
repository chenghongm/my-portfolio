import { insertPortfolioLog } from "../../lib/portfolio-log-storage";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    await insertPortfolioLog("user_activities", "/activities", {
      user_forward_ip: req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? null,
      user_remote_ip: req.headers["cf-connecting-ip"] ?? null,
      header_language: req.headers["accept-language"] ?? null,
      from_page: body.from_page ?? null,
      section_id: body.section_id ?? null,
      event: body.event ?? null,
      start_at: body.start_at ? new Date(body.start_at) : null,
      user_agent: req.headers["user-agent"] ?? null,
    });

    return res.status(200).json({ ok: true });
  } catch {
    console.error("[log/activities] Failed to write event");
    return res.status(500).json({ error: "Failed to write event" });
  }
}

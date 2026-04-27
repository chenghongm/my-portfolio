import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("user_activities").insert({
      user_forward_ip:  req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                        ?? null,
      user_remote_ip:   req.headers.get("cf-connecting-ip") ?? null,
      header_language:   req.headers.get("accept-language") ?? null,
      from_page:       body.from_page ?? null,
      section_id:       body.section_id ?? null,
      event:          body.event ?? null,
      start_at:       body.start_at ? new Date(body.start_at) : null,
      end_at:         body.end_at ? new Date(body.end_at) : null,
      user_agent:     req.headers.get("user-agent") ?? null,
    });

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (e) {
    console.error("[log/activity]", e);
    return Response.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
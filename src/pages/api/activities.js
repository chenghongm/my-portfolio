import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.mybase_SUPABASE_URL,
    process.env.mybase_SUPABASE_SERVICE_ROLE_KEY
);

export default async function POST(req) {

    try {
        const body = await req.json();

        const { data,error } = await supabase.from("user_activities").insert({
            user_forward_ip: req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                ?? null,
            user_remote_ip: req.headers.get("cf-connecting-ip") ?? null,
            header_language: req.headers.get("accept-language") ?? null,
            from_page: body.from_page ?? null,
            section_id: body.section_id ?? null,
            event: body.event ?? null,
            start_at: body.start_at ? new Date(body.start_at) : null,
            end_at: body.end_at ? new Date(body.end_at) : null,
            user_agent: req.headers.get("user-agent") ?? null,
        });
        console.log("data:", data)
        console.log("error:", JSON.stringify(error))

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message }); // ← do not throw error
        }

        return Response.json({ ok: true });
    } catch (e) {
        console.error("[log/activity]", e);
        return res.status(500).json({ error: e.message || "Failed to log activity" });
    }
}
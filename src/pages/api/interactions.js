import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.mybase_SUPABASE_URL,
    process.env.mybase_SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    try {
        const body = await req.json();

        const { error } = await supabase.from("user_ai_interactions").insert({
            user_prompt: body.user_prompt,
            ai_model: body.ai_model,
            ai_output: body.ai_output,
            user_remote_addr: req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                ?? req.headers.get("cf-connecting-ip")
                ?? null,
            user_agent: req.headers.get("user-agent") ?? null,

        });

        if (error) throw error;

        return Response.json({ ok: true });
    } catch (e) {
        console.error("[log/interaction]", e);
        return Response.json({ error: "Failed to log interaction" }, { status: 500 });
    }
}
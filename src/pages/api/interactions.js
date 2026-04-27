import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.mybase_SUPABASE_URL,
    process.env.mybase_SUPABASE_SERVICE_ROLE_KEY
);

export default async function POST(req) {
    try {
        const body = await req.json();

        const { data, error } = await supabase.from("user_ai_interactions").insert({
            user_prompt: body.user_prompt,
            ai_model: body.ai_model,
            ai_output: body.ai_output,
            user_remote_addr: req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                ?? req.headers.get("cf-connecting-ip")
                ?? null,
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
        console.error("[log/interaction]", e);
        return res.status(500).json({ error: e.message || "Failed to log interaction" });
    }
}
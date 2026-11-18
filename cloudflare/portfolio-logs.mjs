import { timingSafeEqual } from "node:crypto";

const fieldsByPath = {
  "/activities": {
    table: "user_activities",
    fields: ["user_forward_ip", "user_remote_ip", "header_language", "from_page",
      "section_id", "event", "start_at", "user_agent"],
  },
  "/interactions": {
    table: "user_ai_interactions",
    fields: ["user_prompt", "ai_model", "ai_output", "user_remote_addr"],
  },
};

function authorized(request, token) {
  if (!token) return false;
  const supplied = Buffer.from(request.headers.get("Authorization") ?? "");
  const expected = Buffer.from(`Bearer ${token}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (!Object.hasOwn(fieldsByPath, path)) return new Response(null, { status: 404 });
    if (request.method !== "POST") return new Response(null, { status: 405 });
    if (!authorized(request, env.PORTFOLIO_LOG_TOKEN)) return new Response(null, { status: 401 });

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(null, { status: 400 });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return new Response(null, { status: 400 });
    }

    // The route fixes the table and columns. Only field values come from JSON.
    const { table, fields } = fieldsByPath[path];
    const values = fields.map((field) => body[field] ?? null);
    if (values.some((value) => value !== null && typeof value !== "string")) {
      return new Response(null, { status: 400 });
    }

    try {
      const placeholders = fields.map(() => "?").join(", ");
      await env.DB.prepare(
        `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`
      ).bind(...values).run();
      return Response.json({ ok: true });
    } catch {
      // Keep visitor IPs, prompts and responses out of infrastructure logs.
      console.error("Portfolio D1 insert failed");
      return new Response(null, { status: 500 });
    }
  },
};

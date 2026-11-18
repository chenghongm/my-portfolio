import { createClient } from "@supabase/supabase-js";

export async function insertPortfolioLog(table, path, row) {
  const workerUrl = process.env.PORTFOLIO_LOG_WORKER_URL;
  // Keep Supabase active until the administrator switches the Vercel environment.
  if (!workerUrl) {
    const supabase = createClient(
      process.env.mybase_SUPABASE_URL,
      process.env.mybase_SUPABASE_SERVICE_ROLE_KEY
    );
    const { error } = await supabase.from(table).insert(row);
    if (error) throw error;
    return;
  }

  const token = process.env.PORTFOLIO_LOG_TOKEN;
  const endpoint = new URL(path, workerUrl);
  if (!token || endpoint.protocol !== "https:") {
    throw new Error("Portfolio logging Worker is not configured correctly");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(row),
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Portfolio logging Worker returned ${response.status}`);
}

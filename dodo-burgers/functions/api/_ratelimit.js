// D1-backed fixed-window rate limiter -- no extra service needed.
// Returns true if the request is allowed, false if the caller should get a 429.
export async function checkRateLimit(env, key, limit, windowSeconds) {
  const nowMs = Date.now();
  const row = await env.DB.prepare("SELECT count, window_start FROM auth_attempts WHERE key = ?").bind(key).first();

  if (!row || nowMs - Date.parse(row.window_start) > windowSeconds * 1000) {
    await env.DB.prepare(
      "INSERT INTO auth_attempts (key, count, window_start) VALUES (?, 1, ?) " +
      "ON CONFLICT(key) DO UPDATE SET count = 1, window_start = excluded.window_start"
    ).bind(key, new Date(nowMs).toISOString()).run();
    return true;
  }

  if (row.count >= limit) return false;

  await env.DB.prepare("UPDATE auth_attempts SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}

export function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

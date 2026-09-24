import { hashPassword, timingSafeEqual } from "./_hash.js";
import { checkRateLimit, clientIp } from "./_ratelimit.js";

export async function onRequestPost({ request, env }) {
  const ip = clientIp(request);
  const allowed = await checkRateLimit(env, "login:" + ip, 10, 60); // 10 attempts / 60s / IP
  if (!allowed) return Response.json({ error: "Too many attempts, try again in a minute" }, { status: 429 });

  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) return Response.json({ error: "Email and password required" }, { status: 400 });

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(String(email).toLowerCase()).first();
  if (!user) return Response.json({ error: "Invalid email or password" }, { status: 401 });

  const { hash } = await hashPassword(password, user.salt);
  if (!timingSafeEqual(hash, user.password_hash)) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  return Response.json({ ok: true, email: user.email });
}

import { hashPassword } from "./_hash.js";
import { checkRateLimit, clientIp } from "./_ratelimit.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const ip = clientIp(request);
  const allowed = await checkRateLimit(env, "signup:" + ip, 5, 3600); // 5 signups / hour / IP
  if (!allowed) return Response.json({ error: "Too many signups from this connection, try later" }, { status: 429 });

  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !EMAIL_RE.test(email) || !password || password.length < 6 || password.length > 200) {
    return Response.json({ error: "Valid email and 6-200 char password required" }, { status: 400 });
  }
  const { hash, salt } = await hashPassword(password);
  try {
    await env.DB.prepare("INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)")
      .bind(email.toLowerCase(), hash, salt)
      .run();
  } catch (e) {
    return Response.json({ error: "Email already registered" }, { status: 409 });
  }
  return Response.json({ ok: true, email: email.toLowerCase() });
}

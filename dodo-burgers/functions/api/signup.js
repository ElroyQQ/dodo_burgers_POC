import { hashPassword } from "./_hash.js";

export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password || password.length < 6) {
    return Response.json({ error: "Valid email and 6+ char password required" }, { status: 400 });
  }
  const { hash, salt } = await hashPassword(password);
  try {
    await env.DB.prepare("INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)")
      .bind(email.toLowerCase(), hash, salt)
      .run();
  } catch (e) {
    return Response.json({ error: "Email already registered" }, { status: 409 });
  }
  return Response.json({ ok: true, email });
}

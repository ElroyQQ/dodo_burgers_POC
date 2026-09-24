import { hashPassword } from "./_hash.js";

export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) return Response.json({ error: "Email and password required" }, { status: 400 });

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email.toLowerCase()).first();
  if (!user) return Response.json({ error: "Invalid email or password" }, { status: 401 });

  const { hash } = await hashPassword(password, user.salt);
  if (hash !== user.password_hash) return Response.json({ error: "Invalid email or password" }, { status: 401 });

  return Response.json({ ok: true, email: user.email });
}

// shared PBKDF2 password hashing (Web Crypto, no deps)
// 100,000 iterations: OWASP's current minimum is 210,000, but Cloudflare
// Pages Functions enforce a per-request CPU time limit and 210k reliably
// exceeded it here (confirmed live: every login/signup request that reached
// this code threw "Worker threw exception"). 100k is the highest value
// verified to run within that limit on this plan -- raise it only after
// testing a real (not fake-email-short-circuited) login/signup request
// against the actual deployment, not just locally.
export async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return { hash: hex(bits), salt: hex(salt) };
}

// constant-time string compare -- avoids leaking hash-match progress via response timing
export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

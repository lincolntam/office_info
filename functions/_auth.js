const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "=",
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(payload));
}

async function pbkdf2(password, salt, iterations = 210000) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations,
    },
    key,
    256,
  );
  return base64UrlEncode(bits);
}

function randomToken(length = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return base64UrlEncode(bytes);
}

async function hashPassword(password) {
  const salt = randomToken(18);
  const iterations = 210000;
  const hash = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

async function verifyPassword(password, stored) {
  if (!stored) return false;

  if (stored.startsWith("pbkdf2$")) {
    const [, iterationText, salt, expected] = stored.split("$");
    const actual = await pbkdf2(password, salt, Number(iterationText));
    return timingSafeEqual(actual, expected);
  }

  return timingSafeEqual(password, stored);
}

function timingSafeEqual(a, b) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

async function createSession(user, secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const payload = base64UrlEncode(
    encoder.encode(JSON.stringify({ sub: user.id, email: user.email, role: user.role, exp: expiresAt })),
  );
  const signature = base64UrlEncode(await hmac(secret, payload));
  return `${payload}.${signature}`;
}

async function readSession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)office_session=([^;]+)/);
  if (!match) return null;

  const [payload, signature] = match[1].split(".");
  if (!payload || !signature) return null;

  const expected = base64UrlEncode(await hmac(secret, payload));
  if (!timingSafeEqual(signature, expected)) return null;

  const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
  if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
  return session;
}

function sessionCookie(token) {
  return [
    `office_session=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=2592000",
  ].join("; ");
}

function clearSessionCookie() {
  return "office_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
}

export {
  clearSessionCookie,
  createSession,
  hashPassword,
  json,
  readSession,
  sessionCookie,
  verifyPassword,
};

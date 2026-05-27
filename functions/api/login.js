import { createSession, hashPassword, json, sessionCookie, verifyPassword } from "../_auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.GLOBAL_LOGIN_DB) {
    return json({ error: "未設定 GLOBAL_LOGIN_DB D1 binding。" }, 500);
  }

  const secret = env.LOGIN_SESSION_SECRET;
  if (!secret) {
    return json({ error: "未設定 LOGIN_SESSION_SECRET。" }, 500);
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return json({ error: "請輸入 Email 和密碼。" }, 400);
  }

  const user = await env.GLOBAL_LOGIN_DB.prepare(
    "SELECT id, email, password, username, role FROM users WHERE email = ?",
  )
    .bind(email)
    .first();

  if (!user || !(await verifyPassword(password, user.password))) {
    return json({ error: "Email 或密碼不正確。" }, 401);
  }

  if (!String(user.password).startsWith("pbkdf2$")) {
    await env.GLOBAL_LOGIN_DB.prepare("UPDATE users SET password = ? WHERE id = ?")
      .bind(await hashPassword(password), user.id)
      .run();
  }

  const token = await createSession(user, secret);
  return json(
    {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    },
    200,
    { "Set-Cookie": sessionCookie(token) },
  );
}

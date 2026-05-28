import { createSession, json, sessionCookie, verifyPassword } from "../_auth.js";

export async function onRequestPost({ request, env }) {
  try {
    if (!env.GLOBAL_LOGIN_DB) {
      return json({ error: "未設定 GLOBAL_LOGIN_DB D1 binding。" }, 500);
    }

    const secret = env.LOGIN_SESSION_SECRET || env.JWT_SECRET;
    if (!secret) {
      return json({ error: "未設定 LOGIN_SESSION_SECRET 或 JWT_SECRET。" }, 500);
    }

    const body = await request.json().catch(() => null);
    const identifier = String(body?.email || body?.identifier || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!identifier || !password) {
      return json({ error: "請輸入帳戶和密碼。" }, 400);
    }

    const user = await env.GLOBAL_LOGIN_DB.prepare(
      "SELECT id, email, password, username, role FROM users WHERE lower(email) = ? OR lower(username) = ?",
    )
      .bind(identifier, identifier)
      .first();

    if (!user || !(await verifyPassword(password, user.password, env))) {
      return json({ error: "帳戶或密碼不正確。" }, 401);
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
  } catch (error) {
    console.error("Login API Error:", error);
    return json({ error: "登入服務暫時未能使用。" }, 500);
  }
}

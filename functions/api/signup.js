import { hashPassword, json } from "../_auth.js";

export async function onRequestPost({ request, env }) {
  try {
    if (!env.GLOBAL_LOGIN_DB) {
      return json({ error: "未設定 GLOBAL_LOGIN_DB D1 binding。" }, 500);
    }

    const body = await request.json().catch(() => null);
    const email = String(body?.email || "").trim().toLowerCase();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");
    const code = String(body?.code || "").trim();

    if (!email || !username || !password || !code) {
      return json({ error: "請輸入 Email、User name、密碼和邀請碼。" }, 400);
    }

    if (password.length < 8) {
      return json({ error: "密碼最少需要 8 個字元。" }, 400);
    }

    if (!env.INVITATION_CODE || code !== env.INVITATION_CODE) {
      return json({ error: "邀請碼不正確。" }, 403);
    }

    const existing = await env.GLOBAL_LOGIN_DB.prepare(
      "SELECT id FROM users WHERE lower(email) = ? OR lower(username) = ?",
    )
      .bind(email, username.toLowerCase())
      .first();

    if (existing) {
      return json({ error: "帳戶已存在。" }, 409);
    }

    await env.GLOBAL_LOGIN_DB.prepare(
      "INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, 'user')",
    )
      .bind(email, username, await hashPassword(password))
      .run();

    return json({ message: "帳戶已建立，請登入。" }, 201);
  } catch (error) {
    console.error("Signup API Error:", error);
    return json({ error: "建立帳戶暫時未能使用。" }, 500);
  }
}

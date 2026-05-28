import {
  clearSessionCookie,
  createSession,
  hashPassword,
  json,
  readSession,
  sessionCookie,
  verifyPassword,
} from "./functions/_auth.js";

const ASSET_ROUTES = new Map([
  ["/", "/index.html"],
  ["/login", "/login.html"],
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/login" && request.method === "POST") {
      return login(request, env);
    }

    if (url.pathname === "/api/me" && request.method === "GET") {
      return me(request, env);
    }

    if (url.pathname === "/api/logout" && request.method === "POST") {
      return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
    }

    if (url.pathname === "/api/spotlight" && request.method === "GET") {
      return spotlight();
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const session = await readSession(request, getSessionSecret(env));
      if (!session) {
        const next = encodeURIComponent(`${url.pathname}${url.search}${url.hash}`);
        return Response.redirect(`${url.origin}/login?next=${next}`, 302);
      }
    }

    return serveAsset(request, env);
  },
};

async function login(request, env) {
  try {
    if (!env.GLOBAL_LOGIN_DB) {
      return json({ error: "未設定 GLOBAL_LOGIN_DB D1 binding。" }, 500);
    }
    const secret = getSessionSecret(env);
    if (!secret) {
      return json({ error: "未設定 LOGIN_SESSION_SECRET。" }, 500);
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
  } catch (error) {
    console.error("Login API Error:", error);
    return json({ error: "登入服務暫時未能使用。" }, 500);
  }
}

async function me(request, env) {
  const session = await readSession(request, getSessionSecret(env));
  if (!session) return json({ user: null }, 200);

  return json({
    user: {
      id: session.sub,
      email: session.email,
      role: session.role,
    },
  });
}

async function spotlight() {
  try {
    const index = Math.floor(Math.random() * 8);
    const response = await fetch(
      `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1&mkt=zh-HK`,
      {
        headers: { "User-Agent": "OfficeInfo/1.0" },
      },
    );
    if (!response.ok) throw new Error("Bing image request failed");

    const data = await response.json();
    const image = data.images?.[0];
    if (!image?.url) throw new Error("Missing image URL");

    return json({
      url: `https://www.bing.com${image.url}`,
      title: image.title || image.copyright || "Spotlight",
    });
  } catch (error) {
    console.error("Spotlight API Error:", error);
    return json({ error: "未能載入 Spotlight 圖片。" }, 502);
  }
}

function getSessionSecret(env) {
  return env.LOGIN_SESSION_SECRET || env.JWT_SECRET || "";
}

function serveAsset(request, env) {
  if (!env.ASSETS) {
    return new Response("Asset binding missing", { status: 500 });
  }

  const url = new URL(request.url);
  const assetPath = ASSET_ROUTES.get(url.pathname);
  if (!assetPath) return env.ASSETS.fetch(request);

  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  return env.ASSETS.fetch(new Request(assetUrl, request));
}

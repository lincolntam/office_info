import { json, readSession } from "./_auth.js";

const GRAPH_URL = "https://graph.microsoft.com/v1.0";
const TOKEN_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS microsoft_tokens (
    user_id TEXT PRIMARY KEY,
    microsoft_user_id TEXT,
    email TEXT,
    display_name TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

function getMicrosoftConfig(env) {
  return {
    clientId: env.MICROSOFT_CLIENT_ID,
    clientSecret: env.MICROSOFT_CLIENT_SECRET,
    tenantId: env.MICROSOFT_TENANT_ID || "organizations",
  };
}

function getRedirectUri(request) {
  return new URL("/api/microsoft/callback", request.url).toString();
}

function requireMicrosoftEnv(env) {
  const config = getMicrosoftConfig(env);
  if (!config.clientId || !config.clientSecret) {
    return null;
  }
  return config;
}

async function getCurrentUser(request, env) {
  const secret = env.LOGIN_SESSION_SECRET || env.JWT_SECRET;
  if (!secret) return null;
  return readSession(request, secret);
}

async function ensureMicrosoftTable(env) {
  await env.GLOBAL_LOGIN_DB.prepare(TOKEN_TABLE_SQL).run();
}

async function exchangeCodeForToken(request, env, code) {
  const config = requireMicrosoftEnv(env);
  if (!config) throw new Error("Missing Microsoft OAuth env");

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: getRedirectUri(request),
    grant_type: "authorization_code",
    scope: "offline_access User.Read Chat.Read",
  });

  const response = await fetch(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || "Microsoft token exchange failed");
  return data;
}

async function refreshMicrosoftToken(env, token) {
  const config = requireMicrosoftEnv(env);
  if (!config || !token?.refresh_token) throw new Error("Missing Microsoft refresh token");

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: token.refresh_token,
    grant_type: "refresh_token",
    scope: "offline_access User.Read Chat.Read",
  });

  const response = await fetch(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || "Microsoft token refresh failed");
  return data;
}

async function graphFetch(path, accessToken) {
  const response = await fetch(`${GRAPH_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Microsoft Graph request failed");
  return data;
}

async function getStoredMicrosoftToken(env, userId) {
  await ensureMicrosoftTable(env);
  return env.GLOBAL_LOGIN_DB.prepare("SELECT * FROM microsoft_tokens WHERE user_id = ?").bind(userId).first();
}

async function saveMicrosoftToken(env, userId, token, profile = {}) {
  await ensureMicrosoftTable(env);
  const expiresAt = Math.floor(Date.now() / 1000) + Number(token.expires_in || 3600);
  await env.GLOBAL_LOGIN_DB.prepare(
    `INSERT INTO microsoft_tokens
      (user_id, microsoft_user_id, email, display_name, access_token, refresh_token, expires_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
      microsoft_user_id = excluded.microsoft_user_id,
      email = excluded.email,
      display_name = excluded.display_name,
      access_token = excluded.access_token,
      refresh_token = COALESCE(excluded.refresh_token, microsoft_tokens.refresh_token),
      expires_at = excluded.expires_at,
      updated_at = CURRENT_TIMESTAMP`,
  )
    .bind(
      userId,
      profile.id || null,
      profile.mail || profile.userPrincipalName || null,
      profile.displayName || null,
      token.access_token,
      token.refresh_token || null,
      expiresAt,
    )
    .run();
}

async function getValidMicrosoftToken(env, userId) {
  const token = await getStoredMicrosoftToken(env, userId);
  if (!token) return null;

  const now = Math.floor(Date.now() / 1000);
  if (token.expires_at > now + 90) return token.access_token;

  const refreshed = await refreshMicrosoftToken(env, token);
  await saveMicrosoftToken(env, userId, refreshed, {
    id: token.microsoft_user_id,
    mail: token.email,
    displayName: token.display_name,
  });

  return refreshed.access_token;
}

function stripHtml(html = "") {
  return html
    .replace(/<attachment[^>]*><\/attachment>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export {
  ensureMicrosoftTable,
  exchangeCodeForToken,
  getCurrentUser,
  getMicrosoftConfig,
  getRedirectUri,
  getStoredMicrosoftToken,
  getValidMicrosoftToken,
  graphFetch,
  json,
  requireMicrosoftEnv,
  saveMicrosoftToken,
  stripHtml,
};

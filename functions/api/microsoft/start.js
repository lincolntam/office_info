import { getCurrentUser, getMicrosoftConfig, getRedirectUri, requireMicrosoftEnv } from "../../_microsoft.js";

function randomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function onRequestGet({ request, env }) {
  const user = await getCurrentUser(request, env);
  if (!user) return Response.redirect(new URL("/login?next=%2F%23teams", request.url), 302);

  const config = requireMicrosoftEnv(env);
  if (!config) return new Response("Missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET", { status: 500 });

  const state = randomState();
  const tenantId = getMicrosoftConfig(env).tenantId;
  const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
  authUrl.search = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(request),
    response_mode: "query",
    scope: "offline_access User.Read Chat.Read",
    state,
    prompt: "select_account",
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      "Set-Cookie": `ms_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}

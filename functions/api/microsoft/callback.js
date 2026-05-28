import {
  exchangeCodeForToken,
  getCurrentUser,
  graphFetch,
  saveMicrosoftToken,
} from "../../_microsoft.js";

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) return Response.redirect(new URL(`/index.html#teams`, request.url), 302);

  const user = await getCurrentUser(request, env);
  if (!user) return Response.redirect(new URL("/login?next=%2F%23teams", request.url), 302);

  const state = url.searchParams.get("state");
  const cookieState = getCookie(request, "ms_oauth_state");
  if (!state || !cookieState || state !== cookieState) {
    return new Response("Invalid Microsoft OAuth state", { status: 400 });
  }

  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing Microsoft OAuth code", { status: 400 });

  const token = await exchangeCodeForToken(request, env, code);
  const profile = await graphFetch("/me?$select=id,displayName,mail,userPrincipalName", token.access_token);
  await saveMicrosoftToken(env, user.sub, token, profile);

  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL("/index.html#teams", request.url).toString(),
      "Set-Cookie": "ms_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
}

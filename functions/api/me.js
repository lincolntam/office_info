import { json, readSession } from "../_auth.js";

export async function onRequestGet({ request, env }) {
  const secret = env.LOGIN_SESSION_SECRET || env.JWT_SECRET;
  if (!secret) return json({ user: null }, 200);

  const session = await readSession(request, secret);
  if (!session) return json({ user: null }, 200);

  return json({
    user: {
      id: session.sub,
      email: session.email,
      role: session.role,
    },
  });
}

import {
  getCurrentUser,
  getStoredMicrosoftToken,
  getValidMicrosoftToken,
  graphFetch,
  json,
  stripHtml,
} from "../../_microsoft.js";

function shortName(name = "") {
  return name
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(" ") || "Teams";
}

export async function onRequestGet({ request, env }) {
  const user = await getCurrentUser(request, env);
  if (!user) return json({ connected: false, error: "Not logged in" }, 401);

  const stored = await getStoredMicrosoftToken(env, user.sub);
  if (!stored) return json({ connected: false }, 200);

  try {
    const accessToken = await getValidMicrosoftToken(env, user.sub);
    const configuredChatId = env.TEAMS_CHAT_ID;
    let chatId = configuredChatId;
    let chatTopic = "Teams";

    if (!chatId) {
      let chats;
      try {
        chats = await graphFetch("/me/chats?$top=1&$orderby=lastUpdatedDateTime desc", accessToken);
      } catch {
        chats = await graphFetch("/me/chats?$top=1", accessToken);
      }
      const latestChat = chats.value?.[0];
      chatId = latestChat?.id;
      chatTopic = latestChat?.topic || latestChat?.chatType || "Teams";
    }

    if (!chatId) return json({ connected: true, message: null }, 200);

    const encodedChatId = encodeURIComponent(chatId);
    const messages = await graphFetch(
      `/chats/${encodedChatId}/messages?$top=1&$select=id,createdDateTime,from,body,chatId`,
      accessToken,
    );
    const message = messages.value?.[0];
    if (!message) return json({ connected: true, message: null }, 200);

    const sender = message.from?.user?.displayName || "Teams";
    return json({
      connected: true,
      account: {
        email: stored.email,
        displayName: stored.display_name,
      },
      message: {
        id: message.id,
        chatId: message.chatId,
        chatName: chatTopic,
        sender,
        senderShort: shortName(sender),
        body: stripHtml(message.body?.content || ""),
        createdDateTime: message.createdDateTime,
      },
    });
  } catch (error) {
    return json({ connected: false, error: error.message || "Teams request failed" }, 502);
  }
}

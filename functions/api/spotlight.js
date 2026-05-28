import { json } from "../_auth.js";

export async function onRequestGet() {
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

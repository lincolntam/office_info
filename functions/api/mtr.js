import { json } from "../_auth.js";

const MTR_NEXT_TRAIN_URL = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";
const ALLOWED_LINES = new Set(["AEL", "TCL", "TML", "TKL", "EAL", "SIL", "TWL", "ISL", "KTL", "DRL"]);

function normalizeCode(value, fallback) {
  return String(value || fallback)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const requestedLine = normalizeCode(url.searchParams.get("line"), "TCL");
  const line = ALLOWED_LINES.has(requestedLine) ? requestedLine : "TCL";
  const station = normalizeCode(url.searchParams.get("station") || url.searchParams.get("sta"), "TSY");
  const endpoint = `${MTR_NEXT_TRAIN_URL}?line=${encodeURIComponent(line)}&sta=${encodeURIComponent(station)}`;

  try {
    const response = await fetch(endpoint, {
      cf: { cacheTtl: 10, cacheEverything: true },
      headers: { "User-Agent": "office-info-dashboard/1.0" },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.status === 0) {
      return json({ error: data.message || "MTR request failed" }, 502);
    }

    return json(data, 200, { "Cache-Control": "public, max-age=10" });
  } catch {
    return json({ error: "MTR service unavailable" }, 502);
  }
}

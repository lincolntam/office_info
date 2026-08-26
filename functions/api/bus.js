const KMB_STOP_ETA_URL = "https://data.etabus.gov.hk/v1/transport/kmb/stop-eta";
const MAX_STOPS = 10;

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function normalizeStops(value = "") {
  return value
    .split(",")
    .map((stop) => stop.trim())
    .filter(Boolean)
    .slice(0, MAX_STOPS);
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const stops = normalizeStops(url.searchParams.get("stops") || "");

  if (!stops.length) {
    return jsonResponse({ results: [] });
  }

  try {
    const results = await Promise.all(
      stops.map(async (stopId) => {
        const response = await fetch(`${KMB_STOP_ETA_URL}/${encodeURIComponent(stopId)}`, {
          cf: { cacheTtl: 45, cacheEverything: true },
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            stopId,
            data: [],
            error: payload.message || `KMB ETA failed with ${response.status}`,
          };
        }

        return {
          stopId,
          data: Array.isArray(payload.data) ? payload.data : [],
        };
      }),
    );

    return jsonResponse({ results });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unable to load bus ETA",
        results: [],
      },
      { status: 502 },
    );
  }
}

import { json } from "../_auth.js";

const GMB_STOP_ETA_URL = "https://data.etagmb.gov.hk/eta/stop";
const GMB_ROUTE_URL = "https://data.etagmb.gov.hk/route";
const GMB_ROUTE_STOP_URL = "https://data.etagmb.gov.hk/route-stop";
const MAX_STOPS = 10;
const GMB_REGIONS = ["HKI", "KLN", "NT"];
const GMB_FETCH_OPTIONS = {
  headers: {
    Accept: "application/json",
    Referer: "https://data.etagmb.gov.hk/",
    "User-Agent": "Mozilla/5.0",
  },
};

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
  const routeQuery = (url.searchParams.get("route") || "").trim();
  const routeId = (url.searchParams.get("routeId") || "").trim();
  const routeSeq = (url.searchParams.get("routeSeq") || "").trim();
  const routeCache = new Map();

  if (routeId && routeSeq) {
    try {
      const response = await fetch(
        `${GMB_ROUTE_STOP_URL}/${encodeURIComponent(routeId)}/${encodeURIComponent(routeSeq)}`,
        { ...GMB_FETCH_OPTIONS, cf: { cacheTtl: 3600, cacheEverything: true } },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return json({ error: payload.message || `Green minibus route stops failed with ${response.status}` }, response.status);
      }
      return json(payload);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unable to load green minibus stops" }, 502);
    }
  }

  if (routeQuery) {
    try {
      const routeResults = await Promise.all(
        GMB_REGIONS.map(async (region) => {
          const response = await fetch(`${GMB_ROUTE_URL}/${region}/${encodeURIComponent(routeQuery)}`, {
            ...GMB_FETCH_OPTIONS,
            cf: { cacheTtl: 3600, cacheEverything: true },
          });
          if (!response.ok) return [];
          const payload = await response.json().catch(() => ({}));
          return Array.isArray(payload.data) ? payload.data : [];
        }),
      );
      return json({ data: routeResults.flat() });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unable to search green minibus route", data: [] }, 502);
    }
  }

  if (!stops.length) {
    return json({ results: [] });
  }

  try {
    async function getRouteInfo(routeId) {
      const key = String(routeId || "");
      if (!key) return null;
      if (!routeCache.has(key)) {
        routeCache.set(
          key,
          fetch(`${GMB_ROUTE_URL}/${encodeURIComponent(key)}`, {
            ...GMB_FETCH_OPTIONS,
            cf: { cacheTtl: 3600, cacheEverything: true },
          })
            .then((response) => response.json())
            .then((payload) => (Array.isArray(payload.data) ? payload.data[0] : null))
            .catch(() => null),
        );
      }
      return routeCache.get(key);
    }

    const results = await Promise.all(
      stops.map(async (stopId) => {
        const response = await fetch(`${GMB_STOP_ETA_URL}/${encodeURIComponent(stopId)}`, {
          ...GMB_FETCH_OPTIONS,
          cf: { cacheTtl: 45, cacheEverything: true },
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            stopId,
            data: [],
            error: payload.message || `Green minibus ETA failed with ${response.status}`,
          };
        }

        const items = Array.isArray(payload.data) ? payload.data : [];
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const route = await getRouteInfo(item.route_id);
            const direction = route?.directions?.find((entry) => Number(entry.route_seq) === Number(item.route_seq));
            return {
              ...item,
              route_code: route?.route_code || item.route_code,
              dest_tc: direction?.dest_tc || item.dest_tc,
              dest_en: direction?.dest_en || item.dest_en,
              orig_tc: direction?.orig_tc || item.orig_tc,
              orig_en: direction?.orig_en || item.orig_en,
            };
          }),
        );

        return {
          stopId,
          data: enrichedItems,
        };
      }),
    );

    return json({ results });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unable to load green minibus ETA",
        results: [],
      },
      502,
    );
  }
}

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
const FALLBACK_ROUTES = [
  {
    route_id: 2007761,
    region: "NT",
    route_code: "811",
    description_tc: "正常班次",
    description_en: "Normal Departure",
    directions: [
      { route_seq: 1, orig_tc: "穗禾苑", orig_en: "Sui Wo Court", dest_tc: "愉翠苑", dest_en: "Yu Chui Court" },
      { route_seq: 2, orig_tc: "愉翠苑", orig_en: "Yu Chui Court", dest_tc: "穗禾苑", dest_en: "Sui Wo Court" },
    ],
  },
  {
    route_id: 2007766,
    region: "NT",
    route_code: "69K",
    description_tc: "正常班次",
    description_en: "Normal Departure",
    directions: [
      {
        route_seq: 1,
        orig_tc: "沙田站(排頭街)",
        orig_en: "Sha Tin Station (Pai Tau Street)",
        dest_tc: "沙田渣甸山花園∕華翠園",
        dest_en: "Ville De Jardin / Greenwood Terrace",
      },
      {
        route_seq: 2,
        orig_tc: "沙田渣甸山花園∕華翠園",
        orig_en: "Ville De Jardin / Greenwood Terrace",
        dest_tc: "沙田站(排頭街)",
        dest_en: "Sha Tin Station (Pai Tau Street)",
      },
    ],
  },
];
const FALLBACK_ROUTE_STOPS = {
  "2007761:1": [
    { stop_seq: 1, stop_id: 20015706, name_tc: "穗禾苑", name_en: "Sui Wo Court" },
    { stop_seq: 2, stop_id: 20015707, name_tc: "穗禾路, 華樂工業中心外", name_en: "Sui Wo Road, outside Wah Lok Industrial Centre" },
    { stop_seq: 3, stop_id: 20015708, name_tc: "松頭下路, 富騰工業中心外", name_en: "Tsung Tau Ha Road, outside Fo Tan Industrial Centre" },
    { stop_seq: 4, stop_id: 20015709, name_tc: "樂信徑迴旋處巴士灣", name_en: "Bus lay-by at Lok Shun Path roundabout" },
    { stop_seq: 5, stop_id: 20015710, name_tc: "樂信徑, 駿景園外", name_en: "Lok Shun Path, outside Royal Ascot" },
    { stop_seq: 6, stop_id: 20015711, name_tc: "樂景街銀禧花園外的九巴88K巴士停車灣", name_en: "Lok King Street KMB 88K bus lay-by outside Jubilee Garden" },
    { stop_seq: 7, stop_id: 20015712, name_tc: "樂景街火炭站對面", name_en: "Lok King Street, opposite Fo Tan Station" },
    { stop_seq: 8, stop_id: 20002261, name_tc: "銀城街, 置富第一城外", name_en: "Ngan Shing Street, outside Fortune City One" },
    { stop_seq: 9, stop_id: 20002273, name_tc: "銀城街, 五旬節林漢光中學外", name_en: "Ngan Shing Street, outside Pentecostal Lam Hon Kwong School" },
    { stop_seq: 10, stop_id: 20002274, name_tc: "插桅杆街, 第一城站外", name_en: "Chap Wai Kon Street, outside City One Station" },
    { stop_seq: 11, stop_id: 20015713, name_tc: "愉翠苑愉欣閣", name_en: "Yu Yan House, Yuet Chui Court" },
  ],
  "2007761:2": [
    { stop_seq: 1, stop_id: 20015713, name_tc: "愉翠苑愉欣閣", name_en: "Yu Yan House, Yuet Chui Court" },
    { stop_seq: 2, stop_id: 20002293, name_tc: "插桅杆街, 欣廷軒外", name_en: "Chap Wai Kon Street, outside Prima Villa" },
    { stop_seq: 3, stop_id: 20015727, name_tc: "威爾斯親王醫院", name_en: "Prince of Wales Hospital" },
    { stop_seq: 4, stop_id: 20002259, name_tc: "銀城街, 置富第一城•樂薈外", name_en: "Ngan Shing Street, outside Fortune City One Plus" },
    { stop_seq: 5, stop_id: 20015728, name_tc: "樂景街, 港鐵火炭站外", name_en: "Lok King Street, outside Fo Tan Station" },
    { stop_seq: 6, stop_id: 20002230, name_tc: "樂景街, 銀禧花園對面", name_en: "Lok King Street, opposite Jubilee Garden" },
    { stop_seq: 7, stop_id: 20015709, name_tc: "樂信徑迴旋處巴士灣", name_en: "Bus lay-by at Lok Shun Path roundabout" },
    { stop_seq: 8, stop_id: 20015729, name_tc: "桂地街, 華耀工業中心外", name_en: "Kwei Tei Street, outside Wah Yiu Industrial Centre" },
    { stop_seq: 9, stop_id: 20015730, name_tc: "桂地街, 近華衛工貿中心", name_en: "Kwei Tei Street, near Wah Wei Industrial Centre" },
    { stop_seq: 10, stop_id: 20019501, name_tc: "桂地街, 變電站外", name_en: "Kwei Tei Street, opposite to substation" },
    { stop_seq: 11, stop_id: 20015706, name_tc: "穗禾苑", name_en: "Sui Wo Court" },
  ],
  "2007766:1": [
    { stop_seq: 1, stop_id: 20015714, name_tc: "排頭街, 港鐵沙田站外", name_en: "Pai Tau Street, outside Shatin Station" },
    { stop_seq: 2, stop_id: 20015751, name_tc: "山尾街, 沙田商業中心對面", name_en: "Shan Mei Street, opposite Shatin Galleria" },
    { stop_seq: 3, stop_id: 20015752, name_tc: "穗禾路, 穗禾苑二期", name_en: "Sui Wo Road, Sui Wo Court Phase II" },
    { stop_seq: 4, stop_id: 20015753, name_tc: "穗禾路, 豐景花園C座", name_en: "Sui Wo Road, Scenery Garden, Block C" },
    { stop_seq: 5, stop_id: 20022175, name_tc: "穗禾路沙田小學外", name_en: "Siu Wo Road, outside Sha Tin Junior School" },
    { stop_seq: 6, stop_id: 20015754, name_tc: "穗禾路, 華翠園第25座", name_en: "Sui Wo Road, Greenwood Terrace Block 25" },
    { stop_seq: 7, stop_id: 20015742, name_tc: "穗禾路, 近沙田渣甸山花園", name_en: "Sui Wo Road, Ville de Jardin" },
  ],
  "2007766:2": [
    { stop_seq: 1, stop_id: 20015742, name_tc: "穗禾路, 近沙田渣甸山花園", name_en: "Sui Wo Road, Ville de Jardin" },
    { stop_seq: 2, stop_id: 20015755, name_tc: "穗禾路, 華翠園第25座外", name_en: "Sui Wo Road, outside Greenwood Terrace Block 25" },
    { stop_seq: 3, stop_id: 20022174, name_tc: "穗禾路沙田小學對面", name_en: "Siu Wo Road, opposite Sha Tin Junior School" },
    { stop_seq: 4, stop_id: 20015756, name_tc: "穗禾路, 豐景花園C座對面", name_en: "Sui Wo Road, opposite Scenery Garden, Block C" },
    { stop_seq: 5, stop_id: 20015744, name_tc: "穗禾路,穗禾苑二期", name_en: "Sui Wo Road, Sui Wo Court Phase II" },
    { stop_seq: 6, stop_id: 20015757, name_tc: "山尾街, 沙田商業中心外", name_en: "Shan Mei Street, outside Shatin Galleria" },
    { stop_seq: 7, stop_id: 20015714, name_tc: "排頭街, 港鐵沙田站外", name_en: "Pai Tau Street, outside Shatin Station" },
  ],
};

function getFallbackRoutes(query) {
  const value = query.trim().toUpperCase();
  return FALLBACK_ROUTES.filter((route) => route.route_code.toUpperCase() === value || String(route.route_id) === value);
}

function getFallbackRouteStops(routeId, routeSeq) {
  const routeStops = FALLBACK_ROUTE_STOPS[`${routeId}:${routeSeq}`] || [];
  return routeStops.length ? { type: "Route-Stop", version: "fallback", data: { route_stops: routeStops } } : null;
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
        const fallback = getFallbackRouteStops(routeId, routeSeq);
        if (fallback) return json(fallback);
        return json({ error: payload.message || `Green minibus route stops failed with ${response.status}` }, response.status);
      }
      const stops = Array.isArray(payload.data?.route_stops) ? payload.data.route_stops : [];
      return json(stops.length ? payload : getFallbackRouteStops(routeId, routeSeq) || payload);
    } catch (error) {
      const fallback = getFallbackRouteStops(routeId, routeSeq);
      if (fallback) return json(fallback);
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
      const data = routeResults.flat();
      return json({ data: data.length ? data : getFallbackRoutes(routeQuery) });
    } catch (error) {
      const data = getFallbackRoutes(routeQuery);
      if (data.length) return json({ data });
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

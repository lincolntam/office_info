import { json } from "../_auth.js";

const HKO_REPORT_URL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc";
const HKO_FORECAST_URL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc";

export async function onRequestGet() {
  try {
    const [reportResponse, forecastResponse] = await Promise.all([
      fetch(HKO_REPORT_URL, { cf: { cacheTtl: 300, cacheEverything: true } }),
      fetch(HKO_FORECAST_URL, { cf: { cacheTtl: 300, cacheEverything: true } }),
    ]);

    if (!reportResponse.ok || !forecastResponse.ok) {
      return json({ error: "HKO request failed" }, 502);
    }

    return json({
      report: await reportResponse.json(),
      forecast: await forecastResponse.json(),
    });
  } catch {
    return json({ error: "Weather service unavailable" }, 502);
  }
}

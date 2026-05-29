import { json } from "../_auth.js";

const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

function normalizeSymbol(value) {
  const symbol = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9.^=-]/g, "")
    .slice(0, 24);
  if (/^\d{1,4}$/.test(symbol)) return `${symbol.padStart(4, "0")}.HK`;
  if (/^\d{5}$/.test(symbol)) return `${symbol}.HK`;
  return symbol;
}

function compactSeries(timestamps = [], quote = {}) {
  const closes = quote.close || [];
  return timestamps
    .map((time, index) => ({
      time,
      value: typeof closes[index] === "number" ? closes[index] : null,
    }))
    .filter((point) => point.value !== null)
    .slice(-30);
}

function appendLatestPoint(series, price, time) {
  if (typeof price !== "number" || Number.isNaN(price)) return series;
  const latestTime = time || Math.floor(Date.now() / 1000);
  const nextSeries = [...series];
  const last = nextSeries[nextSeries.length - 1];

  if (!last) return [{ time: latestTime, value: price }];
  if (last.time === latestTime) {
    nextSeries[nextSeries.length - 1] = { time: latestTime, value: price };
  } else if (last.value !== price) {
    nextSeries.push({ time: latestTime, value: price });
  }

  return nextSeries.slice(-30);
}

async function fetchQuote(symbol) {
  const endpoint = `${YAHOO_CHART_URL}/${encodeURIComponent(symbol)}?range=1d&interval=5m`;
  const response = await fetch(endpoint, {
    cf: { cacheTtl: 60, cacheEverything: true },
    headers: { "User-Agent": "office-info-dashboard/1.0" },
  });
  const data = await response.json();
  const result = data.chart?.result?.[0];
  if (!response.ok || !result) throw new Error(`Market data unavailable for ${symbol}`);

  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const price = Number(meta.regularMarketPrice ?? meta.previousClose ?? 0);
  const previousClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;
  const series = appendLatestPoint(
    compactSeries(result.timestamp || [], quote),
    price,
    meta.regularMarketTime,
  );

  return {
    symbol,
    name: meta.shortName || meta.longName || symbol,
    currency: meta.currency || "",
    price,
    change,
    changePercent,
    regularMarketTime: meta.regularMarketTime || null,
    series,
  };
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const customSymbol = normalizeSymbol(url.searchParams.get("symbol")) || "0700.HK";

  try {
    const [hsi, custom] = await Promise.all([
      fetchQuote("^HSI"),
      fetchQuote(customSymbol),
    ]);
    return json({ hsi, custom });
  } catch (error) {
    return json({ error: error.message || "Market data unavailable" }, 502);
  }
}

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

function normalizeSymbols(value) {
  return String(value || "")
    .split(",")
    .map(normalizeSymbol)
    .filter(Boolean)
    .slice(0, 12);
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

function getChartParams(url) {
  const range = url.searchParams.get("range") === "1mo" ? "1mo" : "1d";
  const interval = range === "1mo" ? "1d" : "5m";
  return { range, interval };
}

async function fetchQuote(symbol, chartParams = { range: "1d", interval: "5m" }) {
  const endpoint = `${YAHOO_CHART_URL}/${encodeURIComponent(symbol)}?range=${chartParams.range}&interval=${chartParams.interval}`;
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
    previousClose,
    change,
    changePercent,
    regularMarketTime: meta.regularMarketTime || null,
    series,
  };
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const symbols = normalizeSymbols(url.searchParams.get("symbols"));
  const fallbackSymbol = normalizeSymbol(url.searchParams.get("symbol")) || "0700.HK";
  const customSymbols = symbols.length ? symbols : [fallbackSymbol];
  const chartParams = getChartParams(url);

  try {
    const [hsiResult, quoteResults] = await Promise.all([
      fetchQuote("^HSI", chartParams).then(
        (quote) => ({ ok: true, quote }),
        (error) => ({ ok: false, error }),
      ),
      Promise.allSettled(customSymbols.map((symbol) => fetchQuote(symbol, chartParams))),
    ]);
    const hsi = hsiResult.ok ? hsiResult.quote : null;
    const quotes = quoteResults
      .map((result, index) =>
        result.status === "fulfilled"
          ? { ...result.value, requestedSymbol: customSymbols[index] }
          : null,
      )
      .filter(Boolean);
    const failures = quoteResults
      .map((result, index) =>
        result.status === "rejected"
          ? { symbol: customSymbols[index], error: result.reason?.message || "Market data unavailable" }
          : null,
      )
      .filter(Boolean);

    if (!hsi && !quotes.length) throw new Error("Market data unavailable");

    return json({ hsi, quotes, custom: quotes[0] || null, failures });
  } catch (error) {
    return json({ error: error.message || "Market data unavailable" }, 502);
  }
}

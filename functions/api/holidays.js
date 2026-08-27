import { json } from "../_auth.js";

const HK_HOLIDAYS_URL = "https://www.1823.gov.hk/common/ical/tc.json";

function normalizeHolidayDate(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length !== 8) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function normalizeHolidayList(payload = {}) {
  const events = payload.vcalendar?.[0]?.vevent || [];
  return events
    .map((event) => ({
      date: normalizeHolidayDate(Array.isArray(event.dtstart) ? event.dtstart[0] : event.dtstart),
      name: String(event.summary || "").trim(),
    }))
    .filter((holiday) => holiday.date && holiday.name)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function onRequestGet() {
  try {
    const response = await fetch(HK_HOLIDAYS_URL, {
      cf: { cacheTtl: 12 * 60 * 60, cacheEverything: true },
    });
    const text = await response.text();
    const payload = JSON.parse(text.replace(/^\uFEFF/, ""));
    const holidays = normalizeHolidayList(payload);

    if (!response.ok || !holidays.length) {
      throw new Error(`Holiday data unavailable with ${response.status}`);
    }

    return json({ holidays });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unable to load public holidays",
        holidays: [],
      },
      502,
    );
  }
}

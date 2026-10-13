const STOCKHOLM_TZ = "Europe/Stockholm";

/**
 * The exact UTC instant for a given Stockholm-local wall-clock time --
 * doesn't hand-calculate the CET/CEST offset (which depends on exactly
 * where the date falls relative to that year's DST transition), instead
 * converging on it the same iterative way eklo-application's own
 * lib/slot-generation.ts does: guess the instant assuming UTC, read back
 * what Stockholm-local time that instant actually renders as, and correct
 * by the difference (at most two passes ever needed).
 */
export function stockholmInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  let t = desired;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STOCKHOLM_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  for (let i = 0; i < 2; i++) {
    const parts = formatter.formatToParts(new Date(t));
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    const observedHour = get("hour") === 24 ? 0 : get("hour");
    const observed = Date.UTC(get("year"), get("month") - 1, get("day"), observedHour, get("minute"), get("second"));
    const diff = desired - observed;
    if (diff === 0) break;
    t += diff;
  }
  return new Date(t);
}

/** eklo's launch date: 1 November 2026, Stockholm midnight. */
export const LAUNCH_DATE = stockholmInstant(2026, 11, 1, 0, 0);

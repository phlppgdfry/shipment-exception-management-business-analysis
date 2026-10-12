// Time helpers. All instants are stored in UTC; everything shown to people is UK local time
// (Europe/London), because the consignees and pilot customers are in the UK (DEF-01 in the BAT log).
export const TIME_ZONE = "Europe/London";

export const minutesBetween = (fromIso: string, toIso: string) => Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 60000);

export const addMinutes = (iso: string, minutes: number) =>
  new Date(Date.parse(iso) + minutes * 60000).toISOString().replace(".000Z", "Z");

const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, weekday: "short" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false });
const dateKeyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });

/** "Thu 06:40" */
export function formatDayTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${dayFmt.format(d)} ${timeFmt.format(d)}`;
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return timeFmt.format(new Date(iso));
}

/** "Thu 06:00–08:00", or with both days when the window spans midnight. */
export function formatWindow(w: { start: string; end: string } | null | undefined): string {
  if (!w) return "no window";
  const sameDay = londonDateKey(w.start) === londonDateKey(w.end);
  return sameDay ? `${formatDayTime(w.start)}–${formatTime(w.end)}` : `${formatDayTime(w.start)} – ${formatDayTime(w.end)}`;
}

/** Calendar date in UK local time, used for "delivery moves to another day" (ER-03). */
export function londonDateKey(iso: string): string {
  return dateKeyFmt.format(new Date(iso));
}

/** "4 h 40 min", "35 min", "-20 min" */
export function formatDuration(minutes: number): string {
  const sign = minutes < 0 ? "-" : "";
  const m = Math.abs(minutes);
  if (m < 60) return `${sign}${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${sign}${h} h ${rest} min` : `${sign}${h} h`;
}

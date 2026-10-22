// Store UTC instants. Planner persona: Belgium; consignee/customer: UK.
export const PLANNER_TIME_ZONE = "Europe/Brussels";
export const CUSTOMER_TIME_ZONE = "Europe/London";
export const TIME_ZONE = PLANNER_TIME_ZONE;
export const minutesBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 60000);
export const addMinutes = (iso: string, minutes: number) => new Date(Date.parse(iso) + minutes * 60000).toISOString().replace(".000Z", "Z");
const cache = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string, kind: "day" | "time" | "date" | "input") {
  const key = `${zone}:${kind}`;
  if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat("en-GB", { timeZone: zone,
    ...(kind === "day" ? { weekday: "short" } : kind === "time" ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } :
    { year: "numeric", month: "2-digit", day: "2-digit", ...(kind === "input" ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } : {}) }) }));
  return cache.get(key)!;
}
export function formatDayTime(iso: string | null | undefined, zone = PLANNER_TIME_ZONE): string {
  return iso ? `${formatter(zone,"day").format(new Date(iso))} ${formatter(zone,"time").format(new Date(iso))}` : "—";
}
export function formatTime(iso: string | null | undefined, zone = PLANNER_TIME_ZONE): string {
  return iso ? formatter(zone,"time").format(new Date(iso)) : "—";
}
function dateKey(iso: string, zone: string) { const parts = Object.fromEntries(formatter(zone,"date").formatToParts(new Date(iso)).map(p => [p.type,p.value])); return `${parts.year}-${parts.month}-${parts.day}`; }
export function formatWindow(w: { start: string; end: string } | null | undefined, zone = PLANNER_TIME_ZONE): string {
  if (!w) return "no window";
  return dateKey(w.start,zone) === dateKey(w.end,zone) ? `${formatDayTime(w.start,zone)}–${formatTime(w.end,zone)}` : `${formatDayTime(w.start,zone)} – ${formatDayTime(w.end,zone)}`;
}
// ER-03 compares calendar dates at destination, independent of the planner's zone.
export const londonDateKey = (iso: string) => dateKey(iso,CUSTOMER_TIME_ZONE);
export const formatCustomerDayTime = (iso: string | null | undefined) => formatDayTime(iso,CUSTOMER_TIME_ZONE);
export const formatCustomerWindow = (w: {start:string;end:string} | null | undefined) => formatWindow(w,CUSTOMER_TIME_ZONE);
export function toLocalInput(iso: string, zone = PLANNER_TIME_ZONE): string {
  const parts = Object.fromEntries(formatter(zone,"input").formatToParts(new Date(iso)).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
/** Resolve a wall clock only if it identifies exactly one instant. Never guess across DST gaps/overlaps. */
export function fromLocalInput(value: string, zone = PLANNER_TIME_ZONE): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Enter a complete local date and time.");
  const naive = Date.parse(`${value}:00Z`);
  if (!Number.isFinite(naive)) throw new Error("Invalid local date and time.");
  const offsets = new Set<number>();
  for (let h = -36; h <= 36; h += 6) {
    const probe = naive + h * 3600000;
    offsets.add(Date.parse(`${toLocalInput(new Date(probe).toISOString(),zone)}:00Z`) - probe);
  }
  const matches = [...offsets].map(offset => new Date(naive-offset).toISOString()).filter(iso=>toLocalInput(iso,zone)===value);
  if (matches.length !== 1) throw new Error("This local time is missing or ambiguous because the clocks change. Choose an unambiguous time and confirm it with the consignee.");
  return matches[0].replace(".000Z","Z");
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

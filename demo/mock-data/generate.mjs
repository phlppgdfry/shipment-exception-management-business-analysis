#!/usr/bin/env node
// Generates the deterministic, fictional dataset for the Logistics Control Tower demo.
//   node demo/mock-data/generate.mjs          writes the JSON files next to this script
//   node demo/mock-data/generate.mjs --check  fails when the committed files are out of date (used in CI)
//
// Everything here is fictional: customers, orders, sailings and times. The named orders reuse the
// prototype's cast (site/assets/seed-data.mjs) so that the two demos tell the same story.
// Times are stored in UTC ("Z"). The demo week is in winter, so UK local time equals UTC;
// continental times are UTC+1. The UI always formats in Europe/London (see DEF-01 in the BAT log).

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// --- deterministic helpers -------------------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260204);
const pick = (list) => list[Math.floor(rand() * list.length)];

// Demo week: Monday 2 February 2026. Day offsets: Mon 0 … Fri 4.
const DAY = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };
function at(day, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(2026, 1, 2 + DAY[day], h, m)).toISOString().replace(".000Z", "Z");
}
const addMinutes = (iso, minutes) => new Date(Date.parse(iso) + minutes * 60000).toISOString().replace(".000Z", "Z");

export const DEMO_START = at("Wed", "09:50");

// --- master data ------------------------------------------------------------------------------
const customers = [
  // Pilot group (feature on): five customers on BE-UK East and BE-UK South (D-07)
  { customerId: "C-NF", name: "Northfield Foods", keyAccount: true, pilot: true, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "transport@northfield.example" },
  { customerId: "C-KF", name: "Kestrel Forwarding", keyAccount: false, pilot: true, prefersAllUpdates: false, channel: "EDI", contactEmail: "ops@kestrel.example" },
  { customerId: "C-BW", name: "Brightwater Paper", keyAccount: false, pilot: true, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "planning@brightwater.example" },
  { customerId: "C-OT", name: "Oakridge Textiles", keyAccount: false, pilot: true, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "shipping@oakridge.example" },
  { customerId: "C-PM", name: "Pellow Medical Supplies", keyAccount: false, pilot: true, prefersAllUpdates: true, channel: "EMAIL", contactEmail: "logistics@pellow.example" },
  // Control group (shadow mode: exceptions logged, no messages — AC-13.1)
  { customerId: "C-MD", name: "Meadowline Dairy", keyAccount: false, pilot: false, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "dispatch@meadowline.example" },
  { customerId: "C-FH", name: "Fenwick Home", keyAccount: false, pilot: false, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "inbound@fenwick.example" },
  { customerId: "C-HG", name: "Harlow Garden Supplies", keyAccount: false, pilot: false, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "imports@harlow.example" },
  { customerId: "C-AS", name: "Arden Steel", keyAccount: false, pilot: false, prefersAllUpdates: false, channel: "EDI", contactEmail: "logistics@arden.example" },
  { customerId: "C-CR", name: "Calder Retail", keyAccount: true, pilot: false, prefersAllUpdates: false, channel: "PORTAL", contactEmail: "dc@calder.example" },
];

const TERMINALS = {
  BE: "Continental terminal (BE)",
  UKE: "UK East terminal",
  UKS: "UK South terminal",
};

const sailings = [
  { sailingId: "E-310", route: "BE-UK East", from: TERMINALS.BE, to: TERMINALS.UKE, departure: at("Tue", "20:00"), arrival: at("Wed", "04:00") },
  { sailingId: "S-415", route: "BE-UK South", from: TERMINALS.BE, to: TERMINALS.UKS, departure: at("Tue", "18:00"), arrival: at("Wed", "02:30") },
  { sailingId: "E-312", route: "BE-UK East", from: TERMINALS.BE, to: TERMINALS.UKE, departure: at("Wed", "12:00"), arrival: at("Wed", "20:00") },
  { sailingId: "S-417", route: "BE-UK South", from: TERMINALS.BE, to: TERMINALS.UKS, departure: at("Wed", "17:00"), arrival: at("Thu", "01:30") },
  { sailingId: "E-314", route: "BE-UK East", from: TERMINALS.BE, to: TERMINALS.UKE, departure: at("Wed", "22:00"), arrival: at("Thu", "06:00") },
  { sailingId: "S-419", route: "BE-UK South", from: TERMINALS.BE, to: TERMINALS.UKS, departure: at("Thu", "17:00"), arrival: at("Fri", "01:30") },
];
const sailingById = Object.fromEntries(sailings.map((s) => [s.sailingId, s]));

const CARGO = {
  REEFER_FOOD: { description: "Reefer · chilled food", unitType: "REEFER", timeCritical: true },
  REEFER_DAIRY: { description: "Reefer · dairy", unitType: "REEFER", timeCritical: true },
  PAPER: { description: "Trailer · paper reels", unitType: "TRAILER", timeCritical: false },
  GENERAL: { description: "Trailer · general cargo", unitType: "TRAILER", timeCritical: false },
  MEDICAL: { description: "Trailer · medical supplies (time-critical)", unitType: "TRAILER", timeCritical: true },
  TEXTILES: { description: "Trailer · textiles", unitType: "TRAILER", timeCritical: false },
  FURNITURE: { description: "Trailer · furniture", unitType: "TRAILER", timeCritical: false },
  GARDEN: { description: "Trailer · garden products", unitType: "TRAILER", timeCritical: false },
  STEEL: { description: "Flatbed · steel coils", unitType: "FLATBED", timeCritical: false },
  RETAIL: { description: "Trailer · retail goods", unitType: "TRAILER", timeCritical: false },
  CONTAINER: { description: "45' container · consumer goods", unitType: "CONTAINER", timeCritical: false },
};

const CONSIGNEES = {
  "C-NF": ["Northfield DC Doncaster", "Northfield DC Leeds"],
  "C-KF": ["Kestrel cross-dock Daventry", "Retail park consignee, Milton Keynes"],
  "C-BW": ["Brightwater mill Kent", "Printworks Basildon"],
  "C-OT": ["Oakridge warehouse Leicester"],
  "C-PM": ["Pellow hub Reading"],
  "C-MD": ["Meadowline depot York", "Meadowline depot Hull"],
  "C-FH": ["Fenwick store logistics, Bristol"],
  "C-HG": ["Harlow garden centre DC, Peterborough"],
  "C-AS": ["Arden fabrication, Sheffield"],
  "C-CR": ["Calder Retail DC Wakefield"],
};

// --- orders -------------------------------------------------------------------------------
// Named orders: the cast of the prototype. Day/time windows are UK local time (= UTC in this week).
const named = [
  { orderRef: "D2D-48213", customerId: "C-NF", sailingId: "E-312", cargo: "REEFER_FOOD", window: ["Thu", "06:00", "08:00"], eta: ["Thu", "06:40"], received: ["Mon", "15:12"], scenario: true },
  { orderRef: "D2D-48190", customerId: "C-BW", sailingId: "E-312", cargo: "PAPER", window: ["Thu", "06:00", "10:00"], eta: ["Thu", "06:20"], received: ["Mon", "16:44"] },
  { orderRef: "D2D-48177", customerId: "C-CR", sailingId: "E-312", cargo: "RETAIL", window: ["Thu", "08:00", "16:00"], eta: ["Thu", "08:30"], received: ["Tue", "08:01"] },
  { orderRef: "D2D-48199", customerId: "C-KF", sailingId: "E-312", cargo: "GENERAL", window: null, eta: ["Thu", "07:10"], received: ["Tue", "11:20"] },
  { orderRef: "D2D-48207", customerId: "C-MD", sailingId: "E-312", cargo: "REEFER_DAIRY", window: ["Thu", "07:00", "11:00"], eta: ["Thu", "07:30"], received: ["Tue", "09:05"] },
  { orderRef: "D2D-48302", customerId: "C-KF", sailingId: "S-417", cargo: "GENERAL", window: ["Thu", "09:00", "13:00"], eta: ["Thu", "10:15"], received: ["Mon", "11:03"] },
  { orderRef: "D2D-48309", customerId: "C-AS", sailingId: "S-417", cargo: "STEEL", window: ["Thu", "10:00", "14:00"], eta: ["Thu", "11:00"], received: ["Mon", "14:40"] },
  { orderRef: "D2D-48288", customerId: "C-PM", sailingId: "S-415", cargo: "MEDICAL", window: ["Wed", "12:00", "14:00"], eta: ["Wed", "12:50"], received: ["Mon", "09:30"], lastStatusAt: ["Wed", "03:05"] },
  { orderRef: "D2D-48261", customerId: "C-MD", sailingId: "E-310", cargo: "REEFER_DAIRY", window: ["Wed", "09:00", "10:00"], eta: ["Wed", "09:20"], received: ["Mon", "14:00"], stillOnRoad: true },
  { orderRef: "D2D-48222", customerId: "C-FH", sailingId: "S-415", cargo: "FURNITURE", window: ["Wed", "11:00", "13:00"], eta: ["Wed", "11:30"], received: ["Mon", "10:21"], heldAtTerminal: true },
  { orderRef: "D2D-48231", customerId: "C-OT", sailingId: "S-415", cargo: "TEXTILES", window: ["Wed", "08:00", "10:00"], eta: ["Wed", "09:00"], received: ["Mon", "08:15"], stillOnRoad: true },
  { orderRef: "D2D-48240", customerId: "C-HG", sailingId: "E-310", cargo: "GARDEN", window: ["Wed", "14:00", "17:00"], eta: ["Wed", "14:30"], received: ["Mon", "13:02"], heldAtTerminal: true },
  { orderRef: "D2D-48255", customerId: "C-AS", sailingId: "S-415", cargo: "STEEL", window: ["Wed", "09:00", "11:00"], eta: ["Wed", "10:15"], received: ["Mon", "12:12"] },
];

// Filler orders: on time, spread over sailings and statuses, so that "only the exceptions surface" is visible.
const fillerPlan = [
  // On the delayed sailing E-312, with windows wide or late enough to absorb +6 h (ER-01: no exception)
  ...Array.from({ length: 6 }, () => ({ sailingId: "E-312", windowDay: "Thu", windowFrom: pick(["08:00", "09:00"]), widthH: pick([9, 10]), etaOffsetFromWindowStart: pick([30, 45, 60]) })),
  // Already sailed overnight, delivering today on time
  ...Array.from({ length: 5 }, () => ({ sailingId: pick(["E-310", "S-415"]), windowDay: "Wed", windowFrom: pick(["13:00", "14:00", "15:00", "16:00"]), widthH: pick([2, 3, 4]), etaOffsetFromWindowStart: pick([20, 30, 45]) })),
  // Delivered this morning
  ...Array.from({ length: 5 }, () => ({ sailingId: pick(["E-310", "S-415"]), windowDay: "Wed", windowFrom: pick(["06:00", "07:00", "08:00"]), widthH: 2, etaOffsetFromWindowStart: pick([15, 30, 40]) })),
  // Later sailings, not yet at the terminal
  ...Array.from({ length: 6 }, () => ({ sailingId: pick(["E-314", "S-419"]), windowDay: "Fri", windowFrom: pick(["06:00", "08:00", "10:00"]), widthH: pick([2, 4]), etaOffsetFromWindowStart: pick([30, 50, 70]) })),
  // Late afternoon sailing S-417 (cancelled later this morning) — only two named orders on it
];

const orders = [];
let refCounter = 48400;
for (const n of named) {
  orders.push(buildOrder({
    orderRef: n.orderRef,
    customerId: n.customerId,
    sailingId: n.sailingId,
    cargo: CARGO[n.cargo],
    windowStart: n.window ? at(n.window[0], n.window[1]) : null,
    windowEnd: n.window ? at(n.window[0], n.window[2]) : null,
    plannedEta: at(n.eta[0], n.eta[1]),
    received: at(n.received[0], n.received[1]),
    lastStatusAt: n.lastStatusAt ? at(n.lastStatusAt[0], n.lastStatusAt[1]) : null,
    heldAtTerminal: Boolean(n.heldAtTerminal),
    stillOnRoad: Boolean(n.stillOnRoad),
    scenario: Boolean(n.scenario),
  }));
}
const fillerCustomers = customers.map((c) => c.customerId);
const fillerCargo = ["GENERAL", "PAPER", "TEXTILES", "FURNITURE", "RETAIL", "CONTAINER", "GARDEN"];
for (const f of fillerPlan) {
  refCounter += 1 + Math.floor(rand() * 7);
  const windowStart = at(f.windowDay, f.windowFrom);
  const windowEnd = addMinutes(windowStart, f.widthH * 60);
  const customerId = pick(fillerCustomers);
  orders.push(buildOrder({
    orderRef: `D2D-${refCounter}`,
    customerId,
    sailingId: f.sailingId,
    cargo: CARGO[pick(fillerCargo)],
    windowStart,
    windowEnd,
    plannedEta: addMinutes(windowStart, f.etaOffsetFromWindowStart),
    received: addMinutes(sailingById[f.sailingId].departure, -(48 + Math.floor(rand() * 30)) * 60),
    lastStatusAt: null,
    heldAtTerminal: false,
    scenario: false,
  }));
}
orders.sort((a, b) => a.orderRef.localeCompare(b.orderRef));
const refs = new Set(orders.map((o) => o.orderRef));
if (refs.size !== orders.length) throw new Error("Duplicate order references in the generated data");

function buildOrder(o) {
  const s = sailingById[o.sailingId];
  const customer = customers.find((c) => c.customerId === o.customerId);
  const consignee = CONSIGNEES[o.customerId][Math.floor(rand() * CONSIGNEES[o.customerId].length)];
  const collected = addMinutes(s.departure, -8 * 60);
  const gateIn = addMinutes(s.departure, -4 * 60);
  const gateOut = addMinutes(s.arrival, o.heldAtTerminal ? 4 * 60 : 60);
  const outForDelivery = addMinutes(o.plannedEta, -150) > gateOut ? addMinutes(o.plannedEta, -150) : gateOut;
  const milestoneTemplate = [
    ["ORDER_RECEIVED", "Order received", o.received, `${customer.channel === "EDI" ? "EDI" : customer.channel === "EMAIL" ? "e-mail" : "portal"}`],
    ["COLLECTED", "Collected at shipper", collected, "Shipper, Belgium"],
    ["GATE_IN_ORIGIN", "Gated in at terminal", gateIn, s.from],
    ["SAILED", `Sailed on ${s.sailingId}`, s.departure, s.from],
    ["ARRIVED_DESTINATION", "Arrived at UK terminal", s.arrival, s.to],
    ["GATE_OUT_DESTINATION", "Gated out", gateOut, s.to],
    ["OUT_FOR_DELIVERY", "Out for delivery", outForDelivery, "UK road leg"],
    ["DELIVERED", "Delivered", o.plannedEta, consignee],
  ];
  // A milestone has an actual time when it was planned before the demo start, unless status went missing or the unit is held.
  const lastKnown = o.lastStatusAt ?? DEMO_START;
  const milestones = milestoneTemplate.map(([code, label, plannedAt, location]) => {
    let reached = plannedAt <= lastKnown;
    if (o.heldAtTerminal && (code === "GATE_OUT_DESTINATION" || code === "OUT_FOR_DELIVERY" || code === "DELIVERED")) reached = false;
    // Delayed on the delivery leg: the morning events below explain why it has not arrived yet.
    if (o.stillOnRoad && code === "DELIVERED") reached = false;
    return { code, label, plannedAt, actualAt: reached ? plannedAt : null, location };
  });
  const reached = milestones.filter((m) => m.actualAt);
  const status = statusFrom(reached.length ? reached[reached.length - 1].code : "BOOKED");
  return {
    orderRef: o.orderRef,
    customerId: o.customerId,
    route: s.route,
    sailingId: o.sailingId,
    cargo: o.cargo,
    consignee,
    deliveryWindow: o.windowStart ? { start: o.windowStart, end: o.windowEnd } : null,
    plannedEta: o.plannedEta,
    eta: o.plannedEta,
    status,
    lastStatusAt: o.lastStatusAt ?? (reached.length ? reached[reached.length - 1].actualAt : o.received),
    legs: [
      { mode: "ROAD", from: "Shipper, Belgium", to: s.from, plannedDeparture: collected, plannedArrival: gateIn, operator: "Subcontracted haulier (BE)" },
      { mode: "SEA", from: s.from, to: s.to, plannedDeparture: s.departure, plannedArrival: s.arrival, operator: `Sailing ${s.sailingId}` },
      { mode: "ROAD", from: s.to, to: consignee, plannedDeparture: outForDelivery, plannedArrival: o.plannedEta, operator: "Subcontracted haulier (UK)" },
    ],
    milestones,
    scenarioOrder: o.scenario,
  };
}

function statusFrom(code) {
  return {
    BOOKED: "BOOKED",
    ORDER_RECEIVED: "BOOKED",
    COLLECTED: "COLLECTED",
    GATE_IN_ORIGIN: "AT_ORIGIN_TERMINAL",
    SAILED: "AT_SEA",
    ARRIVED_DESTINATION: "AT_DESTINATION_TERMINAL",
    GATE_OUT_DESTINATION: "ON_DELIVERY_LEG",
    OUT_FOR_DELIVERY: "ON_DELIVERY_LEG",
    DELIVERED: "DELIVERED",
  }[code];
}

// --- events -------------------------------------------------------------------------------
// Morning events: already happened before the demo starts. The app replays them through the same
// engine at start-up, so every exception on screen was produced by the rules, not typed in.
const morningEvents = [
  { eventId: "EVT-0830-HG-CUSTOMS", type: "CUSTOMS_HOLD_PLACED", occurredAt: at("Wed", "08:30"), source: "Customs broker via TMS", orderRef: "D2D-48240", reason: "Import declaration incomplete: commodity code missing" },
  { eventId: "EVT-0915-FH-TERMINAL", type: "TERMINAL_DELAYED", occurredAt: at("Wed", "09:15"), source: "Terminal operating system", orderRef: "D2D-48222", newEta: at("Wed", "15:20"), reason: "Yard congestion at UK South terminal" },
  { eventId: "EVT-0915-OT-ROAD", type: "ROAD_ETA_UPDATED", occurredAt: at("Wed", "09:15"), source: "Haulier app", orderRef: "D2D-48231", newEta: at("Wed", "13:30"), reason: "Breakdown, replacement tractor on its way" },
  { eventId: "EVT-0935-MD-ROAD", type: "ROAD_ETA_UPDATED", occurredAt: at("Wed", "09:35"), source: "Haulier app", orderRef: "D2D-48261", newEta: at("Wed", "11:00"), reason: "Traffic on the delivery leg" },
  { eventId: "EVT-0938-S417-CANCEL", type: "SAILING_CANCELLED", occurredAt: at("Wed", "09:38"), source: "Booking & sailing system", sailingId: "S-417", replacementSailingId: "S-419", delayMinutes: 24 * 60, reason: "Weather: sailing cancelled, cargo moved to next sailing" },
  { eventId: "EVT-0945-OT-ROAD", type: "ROAD_ETA_UPDATED", occurredAt: at("Wed", "09:45"), source: "Haulier app", orderRef: "D2D-48231", newEta: at("Wed", "13:50"), reason: "Replacement tractor 20 min later than announced" },
  { eventId: "EVT-0948-AS-ROAD", type: "ROAD_ETA_UPDATED", occurredAt: at("Wed", "09:48"), source: "Haulier e-mail, keyed by planner", orderRef: "D2D-48255", newEta: at("Wed", "12:10"), reason: "Road works on the delivery route" },
  { eventId: "EVT-0950-PM-STATUS", type: "STATUS_OVERDUE", occurredAt: at("Wed", "09:50"), source: "Exception component heartbeat", orderRef: "D2D-48288", reason: "No status from the haulier since 03:05 (departed UK terminal)" },
];

// Commands people already gave this morning.
const morningCommands = [
  { at: at("Wed", "09:25"), command: "acknowledge", orderRef: "D2D-48231", actor: "USR-PLANNER" },
];

// The guided scenario (see demo/README.md). Step 2 publishes this event.
const scenario = {
  orderRef: "D2D-48213",
  delayEvent: { eventId: "EVT-0952-E312-DELAY", type: "SAILING_DELAYED", occurredAt: at("Wed", "09:52"), source: "Booking & sailing system", sailingId: "E-312", delayMinutes: 360, reason: "Technical inspection: departure 18:00 instead of 12:00" },
  assignTo: "USR-PLANNER",
  responseAction: "Called the consignee's goods-in desk: a new slot Thu 13:00–15:00 is possible.",
  messageNote: "We have asked your DC for a new slot this afternoon and will confirm shortly.",
  newWindow: { start: at("Thu", "13:00"), end: at("Thu", "15:00") },
  resolveReason: "NEW_WINDOW_AGREED",
};

const users = [
  { userId: "USR-PLANNER", name: "Maren Vos", role: "ROAD_PLANNER", ownerGroup: "ROAD_PLANNING", title: "Senior road planner, UK delivery" },
  { userId: "USR-PLANNER-2", name: "Tom Ellis", role: "ROAD_PLANNER", ownerGroup: "ROAD_PLANNING", title: "Road planner" },
  { userId: "USR-SHIFTLEAD", name: "Priya Raman", role: "SHIFT_LEAD", ownerGroup: "ROAD_PLANNING", title: "Road planning shift lead" },
  { userId: "USR-TERMINAL", name: "Jonas Peeters", role: "TERMINAL_OPERATOR", ownerGroup: "TERMINAL_OPS", title: "Terminal operations coordinator" },
  { userId: "USR-CUSTOMS", name: "Leen Martens", role: "CUSTOMS_AGENT", ownerGroup: "CUSTOMS_DESK", title: "Customs desk" },
  { userId: "USR-CS", name: "Sara Haddad", role: "CS_AGENT", ownerGroup: null, title: "Customer service agent" },
];

const files = {
  "customers.json": customers,
  "sailings.json": sailings,
  "shipments.json": orders,
  "users.json": users,
  "scenario.json": { demoStart: DEMO_START, morningEvents, morningCommands, scenario },
};

const check = process.argv.includes("--check");
let stale = [];
for (const [name, data] of Object.entries(files)) {
  const text = JSON.stringify(data, null, 2) + "\n";
  const path = join(here, name);
  if (check) {
    let current = "";
    try { current = readFileSync(path, "utf8"); } catch { /* missing */ }
    if (current !== text) stale.push(name);
  } else {
    writeFileSync(path, text);
  }
}
if (check) {
  if (stale.length) {
    console.error(`Mock data out of date: ${stale.join(", ")}. Run: node demo/mock-data/generate.mjs`);
    process.exit(1);
  }
  console.log("Mock data up to date.");
} else {
  console.log(`Wrote ${Object.keys(files).length} files, ${orders.length} orders.`);
}

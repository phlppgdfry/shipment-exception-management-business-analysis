// Demo data for the prototype. Fictional orders, customers and times — not real company data.
// "late" is always measured against the END of the agreed delivery window.
// opened: minute (since Wed 00:00) the exception was opened; replanWindow: the window a planner can agree with the consignee.

// Demo clock in minutes since Wednesday 00:00. The prototype starts at 09:55.
export const DEMO_START = 9 * 60 + 55;

const base = { nextDay: false, timeCritical: false, keyAccount: false, prefersAllUpdates: false, statusConfirmed: false, lastNotifiedSeverity: null, minutesSinceLastNotice: null };

export const SEED_ORDERS = [
  {
    ref: "D2D-48213", opened: 593, replanWindow: "Thu 13:00–15:00", customer: "Northfield Foods", contact: "transport@northfield.example", keyAccount: true,
    route: "BE-UK East", cargo: "Reefer · chilled food", leg: "At continental terminal, loaded",
    window: "Thu 06:00–08:00", plannedEta: "Thu 06:40", newEta: "Thu 13:10",
    causeText: "Sailing Wed 12:00 departs 18:00 (+6 h, technical inspection)",
    change: { ...base, cause: "SAILING_DELAY", minutesLate: 310, timeCritical: true, keyAccount: true },
    timeline: ["Mon 15:12 Order received (portal)", "Tue 18:40 Collected", "Wed 06:55 Gated in at continental terminal", "Wed 09:52 Sailing delay published: +6 h"],
  },
  {
    ref: "D2D-48302", opened: 578, replanWindow: "Fri 09:00–13:00", customer: "Kestrel Forwarding", contact: "ops@kestrel.example", keyAccount: false, integration: "EDI",
    route: "BE-UK South", cargo: "Trailer · general cargo", leg: "At continental terminal",
    window: "Thu 09:00–13:00", plannedEta: "Thu 10:15", newEta: "Fri 10:15 (next sailing)",
    causeText: "Sailing Wed 17:00 cancelled (weather)",
    change: { ...base, cause: "SAILING_CANCELLED", minutesLate: 1275, nextDay: true },
    timeline: ["Mon 11:03 Order received (EDI)", "Wed 07:20 Gated in at continental terminal", "Wed 09:38 Sailing cancelled"],
  },
  {
    ref: "D2D-48288", opened: 590, replanWindow: "Wed 14:30–16:00", customer: "Pellow Medical Supplies", contact: "logistics@pellow.example", keyAccount: false,
    route: "BE-UK South", cargo: "Trailer · time-critical", leg: "UK road leg, haulier subcontracted",
    window: "Wed 12:00–14:00", plannedEta: "Wed 12:50", newEta: "unknown",
    causeText: "No status from the haulier since 03:05 (departed UK terminal)",
    change: { ...base, cause: "STATUS_MISSING", minutesLate: 0, timeCritical: true },
    timeline: ["Mon 09:30 Order received (e-mail)", "Tue 22:10 Sailed", "Wed 03:05 Departed UK terminal", "Wed 09:50 No status since 03:05"],
  },
  {
    ref: "D2D-48190", opened: 593, replanWindow: "Thu 12:00–14:00", customer: "Brightwater Paper", contact: "planning@brightwater.example", keyAccount: false,
    route: "BE-UK East", cargo: "Trailer · paper reels", leg: "At continental terminal, loaded",
    window: "Thu 06:00–10:00", plannedEta: "Thu 06:20", newEta: "Thu 12:20",
    causeText: "Same delayed sailing (+6 h)",
    change: { ...base, cause: "SAILING_DELAY", minutesLate: 140 },
    timeline: ["Mon 16:44 Order received (portal)", "Wed 05:10 Gated in", "Wed 09:52 Sailing delay published: +6 h"],
  },
  {
    ref: "D2D-48261", opened: 576, replanWindow: "Wed 10:45–11:30", customer: "Meadowline Dairy", contact: "dispatch@meadowline.example", keyAccount: false,
    route: "BE-UK East", cargo: "Reefer · dairy", leg: "UK delivery leg, on the road",
    window: "Wed 09:00–10:00", plannedEta: "Wed 09:20", newEta: "Wed 11:00",
    causeText: "Haulier stuck in traffic on the delivery leg",
    change: { ...base, cause: "ROAD_DELAY", minutesLate: 60, timeCritical: true },
    timeline: ["Mon 14:00 Order received (portal)", "Wed 04:50 Departed UK terminal", "Wed 09:35 Haulier: delayed, ETA 11:00"],
  },
  {
    ref: "D2D-48222", opened: 556, replanWindow: "Wed 15:00–17:00", customer: "Fenwick Home", contact: "inbound@fenwick.example", keyAccount: false,
    route: "BE-UK South", cargo: "Trailer · furniture", leg: "UK terminal, awaiting discharge",
    window: "Wed 11:00–13:00", plannedEta: "Wed 11:30", newEta: "Wed 15:20",
    causeText: "Yard congestion at UK terminal, trailer not yet available",
    change: { ...base, cause: "TERMINAL_DELAY", minutesLate: 140 },
    timeline: ["Mon 10:21 Order received (portal)", "Tue 22:10 Sailed", "Wed 06:40 Arrived UK terminal", "Wed 09:15 Terminal: discharge delayed"],
  },
  {
    ref: "D2D-48231", opened: 555, replanWindow: "Wed 13:30–15:00", initialState: "ACKNOWLEDGED", customer: "Oakridge Textiles", contact: "shipping@oakridge.example", keyAccount: false,
    route: "BE-UK South", cargo: "Trailer · textiles", leg: "UK road leg",
    window: "Wed 08:00–10:00", plannedEta: "Wed 09:00", newEta: "Wed 13:50",
    causeText: "ETA slipped again by 20 min; customer told at 09:20 (major)",
    change: { ...base, cause: "ROAD_DELAY", minutesLate: 230, lastNotifiedSeverity: "MAJOR", minutesSinceLastNotice: 35 },
    notifiedAt: "Wed 09:20",
    timeline: ["Mon 08:15 Order received (portal)", "Wed 05:30 Departed UK terminal", "Wed 09:15 Haulier: breakdown, replacement tractor", "Wed 09:20 Customer notified (major)", "Wed 09:54 ETA updated: 13:50"],
  },
  {
    ref: "D2D-48240", opened: 510, replanWindow: "Wed 16:00–18:00", customer: "Harlow Garden Supplies", contact: "imports@harlow.example", keyAccount: false,
    route: "BE-UK East", cargo: "Trailer · garden products", leg: "UK terminal, customs",
    window: "Wed 14:00–17:00", plannedEta: "Wed 14:30", newEta: "after customs release",
    causeText: "Import declaration incomplete: commodity code missing",
    change: { ...base, cause: "CUSTOMS_HOLD", minutesLate: 0 },
    release: "R2",
    timeline: ["Mon 13:02 Order received (portal)", "Wed 06:40 Arrived UK terminal", "Wed 08:30 Customs hold"],
  },
  {
    ref: "D2D-48255", opened: 589, replanWindow: "Wed 12:00–13:00", customer: "Arden Steel", contact: "logistics@arden.example", keyAccount: false,
    route: "BE-UK South", cargo: "Flatbed trailer · steel coils", leg: "Delivery leg, on the road",
    window: "Wed 09:00–11:00", plannedEta: "Wed 10:15", newEta: "Wed 12:10",
    causeText: "Road works on the delivery route",
    change: { ...base, cause: "ROAD_DELAY", minutesLate: 70 },
    timeline: ["Mon 12:12 Order received (EDI)", "Wed 06:00 Departed UK terminal", "Wed 09:48 Haulier: ETA 12:10"],
  },
  {
    ref: "D2D-48177", opened: null, replanWindow: null, customer: "Calder Retail", contact: "dc@calder.example", keyAccount: true,
    route: "BE-UK East", cargo: "Trailer · retail goods", leg: "At continental terminal, loaded",
    window: "Thu 08:00–16:00", plannedEta: "Thu 08:30", newEta: "Thu 14:30",
    causeText: "Same delayed sailing (+6 h) — still inside the wide window",
    change: { ...base, cause: "SAILING_DELAY", minutesLate: -90, keyAccount: true },
    timeline: ["Tue 08:01 Order received (portal)", "Wed 06:30 Gated in", "Wed 09:52 Sailing delay published: +6 h"],
  },
];

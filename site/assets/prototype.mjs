// Clickable prototype of the planner workbench and the customer view.
// Client-side only: fictional seed data, the real rule module, state in localStorage. No backend, no real messages.
import { evaluate, RULE_TEXT } from "./exception-rules.mjs";
import { SEED_ORDERS, DEMO_START } from "./seed-data.mjs";

const STORE = "sem-prototype-v1";
const MY_GROUP = "ROAD_PLANNING";
const RANK = { NONE: 0, MINOR: 1, MAJOR: 2, CRITICAL: 3 };
const OWNER_LABEL = { ROAD_PLANNING: "Road planning", TERMINAL_OPS: "Terminal operations", CUSTOMS_DESK: "Customs desk" };
const CAUSE_LABEL = {
  SAILING_DELAY: "Sailing delayed", SAILING_CANCELLED: "Sailing cancelled", ROAD_DELAY: "Road transport delayed",
  TERMINAL_DELAY: "Terminal delay", CUSTOMS_HOLD: "Customs hold", STATUS_MISSING: "Status missing", RECOVERED: "Back on schedule",
};
const NOTIF_LABEL = {
  NONE: "No message (monitored)", NOTIFY: "Customer message", NOTIFY_AND_CALL: "Message + call task for customer service", ACTION_REQUIRED: "Customer asked to act",
  HOLD: "Held until a planner confirms", SUPPRESSED: "No new message (told recently)", NOTIFY_RECOVERY: "'Back on schedule' message",
};
const REASONS = ["New window agreed", "Delivered in window", "Customer informed, no action", "False alarm", "Other"];

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const hhmm = (m) => `${String(Math.floor((m % 1440) / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const stamp = (m) => `Wed ${hhmm(m)}`;

let S; // state

function fresh() {
  const orders = SEED_ORDERS.map((o) => {
    const r = evaluate(o.change);
    const x = { ...structuredClone(o), result: r, state: "NONE", messages: [], notes: [], ackBy: null, reason: null, pending: null, callTask: false, due: null, escalated: false };
    if (!r.exception) return x;
    x.state = o.initialState ?? (r.notification === "HOLD" ? "HELD" : "OPEN");
    x.due = r.responseSlaMinutes ? o.opened + r.responseSlaMinutes : null;
    if (o.initialState === "ACKNOWLEDGED") x.ackBy = "Night-shift planner";
    return x;
  });
  const s = { clock: DEMO_START, view: "workbench", selected: "D2D-48213", orders, log: [] };
  // Replay what happened before the demo starts, so the log tells the story.
  log(s, 593 - 1, "Sailing system", "Sailing BE-UK East Wed 12:00 delayed +6 h (technical inspection). 20 door-to-door orders on board.");
  log(s, 593, "Rules", "20 orders re-evaluated: 2 exceptions (D2D-48213 critical, D2D-48190 major), 18 still inside their window.");
  for (const x of orders.filter((o) => o.result.exception)) {
    if (x.ref === "D2D-48231") {
      x.messages.push({ at: 560, kind: "NOTIFY", severity: "MAJOR", subject: subject(x, "MAJOR"), body: body(x, "MAJOR", ""), channels: "e-mail + portal" });
      log(s, 560, "Notification", `D2D-48231 Oakridge Textiles: message sent (major).`);
      log(s, 594, "Rules", `D2D-48231 ETA updated 13:50: still major, customer told 35 min ago → no new message (ER-12).`);
      x.lastNoticeAt = 560;
      continue;
    }
    if (x.release === "R2") {
      log(s, x.opened, "Rules", `${x.ref} ${x.customer}: customs hold → owner customs desk. Release 2 preview: no customer message in the pilot; the customs desk works as today.`);
      continue;
    }
    log(s, x.opened, "Rules", `${x.ref} ${x.customer}: ${x.result.severity.toLowerCase()} ${CAUSE_LABEL[x.result.type].toLowerCase()}, owner ${OWNER_LABEL[x.result.owner]}, ${NOTIF_LABEL[x.result.notification].toLowerCase()}.`);
    queueMessage(s, x, x.opened);
  }
  tick(s, 0);
  return s;
}

function log(s, at, src, text) {
  s.log.push({ at, src, text, seq: s.log.length });
}

function subject(x, severity) {
  if (severity === "RECOVERY") return `Back on schedule: ${x.ref} — new delivery window ${x.window}`;
  if (x.result.type === "CUSTOMS_HOLD") return `Action needed: ${x.ref} is held by customs`;
  return `Delivery ${x.ref}: new ETA ${x.newEta} (agreed window ${x.window})`;
}

function body(x, severity, note) {
  const hello = `Dear ${x.customer} team,`;
  const sign = "Tidewell Logistics — customer service\n(fictional organisation · demo message)";
  if (severity === "RECOVERY") {
    return `${hello}\n\nGood news about delivery ${x.ref} (${x.cargo}): a new delivery window has been agreed with the consignee.\n\nNew delivery window: ${x.window} (local time)\n\nNo action is needed from you.\n\n${sign}`;
  }
  if (x.result.type === "CUSTOMS_HOLD") {
    return `${hello}\n\nDelivery ${x.ref} is held by customs at the UK terminal.\nWhat is missing: commodity code on the import declaration.\nPlease send it to your customs broker or reply to this message.\n\n${sign}`;
  }
  const next = x.result.type === "SAILING_CANCELLED"
    ? "Your unit is rebooked on the next sailing. Our planner is agreeing a new delivery slot with the consignee."
    : "Our planner is agreeing a new delivery slot with the consignee. You will hear from us again if anything changes.";
  return `${hello}\n\nYour delivery ${x.ref} (${x.cargo}) will arrive after the agreed delivery window.\n\nAgreed window: ${x.window} (local time)\nNew expected delivery: ${x.newEta}\nReason: ${CAUSE_LABEL[x.result.type].toLowerCase()}\nWhat we are doing: ${next}${note ? `\n\nNote from your planner: ${note}` : ""}\n\n${sign}`;
}

// D-08: critical messages wait 5 minutes for a planner note, other notifications go out at once.
function queueMessage(s, x, at) {
  const n = x.result.notification;
  if (n === "NOTIFY" || n === "NOTIFY_AND_CALL" || n === "ACTION_REQUIRED") {
    if (x.result.severity === "CRITICAL") {
      x.pending = { sendAt: at + 5 };
      log(s, at, "Workbench", `${x.ref}: critical message ready; sends automatically at ${hhmm(at + 5)} unless a planner adds a note.`);
    } else {
      send(s, x, at, "");
    }
  }
}

function send(s, x, at, note) {
  const sev = x.result.severity;
  x.messages.push({ at, kind: x.result.notification, severity: sev, subject: subject(x, sev), body: body(x, sev, note), channels: "e-mail + portal" });
  x.change.lastNotifiedSeverity = sev;
  x.change.minutesSinceLastNotice = 0;
  x.lastNoticeAt = at;
  x.pending = null;
  log(s, at, "Notification", `${x.ref} ${x.customer}: e-mail sent to ${x.contact} and portal message posted (${sev.toLowerCase()}).`);
  if (x.integration === "EDI") log(s, at, "Notification", `${x.ref}: EDI status message for this customer comes in release 2; e-mail + portal used in the pilot.`);
  if (x.result.notification === "NOTIFY_AND_CALL" && !x.callTask) {
    x.callTask = true;
    log(s, at, "CS queue", `${x.ref}: call task created — call ${x.customer} (key account) about the critical delay.`);
  }
}

function tick(s, minutes) {
  s.clock += minutes;
  for (const x of s.orders) {
    if (x.pending && s.clock >= x.pending.sendAt) send(s, x, x.pending.sendAt, "");
    if (x.state === "OPEN" && x.due && s.clock > x.due && !x.escalated) {
      x.escalated = true;
      x.state = "ESCALATED";
      log(s, x.due, "Workbench", `${x.ref}: not acknowledged within ${x.result.responseSlaMinutes} min → escalated to the shift lead (ER-09).`);
    }
  }
}

function reevaluate(s, x, why, closeReason) {
  if (x.lastNoticeAt != null) x.change.minutesSinceLastNotice = s.clock - x.lastNoticeAt;
  const before = x.result;
  x.result = evaluate(x.change);
  log(s, s.clock, "Rules", `${x.ref} re-evaluated after ${why}: ${x.result.type === "RECOVERED" ? "back inside the window" : x.result.severity.toLowerCase()} → ${NOTIF_LABEL[x.result.notification].toLowerCase()} (${x.result.rules.join(", ")}).`);
  if (x.result.type === "RECOVERED") {
    x.state = "RECOVERED";
    x.pending = null;
    x.messages.push({ at: s.clock, kind: "NOTIFY_RECOVERY", severity: "RECOVERY", subject: subject(x, "RECOVERY"), body: body(x, "RECOVERY", ""), channels: "e-mail + portal" });
    log(s, s.clock, "Notification", `${x.ref}: 'back on schedule' message sent (ER-13).`);
  } else if (!x.result.exception) {
    x.state = "RESOLVED";
    x.reason = closeReason;
    x.pending = null;
    log(s, s.clock, "Workbench", `${x.ref}: closed without customer message (reason: ${closeReason.toLowerCase()}).`);
  } else {
    if (x.state === "HELD") x.state = "ACKNOWLEDGED";
    if (RANK[x.result.severity] !== RANK[before.severity] && x.result.responseSlaMinutes) x.due = s.clock + x.result.responseSlaMinutes;
    queueMessage(s, x, s.clock);
  }
}

const actions = {
  ack(x) {
    tick(S, 1);
    x.state = "ACKNOWLEDGED";
    x.ackBy = "You (road planner)";
    log(S, S.clock, "Workbench", `${x.ref}: acknowledged by the road planner${x.escalated ? " after escalation" : ""}.`);
  },
  send(x) {
    tick(S, 1);
    const note = ($("#note")?.value || "").trim();
    if (note) x.notes.push(note);
    send(S, x, S.clock, note);
  },
  replan(x) {
    tick(S, 3);
    x.window = x.replanWindow;
    x.change.minutesLate = -30;
    x.change.nextDay = false;
    log(S, S.clock, "TMS", `${x.ref}: new delivery window ${x.window} agreed with the consignee and saved in the TMS.`);
    if (x.state === "OPEN" || x.state === "ESCALATED") { x.state = "ACKNOWLEDGED"; x.ackBy = "You (road planner)"; }
    reevaluate(S, x, "the new window", "New window agreed before the customer was told");
  },
  onTime(x) {
    tick(S, 4);
    log(S, S.clock, "Workbench", `${x.ref}: planner called the haulier — truck on time, app was not updated.`);
    x.change.statusConfirmed = true;
    x.change.minutesLate = -20;
    x.newEta = "Wed 13:40";
    reevaluate(S, x, "confirmation 'on time'", "False alarm");
  },
  delay(x) {
    tick(S, 4);
    log(S, S.clock, "Workbench", `${x.ref}: planner called the haulier — breakdown, new ETA 16:30.`);
    x.change.statusConfirmed = true;
    x.change.minutesLate = 150;
    x.newEta = "Wed 16:30";
    reevaluate(S, x, "confirmation 'delayed'", "False alarm");
  },
  resolve(x) {
    const reason = $("#reason")?.value;
    const note = ($("#resolve-note")?.value || "").trim();
    if (!reason) return flashMsg("Choose a reason first (AC-04.3).");
    if (reason === "Other" && !note) return flashMsg("'Other' needs a note (AC-04.3).");
    tick(S, 1);
    x.state = "RESOLVED";
    x.reason = reason + (note ? ` — ${note}` : "");
    x.pending = null;
    log(S, S.clock, "Workbench", `${x.ref}: resolved, reason "${x.reason}". Logged for the pilot export.`);
  },
};

function flashMsg(text) {
  const el = $("#detail-msg");
  if (el) { el.textContent = text; el.classList.remove("hidden"); }
}

// ---------- rendering ----------
function sortKey(x) {
  const open = !["RESOLVED", "NONE"].includes(x.state);
  return [open ? 0 : 1, -(RANK[x.result.severity] ?? 0), x.due ?? 99999];
}
function byPriority(a, b) {
  const ka = sortKey(a), kb = sortKey(b);
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
  return 0;
}

function dueText(x) {
  if (x.state === "HELD" && x.due) return { text: `confirm by ${hhmm(x.due)}`, late: S.clock > x.due };
  if (["ACKNOWLEDGED", "RECOVERED"].includes(x.state)) return { text: x.state === "RECOVERED" ? "recovered" : "acknowledged", late: false };
  if (x.state === "RESOLVED") return { text: "resolved", late: false };
  if (x.state === "ESCALATED") return { text: "escalated", late: true };
  if (!x.due) return { text: "monitor", late: false };
  const left = x.due - S.clock;
  return { text: left >= 0 ? `due ${hhmm(x.due)} · ${left} min` : `overdue ${-left} min`, late: left < 0 };
}

function row(x) {
  const d = dueText(x);
  const sev = x.state === "RECOVERED" ? "NONE" : x.result.severity;
  return `<li><button type="button" class="xrow ${x.state === "RESOLVED" ? "done" : ""}" data-ref="${x.ref}" aria-current="${S.selected === x.ref}">
    <span><span class="chip sev-${sev}">${x.state === "RECOVERED" ? "recovered" : sev === "NONE" ? "closed" : sev.toLowerCase()}</span></span>
    <span class="who">${esc(x.customer)}${x.keyAccount ? ' <span class="chip">key</span>' : ""}</span>
    <span class="due ${d.late ? "late" : ""}">${esc(d.text)}</span>
    <span class="what"><span class="ref">${x.ref}</span> · ${esc(CAUSE_LABEL[x.result.type] ?? "")} · ${x.state === "HELD" ? "held" : esc(NOTIF_LABEL[x.result.notification]).toLowerCase()}${x.release === "R2" ? " · release 2 preview" : ""}</span>
  </button></li>`;
}

function renderList() {
  const exc = S.orders.filter((x) => x.result.exception || ["RECOVERED", "RESOLVED"].includes(x.state));
  const mine = exc.filter((x) => (x.result.owner ?? MY_GROUP) === MY_GROUP && x.state !== "RESOLVED").sort(byPriority);
  const others = exc.filter((x) => x.result.owner && x.result.owner !== MY_GROUP && x.state !== "RESOLVED").sort(byPriority);
  const done = exc.filter((x) => x.state === "RESOLVED");
  const quiet = S.orders.filter((x) => !x.result.exception && x.state === "NONE");
  $("#list").innerHTML = `
    <div class="panel-h"><h2>Road planning — my exceptions</h2><span class="small">${mine.length} open</span></div>
    <ul class="xlist">${mine.map(row).join("")}</ul>
    <div class="panel-h"><h2>Other teams</h2><span class="small">owner by cause (ER-08)</span></div>
    <ul class="xlist">${others.map(row).join("")}</ul>
    ${done.length ? `<details class="quiet" open><summary>Resolved (${done.length})</summary><ul class="xlist">${done.map(row).join("")}</ul></details>` : ""}
    <details class="quiet"><summary>Checked, no exception (${quiet.length + 17})</summary>
      <ul class="xlist">${quiet.map(row).join("")}</ul>
      <p class="list-note">+ 17 more orders on the delayed sailing: new ETA in the portal, still inside their delivery window (ER-01). No message, no work.</p>
    </details>`;
  document.querySelectorAll(".xrow").forEach((b) => b.addEventListener("click", () => { S.selected = b.dataset.ref; save(); render(); }));
}

function renderDetail() {
  const x = S.orders.find((o) => o.ref === S.selected);
  if (!x) return;
  const r = x.result;
  const sev = x.state === "RECOVERED" ? "NONE" : r.severity;
  const mine = (r.owner ?? MY_GROUP) === MY_GROUP;
  let act = "";
  if (x.state === "HELD") {
    act = `<button class="act" data-a="onTime">Haulier confirms on time</button><button class="act primary" data-a="delay">Haulier confirms delay</button>`;
  } else if (["OPEN", "ESCALATED"].includes(x.state) && mine) {
    act = `<button class="act primary" data-a="ack" id="btn-ack">Acknowledge</button><button class="act" data-a="replan" id="btn-replan">Agree new window ${esc(x.replanWindow)}</button>`;
  } else if (x.state === "ACKNOWLEDGED" && mine) {
    act = `<button class="act primary" data-a="replan" id="btn-replan">Agree new window ${esc(x.replanWindow)}</button>`;
  }
  const canResolve = ["ACKNOWLEDGED", "RECOVERED"].includes(x.state) && mine;
  const pending = x.pending
    ? `<div class="msg-preview" id="pending"><div class="mhead"><strong>Message ready</strong> — sends automatically at ${hhmm(x.pending.sendAt)} (D-08). Add a note for the customer if useful:</div>
       <div class="mbody">${esc(subject(x, r.severity))}</div>
       <div class="panel-b" style="padding-top:0"><label class="small" for="note">Planner note (optional)</label>
       <textarea id="note" class="note-field" rows="2" placeholder="e.g. We have asked the consignee for an afternoon slot."></textarea>
       <div class="actions"><button class="act primary" data-a="send" id="btn-send">Send now</button></div></div></div>`
    : "";
  const last = x.messages.at(-1);
  $("#detail").innerHTML = `
    <div class="panel-h"><h2>Exception detail</h2><span class="chip sev-${sev}">${x.state.toLowerCase()}</span></div>
    <div class="panel-b detail">
      <h3>${esc(x.customer)}</h3>
      <p class="small"><span class="ref">${x.ref}</span> · ${esc(x.route)} · ${esc(x.cargo)}${x.keyAccount ? " · key account" : ""}</p>
      <dl class="facts">
        <dt>What changed</dt><dd>${esc(x.causeText)}</dd>
        <dt>Agreed window</dt><dd>${esc(x.window)}</dd>
        <dt>Planned / new ETA</dt><dd>${esc(x.plannedEta)} → <strong>${esc(x.newEta)}</strong></dd>
        <dt>Where</dt><dd>${esc(x.leg)}</dd>
        <dt>Owner</dt><dd>${esc(OWNER_LABEL[r.owner] ?? "—")}${x.ackBy ? ` · ${esc(x.ackBy)}` : ""}</dd>
        <dt>Customer</dt><dd>${esc(NOTIF_LABEL[r.notification])}${x.messages.length ? ` · ${x.messages.length} sent, last ${hhmm(last.at)}` : ""}${x.callTask ? " · call task created" : ""}</dd>
        ${x.reason ? `<dt>Resolved</dt><dd>${esc(x.reason)}</dd>` : ""}
      </dl>
      <div class="decision" id="decision">
        <h4>Why the rules decided this</h4>
        <strong>${r.type === "RECOVERED" ? "Back inside the window" : `${r.severity.toLowerCase()} · ${esc(CAUSE_LABEL[r.type] ?? "no exception")}`}</strong>${r.responseSlaMinutes ? ` · respond within ${r.responseSlaMinutes} min` : ""}
        <ul>${r.rules.map((id) => `<li><code>${id}</code> ${esc(RULE_TEXT[id])}</li>`).join("")}</ul>
        ${x.release === "R2" ? '<p class="small">Customs holds are release 2; shown here as a preview.</p>' : ""}
      </div>
      ${pending}
      <div class="actions" id="actions">${act}</div>
      ${canResolve ? `<div class="actions"><label class="small" for="reason" style="align-self:center">Resolve with reason</label>
        <select id="reason" class="note-field" style="width:auto;margin:0"><option value="">Choose…</option>${REASONS.map((o) => `<option${x.state === "RECOVERED" && o === "New window agreed" ? " selected" : ""}>${o}</option>`).join("")}</select>
        <input id="resolve-note" class="note-field" style="width:auto;flex:1;margin:0" placeholder="Note (required for Other)">
        <button class="act" data-a="resolve" id="btn-resolve">Resolve</button></div>` : ""}
      <p id="detail-msg" class="small hidden" role="status" style="color:var(--risk)"></p>
      <h4 class="small" style="margin:16px 0 0">Order timeline</h4>
      <ul class="timeline">${x.timeline.map((t) => `<li>${esc(t)}</li>`).join("")}${x.messages.map((m) => `<li class="new">${stamp(m.at)} Customer message: ${esc(m.subject)}</li>`).join("")}</ul>
    </div>`;
  document.querySelectorAll("#detail [data-a]").forEach((b) => b.addEventListener("click", () => { actions[b.dataset.a](x); save(); render(); }));
}

function renderCustomer() {
  const x = S.orders.find((o) => o.ref === S.selected);
  const r = x.result;
  const told = x.messages.length > 0;
  const recovered = x.state === "RECOVERED" || (x.state === "RESOLVED" && x.reason?.startsWith("New window"));
  // What the customer sees depends only on what we told them: a held exception is invisible on purpose (ER-07).
  let status, line, steps;
  if (!told) {
    status = "On its way"; line = `Expected within your window ${x.window}.`; steps = ["on", "on", "on", "", ""];
  } else if (recovered) {
    status = "On schedule — new window"; line = `Delivery window ${x.window}.`; steps = ["on", "on", "on", "on", ""];
  } else {
    status = r.type === "CUSTOMS_HOLD" ? "Action needed" : "Delayed"; line = `New expected delivery ${x.newEta} (agreed window ${x.window}).`; steps = ["on", "on", "bad", "", ""];
  }
  $("#customer").innerHTML = `
    <div class="two-col">
      <div>
        <p class="eyebrow">Customer portal · ${esc(x.customer)} · demo</p>
        <div class="portal-card" id="portal-card">
          <p class="small">${x.ref} · ${esc(x.cargo)} · ${esc(x.route)}</p>
          <p class="status">${esc(status)}</p>
          <p>${esc(line)}</p>
          <div class="progress" aria-hidden="true">${steps.map((c) => `<span class="${c}"></span>`).join("")}</div>
          <p class="small">Collected · Terminal · Sea crossing · Out for delivery · Delivered</p>
          ${x.state === "HELD" ? '<p class="small"><em>Internally this order has a held "missing status" exception. The customer sees nothing until a planner confirms (ER-07).</em></p>' : ""}
        </div>
      </div>
      <div>
        <p class="eyebrow">Inbox of ${esc(x.contact)}</p>
        ${told ? x.messages.slice().reverse().map((m) => `<div class="msg-preview"><div class="mhead"><strong>${esc(m.subject)}</strong><br>${stamp(m.at)} · ${esc(m.channels)}</div><div class="mbody">${esc(m.body)}</div></div>`).join("") : '<p class="small">No messages for this order.</p>'}
      </div>
    </div>`;
}

function renderLog() {
  const ordered = S.log.slice().sort((a, b) => b.at - a.at || b.seq - a.seq);
  $("#log").innerHTML = ordered.slice(0, 60).map((l) => `<li><span>${stamp(l.at)}</span><span class="src">${esc(l.src)}</span><span>${esc(l.text)}</span></li>`).join("");
}

function render() {
  $("#clock").textContent = `Demo clock: Wed ${hhmm(S.clock)}`;
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === S.view)));
  $("#workbench").classList.toggle("hidden", S.view !== "workbench");
  $("#customer").classList.toggle("hidden", S.view !== "customer");
  renderList();
  renderDetail();
  renderCustomer();
  renderLog();
}

function save() {
  try { localStorage.setItem(STORE, JSON.stringify(S)); } catch { /* storage unavailable: the demo still works for this visit */ }
}
function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

// ---------- guided tour ----------
const TOUR = [
  { text: "09:52 — a sailing with 20 door-to-door orders is delayed 6 hours. The planner's list shows only the orders that now miss their delivery window. The other 18 got a new ETA in the portal and nothing else.", view: "workbench", ref: "D2D-48213", focus: "#list" },
  { text: "D2D-48213 is a reefer for a key account. The rules explain themselves: 310 min late is major (ER-02), a reefer goes one level up to critical (ER-04), a key account gets a call task (ER-11).", view: "workbench", ref: "D2D-48213", focus: "#decision" },
  { text: "Critical messages wait 5 minutes so the planner can add a note (D-08). Type a note and press 'Send now'. A call task for customer service is created at the same time.", view: "workbench", ref: "D2D-48213", focus: "#pending" },
  { text: "This is what the customer sees: the portal says 'Delayed' with the new ETA, and the e-mail arrived in their inbox. No driver data, ever (D-05).", view: "customer", ref: "D2D-48213", focus: "#portal-card" },
  { text: "Back as the planner: agree a new window with the consignee. The order is re-evaluated, recovers inside the window, and the customer automatically gets 'back on schedule' (ER-13). Then resolve with a reason.", view: "workbench", ref: "D2D-48213", focus: "#actions" },
  { text: "D2D-48288: no status for almost 7 hours. Most of the time that is a haulier without the app. The customer is not alarmed until the planner has called the haulier (ER-07). Try both buttons.", view: "workbench", ref: "D2D-48288", focus: "#actions" },
  { text: "D2D-48231: the ETA slipped again, but the customer was told 35 minutes ago and it did not get worse — no second message (ER-12). This rule was sharpened after a BAT defect (DEF-04).", view: "workbench", ref: "D2D-48231", focus: "#decision" },
  { text: "Press '+15 min' to see an unacknowledged critical exception escalate to the shift lead (ER-09). The event log below shows every system step. Reset any time — all data is fictional.", view: "workbench", ref: "D2D-48302", focus: "#log-panel" },
];
let tourStep = -1;
function showTour(i) {
  tourStep = i;
  const box = $("#tour");
  if (i < 0 || i >= TOUR.length) { box.classList.add("hidden"); tourStep = -1; return; }
  const t = TOUR[i];
  S.view = t.view; S.selected = t.ref; save(); render();
  box.classList.remove("hidden");
  $("#tour-text").innerHTML = `<span class="tour-step">Step ${i + 1} of ${TOUR.length}</span>${esc(t.text)}`;
  $("#tour-prev").disabled = i === 0;
  $("#tour-next").textContent = i === TOUR.length - 1 ? "Finish" : "Next";
  const el = $(t.focus);
  if (el) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
}

// ---------- wiring ----------
S = load() ?? fresh();
document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => { S.view = b.dataset.view; save(); render(); }));
$("#btn-reset").addEventListener("click", () => { try { localStorage.removeItem(STORE); } catch { /* ignore */ } S = fresh(); render(); });
$("#btn-tick").addEventListener("click", () => { tick(S, 15); save(); render(); });
$("#btn-tour").addEventListener("click", () => showTour(0));
$("#tour-next").addEventListener("click", () => showTour(tourStep + 1 >= TOUR.length ? -1 : tourStep + 1));
$("#tour-prev").addEventListener("click", () => showTour(Math.max(0, tourStep - 1)));
$("#tour-close").addEventListener("click", () => showTour(-1));
render();
if (new URLSearchParams(location.search).has("tour")) showTour(0);

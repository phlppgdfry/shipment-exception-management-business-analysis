// The exception component of the demo: turns transport events into exceptions, messages and tasks,
// and applies the commands people give in the workbench. Rule decisions come from the shared rule
// module; this file adds what the rules do not decide: lifecycle, timing, idempotency and the audit trail.
//
// Functions mutate the DemoState they receive. The mock API clones the state before every command,
// so a failed command never leaves a half-applied change behind.
import { evaluate, PARAMS } from "./rules";
import type { Cause, Decision, OwnerGroup, Severity } from "./rules";
import { formatCustomerDayTime, formatCustomerWindow, addMinutes, formatDayTime, formatWindow, londonDateKey, minutesBetween } from "./time";
import {
  ACTIVE_STATUSES,
  type CustomerMessage,
  type DemoState,
  type Evaluation,
  type ExceptionRecord,
  type ExceptionStatus,
  type MessageKind,
  type ReasonCode,
  type Shipment,
  type TimeWindow,
  type TransportEvent,
  type User,
} from "./types";

export const SYSTEM = "SYSTEM";
/** D-08: the planner may add a note to a critical message for up to 5 minutes, then it is sent anyway. */
export const PLANNER_NOTE_MINUTES = 5;
/** FR-03: no agreed window → assume window end = planned ETA + 2 h. */
export const ASSUMED_WINDOW_MINUTES = 120;

export const REASON_CODES: { code: ReasonCode; label: string }[] = [
  { code: "DELIVERED_IN_WINDOW", label: "Delivered in window" },
  { code: "NEW_WINDOW_AGREED", label: "New window agreed" },
  { code: "CUSTOMER_INFORMED_NO_ACTION", label: "Customer informed, no action" },
  { code: "FALSE_ALARM", label: "False alarm" },
  { code: "OTHER", label: "Other (note required)" },
];

/** Allowed lifecycle transitions — the UML state diagram in docs/04-process/uml.md. */
export const TRANSITIONS: Record<ExceptionStatus, ExceptionStatus[]> = {
  OPEN: ["ACKNOWLEDGED", "ESCALATED", "RECOVERED"],
  HELD: ["OPEN", "CLOSED"],
  ESCALATED: ["ACKNOWLEDGED", "RECOVERED"],
  ACKNOWLEDGED: ["ACKNOWLEDGED", "RECOVERED", "RESOLVED"],
  RECOVERED: ["RESOLVED", "OPEN", "ACKNOWLEDGED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
};

export class DomainError extends Error {
  constructor(
    public readonly code: "NOT_FOUND" | "FORBIDDEN" | "INVALID_TRANSITION" | "VALIDATION",
    message: string,
  ) {
    super(message);
  }
}

// --- helpers ------------------------------------------------------------------------------

export const isActive = (e: ExceptionRecord) => ACTIVE_STATUSES.includes(e.status);

export function activeExceptionFor(state: DemoState, orderRef: string): ExceptionRecord | undefined {
  return state.exceptions.find((e) => e.orderRef === orderRef && isActive(e));
}

export function findException(state: DemoState, exceptionId: string): ExceptionRecord {
  const ex = state.exceptions.find((e) => e.exceptionId === exceptionId);
  if (!ex) throw new DomainError("NOT_FOUND", `Exception ${exceptionId} not found`);
  return ex;
}

function user(state: DemoState, userId: string): User {
  const u = state.users[userId];
  if (!u) throw new DomainError("FORBIDDEN", `Unknown user ${userId}`);
  return u;
}

/** The window "late" is measured against: agreed, or assumed when missing (FR-03). */
export function effectiveWindow(s: Shipment): { window: TimeWindow; assumed: boolean } {
  if (s.deliveryWindow) return { window: s.deliveryWindow, assumed: false };
  return { window: { start: s.plannedEta, end: addMinutes(s.plannedEta, ASSUMED_WINDOW_MINUTES) }, assumed: true };
}

export function lateness(s: Shipment) {
  const { window, assumed } = effectiveWindow(s);
  return {
    minutesLate: minutesBetween(window.end, s.eta),
    nextDay: londonDateKey(s.eta) > londonDateKey(window.end),
    windowAssumed: assumed,
    window,
  };
}

function audit(state: DemoState, actorId: string, action: string, detail: string, orderRef: string | null, exceptionId: string | null) {
  state.counters.audit += 1;
  state.audit.push({ seq: state.counters.audit, at: state.now, actorId, action, orderRef, exceptionId, detail });
}

function transition(state: DemoState, ex: ExceptionRecord, to: ExceptionStatus, actorId: string, why: string) {
  if (!TRANSITIONS[ex.status].includes(to)) {
    throw new DomainError("INVALID_TRANSITION", `An exception cannot go from ${ex.status} to ${to}`);
  }
  const from = ex.status;
  ex.status = to;
  if (from !== to) audit(state, actorId, "STATUS_CHANGED", `${from} → ${to}: ${why}`, ex.orderRef, ex.exceptionId);
}

/** What the customer was last told about this order (ER-12 throttles per order, after DEF-04). */
function lastNotice(state: DemoState, orderRef: string): { severity: Severity | null; minutesSince: number | null } {
  const told = state.messages.filter((m) => m.orderRef === orderRef && (m.status === "SENT" || m.status === "PENDING_NOTE"));
  const last = told[told.length - 1];
  if (!last) return { severity: null, minutesSince: null };
  // After a "back on schedule" message the customer believes the order is on time again.
  if (last.kind === "RECOVERY") return { severity: null, minutesSince: null };
  return { severity: last.severity, minutesSince: minutesBetween(last.createdAt, state.now) };
}

const REASON_CATEGORY: Record<Cause, string> = {
  SAILING_DELAY: "Sailing delayed",
  SAILING_CANCELLED: "Sailing cancelled — moved to the next sailing",
  ROAD_DELAY: "Delay on the road",
  TERMINAL_DELAY: "Delay at the port terminal",
  CUSTOMS_HOLD: "Customs check",
  STATUS_MISSING: "Status being confirmed",
};

export const CAUSE_LABEL: Record<Cause, string> = {
  SAILING_DELAY: "Sailing delay",
  SAILING_CANCELLED: "Sailing cancelled",
  ROAD_DELAY: "Road delay",
  TERMINAL_DELAY: "Terminal delay",
  CUSTOMS_HOLD: "Customs hold",
  STATUS_MISSING: "Missing status",
};

export const OWNER_LABEL: Record<OwnerGroup, string> = {
  ROAD_PLANNING: "Road planning",
  TERMINAL_OPS: "Terminal operations",
  CUSTOMS_DESK: "Customs desk",
};

function buildMessage(state: DemoState, ex: ExceptionRecord, s: Shipment, kind: MessageKind): CustomerMessage {
  const customer = state.customers[s.customerId];
  const agreed = s.originalWindow ?? s.deliveryWindow;
  state.counters.message += 1;
  const content =
    kind === "RECOVERY"
      ? {
          headline: `Back on schedule: delivery ${formatCustomerWindow(s.deliveryWindow)}`,
          agreedWindow: formatCustomerWindow(s.deliveryWindow),
          newEta: formatCustomerDayTime(s.eta),
          reasonCategory: REASON_CATEGORY[ex.type],
          nextStep: "No action needed. We will let you know if anything changes.",
          plannerNote: null,
        }
      : kind === "ACTION_REQUIRED"
        ? {
            headline: "Action required: customs documents needed",
            agreedWindow: formatCustomerWindow(agreed),
            newEta: null,
            reasonCategory: REASON_CATEGORY[ex.type],
            nextStep: "Please send the missing information to the customs desk so the unit can be released.",
            plannerNote: null,
          }
        : {
            headline:
              ex.severity === "CRITICAL"
                ? `Significant delay: expected ${formatCustomerDayTime(s.eta)}`
                : `Delayed: expected ${formatCustomerDayTime(s.eta)}`,
            agreedWindow: formatCustomerWindow(agreed),
            newEta: formatCustomerDayTime(s.eta),
            reasonCategory: REASON_CATEGORY[ex.type],
            nextStep:
              ex.severity === "CRITICAL"
                ? "Your planner is working on a new delivery slot and will confirm it with you."
                : "We are re-planning the delivery and will update you if the time changes again.",
            plannerNote: null,
          };
  return {
    messageId: `MSG-${String(state.counters.message).padStart(4, "0")}`,
    orderRef: s.orderRef,
    customerId: s.customerId,
    exceptionId: ex.exceptionId,
    kind,
    severity: kind === "RECOVERY" ? "NONE" : ex.severity,
    status: "SENT",
    createdAt: state.now,
    sendAt: null,
    sentAt: null,
    channels: customer.channel === "EMAIL" ? ["EMAIL"] : ["PORTAL", "EMAIL"],
    content,
  };
}

function queueMessage(state: DemoState, ex: ExceptionRecord, s: Shipment, kind: MessageKind) {
  const customer = state.customers[s.customerId];
  const msg = buildMessage(state, ex, s, kind);
  if (!customer.pilot) {
    msg.status = "SHADOW";
    audit(state, SYSTEM, "MESSAGE_SHADOW", `${msg.messageId} logged, not sent: ${customer.name} is not in the pilot (shadow mode, AC-13.1)`, s.orderRef, ex.exceptionId);
  } else if (kind === "ACTION_REQUIRED") {
    msg.status = "NOT_IN_RELEASE";
    audit(state, SYSTEM, "MESSAGE_NOT_SENT", `${msg.messageId}: customs "action required" is release 2 (US-09); not sent in the pilot`, s.orderRef, ex.exceptionId);
  } else if (kind === "DELAY" && ex.severity === "CRITICAL") {
    msg.status = "PENDING_NOTE";
    msg.sendAt = addMinutes(state.now, PLANNER_NOTE_MINUTES);
    audit(state, SYSTEM, "MESSAGE_QUEUED", `${msg.messageId} waits up to ${PLANNER_NOTE_MINUTES} min for a planner note, then goes out anyway (D-08)`, s.orderRef, ex.exceptionId);
  } else {
    msg.status = "SENT";
    msg.sentAt = state.now;
    audit(state, SYSTEM, "MESSAGE_SENT", `${msg.messageId} (${kind.toLowerCase()}) sent by ${msg.channels.join(" + ").toLowerCase()} to ${customer.contactEmail}`, s.orderRef, ex.exceptionId);
  }
  state.messages.push(msg);
  return msg;
}

function logSuppressed(state: DemoState, ex: ExceptionRecord, s: Shipment) {
  const msg = buildMessage(state, ex, s, "DELAY");
  msg.status = "SUPPRESSED";
  state.messages.push(msg);
  audit(state, SYSTEM, "MESSAGE_SUPPRESSED", `${msg.messageId} not sent: same or lower severity within ${PARAMS.throttleMinutes} min of the last message (ER-12)`, s.orderRef, ex.exceptionId);
}

function createCallTask(state: DemoState, ex: ExceptionRecord, s: Shipment) {
  const customer = state.customers[s.customerId];
  if (!customer.pilot) {
    audit(state, SYSTEM, "CALL_TASK_SHADOW", `Call task not created: ${customer.name} is not in the pilot (shadow mode)`, s.orderRef, ex.exceptionId);
    return;
  }
  state.counters.task += 1;
  const taskId = `TASK-${String(state.counters.task).padStart(3, "0")}`;
  state.callTasks.push({ taskId, exceptionId: ex.exceptionId, orderRef: s.orderRef, customerId: s.customerId, createdAt: state.now, status: "OPEN", outcome: null, completedAt: null, completedBy: null });
  audit(state, SYSTEM, "CALL_TASK_CREATED", `${taskId}: customer service to call key account ${customer.name} (ER-11)`, s.orderRef, ex.exceptionId);
}

const ALWAYS_EXCEPTION: Cause[] = ["SAILING_CANCELLED", "CUSTOMS_HOLD", "STATUS_MISSING"];

function withdrawPending(state: DemoState, orderRef: string) {
  for (const m of state.messages) {
    if (m.orderRef === orderRef && m.status === "PENDING_NOTE") {
      m.status = "WITHDRAWN";
      m.sendAt = null;
      audit(state, SYSTEM, "MESSAGE_WITHDRAWN", `${m.messageId} withdrawn before sending: the order is back inside its window`, orderRef, m.exceptionId);
    }
  }
}

// --- evaluation ---------------------------------------------------------------------------

export interface EvaluationResult {
  decision: Decision;
  exceptionId: string | null;
  opened: boolean;
}

/**
 * Evaluate one order after a change, and apply the decision: open, update, recover or close an exception,
 * and queue the customer message the rules ask for.
 */
export function evaluateOrder(state: DemoState, orderRef: string, cause: Cause, eventId: string | null, statusConfirmed = false): EvaluationResult {
  const s = state.shipments[orderRef];
  const customer = state.customers[s.customerId];
  const { minutesLate, nextDay, windowAssumed } = lateness(s);
  // Back inside the window before a pending critical message went out: withdraw it, so the customer
  // never hears about a delay that no longer exists (found while building this demo — see docs/12-architecture).
  if (!ALWAYS_EXCEPTION.includes(cause) && !nextDay && minutesLate <= 0) withdrawPending(state, orderRef);
  const notice = lastNotice(state, orderRef);
  const decision = evaluate({
    cause,
    minutesLate,
    nextDay,
    timeCritical: s.cargo.timeCritical || s.cargo.unitType === "REEFER",
    keyAccount: customer.keyAccount,
    prefersAllUpdates: customer.prefersAllUpdates,
    statusConfirmed,
    lastNotifiedSeverity: notice.severity,
    minutesSinceLastNotice: notice.minutesSince,
  });
  const evaluation: Evaluation = {
    at: state.now,
    eventId,
    type: decision.type,
    severity: decision.severity,
    minutesLate,
    nextDay,
    windowAssumed,
    notification: decision.notification,
    rules: decision.rules,
  };
  let ex = activeExceptionFor(state, orderRef);

  // Not (or no longer) an exception
  if (!decision.exception) {
    if (!ex) {
      audit(state, SYSTEM, "EVALUATED", `No exception: delivery ${formatDayTime(s.eta)} is inside the window ${formatWindow(effectiveWindow(s).window)} (${decision.rules.join(", ")})`, orderRef, null);
      return { decision, exceptionId: null, opened: false };
    }
    ex.evaluations.push(evaluation);
    ex.severity = "NONE";
    ex.minutesLate = minutesLate;
    ex.rulesApplied = decision.rules;
    ex.notification = decision.notification;
    if (ex.status === "HELD") {
      // ER-07: confirmed on time → closed silently
      transition(state, ex, "CLOSED", SYSTEM, "haulier confirmed the delivery is on time (ER-07)");
      ex.reasonCode = "FALSE_ALARM";
      ex.closedAt = state.now;
      return { decision, exceptionId: ex.exceptionId, opened: false };
    }
    if (ex.status !== "RECOVERED") {
      transition(state, ex, "RECOVERED", SYSTEM, `back inside the window (${decision.rules.join(", ")})`);
      ex.recoveredAt = state.now;
    }
    if (decision.notification === "NOTIFY_RECOVERY") queueMessage(state, ex, s, "RECOVERY");
    else audit(state, SYSTEM, "NO_MESSAGE", "Recovered before the customer was told: no message (ER-13)", orderRef, ex.exceptionId);
    return { decision, exceptionId: ex.exceptionId, opened: false };
  }

  // An exception: open a new one or update the active one
  const sla = decision.responseSlaMinutes;
  let opened = false;
  if (!ex) {
    state.counters.exception += 1;
    ex = {
      exceptionId: `EX-${1000 + state.counters.exception}`,
      orderRef,
      customerId: s.customerId,
      type: decision.type as Cause,
      severity: decision.severity,
      ownerGroup: decision.owner as OwnerGroup,
      status: decision.notification === "HOLD" ? "HELD" : "OPEN",
      assigneeId: null,
      openedAt: state.now,
      dueAt: sla != null ? addMinutes(state.now, sla) : null,
      acknowledgedAt: null,
      escalatedAt: null,
      recoveredAt: null,
      resolvedAt: null,
      closedAt: null,
      windowAssumed,
      minutesLate,
      rulesApplied: decision.rules,
      notification: decision.notification,
      reasonCode: null,
      resolutionNote: null,
      release: decision.type === "CUSTOMS_HOLD" ? "R2" : "R1",
      actions: [],
      evaluations: [evaluation],
    };
    state.exceptions.push(ex);
    opened = true;
    audit(
      state,
      SYSTEM,
      "EXCEPTION_OPENED",
      `${ex.exceptionId} ${decision.type} · ${decision.severity} · owner ${OWNER_LABEL[ex.ownerGroup]} · ${sla != null ? `respond by ${formatDayTime(ex.dueAt)}` : "monitored, no response time"}${windowAssumed ? " · window assumed (FR-03)" : ""} (${decision.rules.join(", ")})`,
      orderRef,
      ex.exceptionId,
    );
  } else {
    const before = ex.severity;
    ex.evaluations.push(evaluation);
    ex.type = decision.type as Cause;
    ex.ownerGroup = decision.owner as OwnerGroup;
    ex.severity = decision.severity;
    ex.minutesLate = minutesLate;
    ex.windowAssumed = windowAssumed;
    ex.rulesApplied = decision.rules;
    ex.notification = decision.notification;
    if (ex.status === "HELD" && statusConfirmed) {
      transition(state, ex, "OPEN", SYSTEM, "delay confirmed by the planner (ER-07)");
    } else if (ex.status === "RECOVERED") {
      const back = ex.acknowledgedAt ? "ACKNOWLEDGED" : "OPEN";
      transition(state, ex, back, SYSTEM, "late again after recovering");
      ex.recoveredAt = null;
    }
    // A worse severity can shorten the response time of an exception nobody has picked up yet.
    if (sla != null && (ex.status === "OPEN" || ex.status === "HELD")) {
      const candidate = addMinutes(state.now, sla);
      if (!ex.dueAt || candidate < ex.dueAt) ex.dueAt = candidate;
    }
    audit(state, SYSTEM, "RE_EVALUATED", `${ex.exceptionId}: ${before} → ${decision.severity}, ${minutesLate} min after the window (${decision.rules.join(", ")})`, orderRef, ex.exceptionId);
  }

  switch (decision.notification) {
    case "NOTIFY":
      queueMessage(state, ex, s, "DELAY");
      break;
    case "NOTIFY_AND_CALL":
      queueMessage(state, ex, s, "DELAY");
      createCallTask(state, ex, s);
      break;
    case "SUPPRESSED":
      logSuppressed(state, ex, s);
      break;
    case "ACTION_REQUIRED":
      queueMessage(state, ex, s, "ACTION_REQUIRED");
      break;
    case "HOLD":
      audit(state, SYSTEM, "MESSAGE_HELD", "Customer message held until a planner confirms the situation with the haulier (ER-07)", orderRef, ex.exceptionId);
      break;
    case "NONE":
      if (opened) audit(state, SYSTEM, "NO_MESSAGE", "Minor: monitored, customer not notified (ER-10)", orderRef, ex.exceptionId);
      break;
  }
  return { decision, exceptionId: ex.exceptionId, opened };
}

// --- transport events ---------------------------------------------------------------------

const EVENT_CAUSE: Record<TransportEvent["type"], Cause> = {
  SAILING_DELAYED: "SAILING_DELAY",
  SAILING_CANCELLED: "SAILING_CANCELLED",
  ROAD_ETA_UPDATED: "ROAD_DELAY",
  TERMINAL_DELAYED: "TERMINAL_DELAY",
  CUSTOMS_HOLD_PLACED: "CUSTOMS_HOLD",
  STATUS_OVERDUE: "STATUS_MISSING",
};

export interface EventOutcome {
  outcome: "PROCESSED" | "DUPLICATE_IGNORED" | "STALE_IGNORED";
  affectedOrders: string[];
  exceptionsOpened: string[];
}

/** Process one transport event. Idempotent on eventId (NFR-03): a replayed event changes nothing. */
export function processEvent(state: DemoState, event: TransportEvent): EventOutcome {
  if (state.processedEventIds.includes(event.eventId)) {
    state.events.push({ eventId: event.eventId, type: event.type, receivedAt: state.now, occurredAt: event.occurredAt, outcome: "DUPLICATE_IGNORED", affectedOrders: [], exceptionsOpened: [], summary: "Same event ID received again — ignored (NFR-03)" });
    audit(state, SYSTEM, "EVENT_DUPLICATE", `${event.eventId} received again — ignored, no second exception or message (NFR-03)`, event.orderRef ?? null, null);
    return { outcome: "DUPLICATE_IGNORED", affectedOrders: [], exceptionsOpened: [] };
  }
  state.processedEventIds.push(event.eventId);
  const cause = EVENT_CAUSE[event.type];

  let refs: string[];
  if (event.sailingId) {
    refs = Object.values(state.shipments)
      .filter((s) => s.sailingId === event.sailingId && s.status !== "DELIVERED")
      .map((s) => s.orderRef)
      .sort();
    const sailing = state.sailings[event.sailingId];
    if (sailing) {
      sailing.status = event.type === "SAILING_CANCELLED" ? "CANCELLED" : "DELAYED";
      sailing.delayMinutes = (sailing.delayMinutes ?? 0) + (event.delayMinutes ?? 0);
    }
  } else if (event.orderRef && state.shipments[event.orderRef]) {
    refs = [event.orderRef];
  } else {
    throw new DomainError("VALIDATION", "Event needs an existing orderRef or a sailingId");
  }

  audit(state, SYSTEM, "EVENT_RECEIVED", `${event.eventId} ${event.type} from ${event.source}: ${event.reason}${refs.length > 1 ? ` — ${refs.length} orders on ${event.sailingId}` : ""}`, refs.length === 1 ? refs[0] : null, null);

  // Out-of-order handling: an absolute ETA that is older than the last one applied to the order must not
  // overwrite it (TA-4). The event is still logged and audited. Sailing events carry a delay, not an ETA.
  const absolute = event.type === "ROAD_ETA_UPDATED" || event.type === "TERMINAL_DELAYED";
  const stale = absolute ? refs.filter((r) => state.shipments[r].lastChangeAt && event.occurredAt < state.shipments[r].lastChangeAt!) : [];
  for (const ref of stale) {
    audit(state, SYSTEM, "EVENT_STALE", `${event.eventId} occurred at ${formatDayTime(event.occurredAt)}, before the last applied change (${formatDayTime(state.shipments[ref].lastChangeAt)}) — not applied (out of order)`, ref, activeExceptionFor(state, ref)?.exceptionId ?? null);
  }
  if (stale.length === refs.length && refs.length > 0) {
    state.events.push({ eventId: event.eventId, type: event.type, receivedAt: state.now, occurredAt: event.occurredAt, outcome: "STALE_IGNORED", affectedOrders: refs, exceptionsOpened: [], summary: "Older than the last applied change — ignored (out of order)" });
    return { outcome: "STALE_IGNORED", affectedOrders: refs, exceptionsOpened: [] };
  }

  const opened: string[] = [];
  for (const ref of refs.filter((r) => !stale.includes(r))) {
    const s = state.shipments[ref];
    applyEventToShipment(s, event);
    const result = evaluateOrder(state, ref, cause, event.eventId);
    if (result.opened && result.exceptionId) opened.push(result.exceptionId);
  }
  state.events.push({
    eventId: event.eventId,
    type: event.type,
    receivedAt: state.now,
    occurredAt: event.occurredAt,
    outcome: "PROCESSED",
    affectedOrders: refs,
    exceptionsOpened: opened,
    summary: `${refs.length} order${refs.length === 1 ? "" : "s"} evaluated, ${opened.length} exception${opened.length === 1 ? "" : "s"} opened`,
  });
  return { outcome: "PROCESSED", affectedOrders: refs, exceptionsOpened: opened };
}

function applyEventToShipment(s: Shipment, event: TransportEvent) {
  s.updates = s.updates ?? [];
  switch (event.type) {
    case "SAILING_DELAYED":
      s.eta = addMinutes(s.eta, event.delayMinutes ?? 0);
      break;
    case "SAILING_CANCELLED":
      s.eta = addMinutes(s.eta, event.delayMinutes ?? 0);
      if (event.replacementSailingId) s.sailingId = event.replacementSailingId;
      break;
    case "ROAD_ETA_UPDATED":
    case "TERMINAL_DELAYED":
      if (event.newEta) s.eta = event.newEta;
      s.lastChangeAt = event.occurredAt;
      break;
    case "CUSTOMS_HOLD_PLACED":
      s.customsHold = true;
      break;
    case "STATUS_OVERDUE":
      break;
  }
  s.updates.push({ at: event.occurredAt, text: event.reason, source: event.source, eventId: event.eventId });
}

// --- commands -----------------------------------------------------------------------------

function canWork(u: User, ex: ExceptionRecord) {
  return u.role === "SHIFT_LEAD" || u.ownerGroup === ex.ownerGroup;
}

function requireWorker(state: DemoState, actorId: string, ex: ExceptionRecord): User {
  const u = user(state, actorId);
  if (!canWork(u, ex)) {
    throw new DomainError("FORBIDDEN", `${u.title} cannot change exceptions owned by ${OWNER_LABEL[ex.ownerGroup]} (NFR-06)`);
  }
  return u;
}

/** AC-04.1: the owner acknowledges; their name and time are recorded and the response clock stops. */
export function acknowledge(state: DemoState, exceptionId: string, actorId: string) {
  const ex = findException(state, exceptionId);
  const u = requireWorker(state, actorId, ex);
  if (ex.status !== "OPEN") throw new DomainError("INVALID_TRANSITION", `Only an open exception can be acknowledged (now ${ex.status})`);
  transition(state, ex, "ACKNOWLEDGED", actorId, `acknowledged by ${u.name}`);
  ex.assigneeId = actorId;
  ex.acknowledgedAt = state.now;
}

/** AC-03.5: the shift lead assigns an open or escalated exception to a planner of the owner group. */
export function assign(state: DemoState, exceptionId: string, assigneeId: string, actorId: string) {
  const ex = findException(state, exceptionId);
  const lead = user(state, actorId);
  if (lead.role !== "SHIFT_LEAD") throw new DomainError("FORBIDDEN", "Only the shift lead assigns exceptions to a planner (AC-03.5)");
  const assignee = user(state, assigneeId);
  if (assignee.ownerGroup !== ex.ownerGroup) {
    throw new DomainError("VALIDATION", `${assignee.name} is not in ${OWNER_LABEL[ex.ownerGroup]}`);
  }
  if (ex.status === "OPEN" || ex.status === "ESCALATED") {
    transition(state, ex, "ACKNOWLEDGED", actorId, `assigned to ${assignee.name} by ${lead.name}`);
    ex.acknowledgedAt = ex.acknowledgedAt ?? state.now;
  } else if (ex.status === "HELD") {
    // D-09: a held exception can be given to a planner to chase the haulier; it stays held until confirmed.
  } else if (ex.status !== "ACKNOWLEDGED" && ex.status !== "RECOVERED") {
    throw new DomainError("INVALID_TRANSITION", `A ${ex.status.toLowerCase()} exception cannot be assigned`);
  }
  ex.assigneeId = assigneeId;
  audit(state, actorId, "ASSIGNED", `${ex.exceptionId} assigned to ${assignee.name}`, ex.orderRef, ex.exceptionId);
}

/** Register a response action (what the owner did), visible to the next shift. */
export function addAction(state: DemoState, exceptionId: string, text: string, actorId: string) {
  const ex = findException(state, exceptionId);
  requireWorker(state, actorId, ex);
  if (!isActive(ex)) throw new DomainError("INVALID_TRANSITION", "Actions can only be added to an active exception");
  if (!text.trim()) throw new DomainError("VALIDATION", "Describe the action");
  ex.actions.push({ at: state.now, actorId, text: text.trim() });
  audit(state, actorId, "ACTION_ADDED", text.trim(), ex.orderRef, ex.exceptionId);
}

/** D-08 / AC-05.4: the planner adds a note to a pending critical message and sends it now. */
export function sendWithNote(state: DemoState, messageId: string, note: string, actorId: string) {
  const msg = state.messages.find((m) => m.messageId === messageId);
  if (!msg) throw new DomainError("NOT_FOUND", `Message ${messageId} not found`);
  const ex = findException(state, msg.exceptionId);
  requireWorker(state, actorId, ex);
  if (msg.status !== "PENDING_NOTE") throw new DomainError("INVALID_TRANSITION", "Only a message waiting for a planner note can be edited");
  msg.content.plannerNote = note.trim() || null;
  msg.status = "SENT";
  msg.sentAt = state.now;
  audit(state, actorId, "MESSAGE_SENT", `${msg.messageId} sent with ${msg.content.plannerNote ? "a planner note" : "no note"}`, msg.orderRef, msg.exceptionId);
}

/** US-08: a held missing-status exception is confirmed with the haulier: on time, or delayed with a new ETA. */
export function confirmStatus(state: DemoState, exceptionId: string, outcome: "ON_TIME" | "DELAYED", newEta: string | null, actorId: string) {
  const ex = findException(state, exceptionId);
  requireWorker(state, actorId, ex);
  if (ex.status !== "HELD") throw new DomainError("INVALID_TRANSITION", "Only a held exception can be confirmed");
  const s = state.shipments[ex.orderRef];
  if (outcome === "ON_TIME") {
    transition(state, ex, "CLOSED", actorId, "haulier confirms on time — closed as false alarm, no message (US-08)");
    ex.reasonCode = "FALSE_ALARM";
    ex.closedAt = state.now;
    s.lastStatusAt = state.now;
    return;
  }
  if (!newEta) throw new DomainError("VALIDATION", "Enter the new ETA the haulier gave");
  s.eta = newEta;
  s.lastStatusAt = state.now;
  audit(state, actorId, "STATUS_CONFIRMED", `Haulier confirms a delay, new ETA ${formatDayTime(newEta)}`, ex.orderRef, ex.exceptionId);
  evaluateOrder(state, ex.orderRef, "STATUS_MISSING", null, true);
}

/** AC-04.2: the planner records a new window agreed with the consignee; the order is re-evaluated (ER-13). */
export function replan(state: DemoState, exceptionId: string, window: TimeWindow, actorId: string) {
  const ex = findException(state, exceptionId);
  requireWorker(state, actorId, ex);
  if (!isActive(ex) || ex.status === "HELD") throw new DomainError("INVALID_TRANSITION", "Re-plan an acknowledged exception");
  if (!(window.start < window.end)) throw new DomainError("VALIDATION", "The window must end after it starts");
  const s = state.shipments[ex.orderRef];
  s.originalWindow = s.originalWindow ?? s.deliveryWindow;
  s.deliveryWindow = window;
  audit(state, actorId, "WINDOW_AGREED", `New delivery window agreed with the consignee: ${formatWindow(window)} (was ${formatWindow(s.originalWindow)})`, ex.orderRef, ex.exceptionId);
  evaluateOrder(state, ex.orderRef, ex.type, null);
}

/** AC-04.3: resolve with a mandatory reason code; "other" needs a note (DEF-03). */
export function resolve(state: DemoState, exceptionId: string, reasonCode: ReasonCode, note: string, actorId: string) {
  const ex = findException(state, exceptionId);
  requireWorker(state, actorId, ex);
  if (!REASON_CODES.some((r) => r.code === reasonCode)) throw new DomainError("VALIDATION", "Choose a reason code");
  if (reasonCode === "OTHER" && !note.trim()) throw new DomainError("VALIDATION", "A note is required when the reason is \"other\" (AC-04.3)");
  if (ex.status !== "ACKNOWLEDGED" && ex.status !== "RECOVERED") {
    throw new DomainError("INVALID_TRANSITION", `Acknowledge the exception before resolving it (now ${ex.status})`);
  }
  transition(state, ex, "RESOLVED", actorId, `resolved: ${REASON_CODES.find((r) => r.code === reasonCode)!.label}`);
  ex.reasonCode = reasonCode;
  ex.resolutionNote = note.trim() || null;
  ex.resolvedAt = state.now;
}

/** US-11: customer service closes the call task with a short outcome. */
export function completeCallTask(state: DemoState, taskId: string, outcome: string, actorId: string) {
  const task = state.callTasks.find((t) => t.taskId === taskId);
  if (!task) throw new DomainError("NOT_FOUND", `Task ${taskId} not found`);
  const u = user(state, actorId);
  if (u.role !== "CS_AGENT" && u.role !== "SHIFT_LEAD") throw new DomainError("FORBIDDEN", "Call tasks are completed by customer service");
  if (task.status === "DONE") throw new DomainError("INVALID_TRANSITION", "Task already completed");
  if (!outcome.trim()) throw new DomainError("VALIDATION", "Closing a call task requires a short outcome (US-11)");
  task.status = "DONE";
  task.outcome = outcome.trim();
  task.completedAt = state.now;
  task.completedBy = actorId;
  audit(state, actorId, "CALL_TASK_DONE", `${taskId}: ${task.outcome}`, task.orderRef, task.exceptionId);
}

/** Moves the demo clock: sends pending messages whose note time is up, escalates overdue exceptions (ER-09). */
export function advanceClock(state: DemoState, minutes: number) {
  if (minutes <= 0 || minutes > 240) throw new DomainError("VALIDATION", "Advance between 1 and 240 minutes");
  const target = addMinutes(state.now, minutes);
  // Process due moments in time order, so the audit trail reads like the day happened.
  const moments = [
    ...state.messages.filter((m) => m.status === "PENDING_NOTE" && m.sendAt && m.sendAt <= target).map((m) => ({ at: m.sendAt!, kind: "send" as const, id: m.messageId })),
    ...state.exceptions.filter((e) => e.status === "OPEN" && e.dueAt && e.dueAt <= target).map((e) => ({ at: e.dueAt!, kind: "escalate" as const, id: e.exceptionId })),
    ...state.exceptions.filter((e) => e.status === "HELD" && !e.escalatedAt && e.dueAt && e.dueAt <= target).map((e) => ({ at: e.dueAt!, kind: "escalateHeld" as const, id: e.exceptionId })),
  ].sort((a, b) => a.at.localeCompare(b.at));
  for (const m of moments) {
    state.now = m.at > state.now ? m.at : state.now;
    if (m.kind === "send") {
      const msg = state.messages.find((x) => x.messageId === m.id)!;
      if (msg.status !== "PENDING_NOTE") continue;
      msg.status = "SENT";
      msg.sentAt = state.now;
      audit(state, SYSTEM, "MESSAGE_SENT", `${msg.messageId} sent without a planner note after ${PLANNER_NOTE_MINUTES} min (D-08)`, msg.orderRef, msg.exceptionId);
    } else if (m.kind === "escalateHeld") {
      // D-09: escalate to the shift lead, but keep the customer message held until the haulier confirms.
      const ex = findException(state, m.id);
      if (ex.status !== "HELD" || ex.escalatedAt) continue;
      ex.escalatedAt = state.now;
      audit(state, SYSTEM, "HELD_ESCALATED", `${ex.exceptionId} not confirmed within ${ex.severity === "CRITICAL" ? "30 min" : "2 h"} — escalated to the shift lead; the customer message stays held (D-09)`, ex.orderRef, ex.exceptionId);
    } else {
      const ex = findException(state, m.id);
      if (ex.status !== "OPEN") continue;
      transition(state, ex, "ESCALATED", SYSTEM, `not acknowledged within ${ex.severity === "CRITICAL" ? "30 min" : "2 h"} — escalated to the shift lead (ER-09)`);
      ex.escalatedAt = state.now;
    }
  }
  state.now = target;
}

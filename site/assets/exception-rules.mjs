// Shipment exception rules — one module, used by the prototype, the rule explorer and the tests.
// Rule IDs (ER-xx) refer to docs/05-requirements/exception-rules.md.
// Parameters are illustrative assumptions agreed with the Product Owner, not real company data.

export const PARAMS = Object.freeze({
  majorFromMinutes: 120, // ER-02
  criticalFromMinutes: 360, // ER-02
  throttleMinutes: 120, // ER-12
  slaMinutes: { CRITICAL: 30, MAJOR: 120, MINOR: null }, // ER-09 (MINOR = monitor, next working day)
});

export const CAUSES = ["SAILING_DELAY", "SAILING_CANCELLED", "ROAD_DELAY", "TERMINAL_DELAY", "CUSTOMS_HOLD", "STATUS_MISSING"];
export const SEVERITIES = ["NONE", "MINOR", "MAJOR", "CRITICAL"];

const rank = (s) => SEVERITIES.indexOf(s);
const raise = (s) => SEVERITIES[Math.min(rank(s) + 1, rank("CRITICAL"))];

// ER-08: who owns the exception
const OWNER = {
  SAILING_DELAY: "ROAD_PLANNING",
  SAILING_CANCELLED: "ROAD_PLANNING",
  ROAD_DELAY: "ROAD_PLANNING",
  STATUS_MISSING: "ROAD_PLANNING",
  TERMINAL_DELAY: "TERMINAL_OPS",
  CUSTOMS_HOLD: "CUSTOMS_DESK",
};

// Causes that are an exception whatever the ETA says (ER-01)
const ALWAYS_EXCEPTION = new Set(["SAILING_CANCELLED", "CUSTOMS_HOLD", "STATUS_MISSING"]);

/**
 * Evaluate one change on a door-to-door order.
 * @param {object} e
 * @param {string} e.cause                 one of CAUSES
 * @param {number} e.minutesLate           expected delivery minus END of the agreed delivery window (<= 0: still inside)
 * @param {boolean} e.nextDay              delivery moves to a later calendar day
 * @param {boolean} e.timeCritical         reefer or flagged time-critical by the customer
 * @param {boolean} e.keyAccount
 * @param {boolean} e.prefersAllUpdates    customer opted in to every change, including minor ones
 * @param {boolean} e.statusConfirmed      STATUS_MISSING only: planner confirmed the delay with the haulier
 * @param {string|null} e.lastNotifiedSeverity  severity of the last customer notification for this order, null if never
 * @param {number|null} e.minutesSinceLastNotice
 */
export function evaluate(e) {
  const rules = [];
  const cause = e.statusConfirmed && e.cause === "STATUS_MISSING" ? "ROAD_DELAY" : e.cause;
  if (cause !== e.cause) rules.push("ER-07");

  // ER-01 / ER-13: inside the agreed window is not an exception. If the customer heard about it, tell them it recovered.
  if (!ALWAYS_EXCEPTION.has(cause) && !e.nextDay && e.minutesLate <= 0) {
    rules.push("ER-01");
    if (e.lastNotifiedSeverity) {
      rules.push("ER-13");
      return result("RECOVERED", "NONE", null, "NOTIFY_RECOVERY", rules);
    }
    return result("NONE", "NONE", null, "NONE", rules);
  }
  rules.push("ER-01");

  // Severity
  let severity;
  if (cause === "SAILING_CANCELLED") {
    severity = "CRITICAL";
    rules.push("ER-05");
  } else if (cause === "CUSTOMS_HOLD") {
    severity = "MAJOR";
    rules.push("ER-06");
  } else if (cause === "STATUS_MISSING") {
    severity = "MAJOR";
    rules.push("ER-07");
  } else {
    rules.push("ER-02");
    severity = e.minutesLate >= PARAMS.criticalFromMinutes ? "CRITICAL" : e.minutesLate >= PARAMS.majorFromMinutes ? "MAJOR" : "MINOR";
    if (e.nextDay && severity !== "CRITICAL") {
      severity = "CRITICAL";
      rules.push("ER-03");
    }
  }
  if (e.timeCritical && severity !== "CRITICAL") {
    severity = raise(severity);
    rules.push("ER-04");
  }

  const owner = OWNER[cause];
  rules.push("ER-08", "ER-09");

  // Customer notification
  let notification;
  if (cause === "STATUS_MISSING") {
    notification = "HOLD"; // ER-07: no alarm until a human confirmed it
  } else if (cause === "CUSTOMS_HOLD") {
    notification = "ACTION_REQUIRED"; // ER-06: the customer has to act, so never throttled
  } else {
    rules.push("ER-10");
    if (severity === "MINOR") notification = e.prefersAllUpdates ? "NOTIFY" : "NONE";
    else notification = "NOTIFY";
    if (severity === "CRITICAL" && e.keyAccount) {
      notification = "NOTIFY_AND_CALL";
      rules.push("ER-11");
    }
    // ER-12: one message per order per throttle window, unless it got worse
    const recent = e.minutesSinceLastNotice != null && e.minutesSinceLastNotice < PARAMS.throttleMinutes;
    const notWorse = e.lastNotifiedSeverity && rank(severity) <= rank(e.lastNotifiedSeverity);
    if (notification !== "NONE" && recent && notWorse) {
      notification = "SUPPRESSED";
      rules.push("ER-12");
    }
  }

  return result(cause, severity, owner, notification, rules);
}

function result(type, severity, owner, notification, rules) {
  return {
    exception: type !== "NONE" && type !== "RECOVERED",
    type,
    severity,
    owner,
    responseSlaMinutes: severity === "NONE" ? null : PARAMS.slaMinutes[severity],
    notification,
    rules: [...new Set(rules)].sort(),
  };
}

// Plain-language explanations, used by the prototype and the rule explorer.
export const RULE_TEXT = {
  "ER-01": "An exception exists only when delivery falls outside the agreed window, or for cancellations, customs holds and missing status.",
  "ER-02": "Severity follows lateness after the window: under 2 h minor, 2–6 h major, 6 h or more critical.",
  "ER-03": "If delivery moves to another day, the slot is lost: critical.",
  "ER-04": "Reefer or time-critical cargo goes up one level.",
  "ER-05": "A cancelled sailing is always critical.",
  "ER-06": "A customs hold is major, owned by the customs desk, and the customer is asked to act.",
  "ER-07": "Missing status is major, but the customer is not told until a planner confirms a real delay.",
  "ER-08": "Owner by cause: road planning for sailing, road and status issues; terminal ops; customs desk.",
  "ER-09": "Response time: critical 30 min, major 2 h, minor monitored next working day.",
  "ER-10": "Major and critical are notified proactively; minor only if the customer asked for every update.",
  "ER-11": "Critical for a key account also creates a call task for customer service.",
  "ER-12": "At most one message per order every 2 h, unless the situation got worse.",
  "ER-13": "Back inside the window: close the exception and tell the customer only if they were told before.",
};

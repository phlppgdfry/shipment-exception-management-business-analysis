// Type declarations for exception-rules.mjs, so the TypeScript control tower (demo/application)
// can use the same rule module as the prototype, the rule explorer and the acceptance tests.

export type Cause =
  | "SAILING_DELAY"
  | "SAILING_CANCELLED"
  | "ROAD_DELAY"
  | "TERMINAL_DELAY"
  | "CUSTOMS_HOLD"
  | "STATUS_MISSING";

export type Severity = "NONE" | "MINOR" | "MAJOR" | "CRITICAL";
export type OwnerGroup = "ROAD_PLANNING" | "TERMINAL_OPS" | "CUSTOMS_DESK";
export type NotificationDecision =
  | "NONE"
  | "NOTIFY"
  | "NOTIFY_AND_CALL"
  | "SUPPRESSED"
  | "HOLD"
  | "ACTION_REQUIRED"
  | "NOTIFY_RECOVERY";

export interface ChangeInput {
  cause: Cause;
  minutesLate: number;
  nextDay: boolean;
  timeCritical: boolean;
  keyAccount: boolean;
  prefersAllUpdates: boolean;
  statusConfirmed: boolean;
  lastNotifiedSeverity: Severity | null;
  minutesSinceLastNotice: number | null;
}

export interface Decision {
  exception: boolean;
  type: Cause | "NONE" | "RECOVERED";
  severity: Severity;
  owner: OwnerGroup | null;
  responseSlaMinutes: number | null;
  notification: NotificationDecision;
  rules: string[];
}

export const PARAMS: Readonly<{
  majorFromMinutes: number;
  criticalFromMinutes: number;
  throttleMinutes: number;
  slaMinutes: Readonly<Record<"CRITICAL" | "MAJOR" | "MINOR", number | null>>;
}>;
export const CAUSES: Cause[];
export const SEVERITIES: Severity[];
export const RULE_TEXT: Record<string, string>;
export function evaluate(change: ChangeInput): Decision;

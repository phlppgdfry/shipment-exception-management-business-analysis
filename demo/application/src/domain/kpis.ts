// Operational KPIs for the overview. Computed live from the simulated day — they show how the KPI tree
// (docs/01-opportunity/kpi-tree.md) would be measured, not results of a real pilot.
import { activeExceptionFor, isActive, lateness } from "./engine";
import { minutesBetween } from "./time";
import type { DemoState, ExceptionRecord, Severity } from "./types";

const RANK: Severity[] = ["NONE", "MINOR", "MAJOR", "CRITICAL"];
export const peakSeverity = (ex: ExceptionRecord): Severity =>
  ex.evaluations.reduce<Severity>((max, e) => (RANK.indexOf(e.severity) > RANK.indexOf(max) ? e.severity : max), ex.severity);

function median(values: number[]): number | null {
  if (!values.length) return null;
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2);
}

export interface Overview {
  activeShipments: number;
  onSchedule: number;
  delayed: number;
  criticalExceptions: number;
  unassignedExceptions: number;
  escalated: number;
  held: number;
  openCallTasks: number;
  byOwner: Record<string, Record<"MINOR" | "MAJOR" | "CRITICAL", number>>;
  k1ProactiveRate: { value: number | null; numerator: number; denominator: number };
  k2MedianMinutesToInform: number | null;
  k6AckWithinResponse: { value: number | null; numerator: number; denominator: number };
  k8MessagesPerNotifiedException: number | null;
}

export function overview(state: DemoState): Overview {
  const active = Object.values(state.shipments).filter((s) => s.status !== "DELIVERED");
  const delayed = active.filter((s) => lateness(s).minutesLate > 0 || lateness(s).nextDay || Boolean(activeExceptionFor(state, s.orderRef)?.type === "SAILING_CANCELLED"));
  const activeEx = state.exceptions.filter(isActive);
  const byOwner: Overview["byOwner"] = {};
  for (const ex of activeEx) {
    if (ex.severity === "NONE") continue;
    byOwner[ex.ownerGroup] = byOwner[ex.ownerGroup] ?? { MINOR: 0, MAJOR: 0, CRITICAL: 0 };
    byOwner[ex.ownerGroup][ex.severity as "MINOR" | "MAJOR" | "CRITICAL"] += 1;
  }

  // Pilot customers only: the control group is in shadow mode.
  const pilotEx = state.exceptions.filter((e) => state.customers[e.customerId].pilot);
  const majorOrWorse = pilotEx.filter((e) => ["MAJOR", "CRITICAL"].includes(peakSeverity(e)) && e.type !== "STATUS_MISSING" && e.release === "R1");
  const informedInTime = majorOrWorse.filter((e) => {
    const msg = state.messages.find((m) => m.exceptionId === e.exceptionId && m.kind === "DELAY" && m.status === "SENT");
    const s = state.shipments[e.orderRef];
    const windowStart = (s.originalWindow ?? s.deliveryWindow)?.start;
    return msg && msg.sentAt && (!windowStart || msg.sentAt < windowStart);
  });
  const toInform = majorOrWorse
    .map((e) => {
      const msg = state.messages.find((m) => m.exceptionId === e.exceptionId && m.kind === "DELAY" && m.status === "SENT");
      return msg?.sentAt ? minutesBetween(e.openedAt, msg.sentAt) : null;
    })
    .filter((v): v is number => v != null);

  const withSla = state.exceptions.filter((e) => e.dueAt && e.status !== "HELD" && (e.acknowledgedAt || e.dueAt <= state.now));
  const ackInTime = withSla.filter((e) => e.acknowledgedAt && e.dueAt && e.acknowledgedAt <= e.dueAt);

  const notified = new Set(state.messages.filter((m) => m.status === "SENT").map((m) => m.exceptionId));
  const sentCount = state.messages.filter((m) => m.status === "SENT").length;

  return {
    activeShipments: active.length,
    onSchedule: active.length - delayed.length,
    delayed: delayed.length,
    criticalExceptions: activeEx.filter((e) => e.severity === "CRITICAL").length,
    unassignedExceptions: activeEx.filter((e) => !e.assigneeId && e.status !== "RECOVERED").length,
    escalated: activeEx.filter((e) => e.status === "ESCALATED").length,
    held: activeEx.filter((e) => e.status === "HELD").length,
    openCallTasks: state.callTasks.filter((t) => t.status === "OPEN").length,
    byOwner,
    k1ProactiveRate: { value: majorOrWorse.length ? informedInTime.length / majorOrWorse.length : null, numerator: informedInTime.length, denominator: majorOrWorse.length },
    k2MedianMinutesToInform: median(toInform),
    k6AckWithinResponse: { value: withSla.length ? ackInTime.length / withSla.length : null, numerator: ackInTime.length, denominator: withSla.length },
    k8MessagesPerNotifiedException: notified.size ? sentCount / notified.size : null,
  };
}

// AC-13.2: daily pilot measurement export — one row per exception, with the timestamps the KPIs need.
import { peakSeverity } from "./kpis";
import type { DemoState } from "./types";

export const EXPORT_COLUMNS = [
  "order",
  "customer",
  "pilot",
  "type",
  "severity",
  "received",
  "opened",
  "acknowledged",
  "message_sent",
  "resolved",
  "reason_code",
  "messages",
] as const;

const csvCell = (v: string | number | boolean | null) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function pilotExportCsv(state: DemoState): string {
  const rows = state.exceptions.map((ex) => {
    const firstEval = ex.evaluations[0];
    const event = state.events.find((e) => e.eventId === firstEval?.eventId);
    const sent = state.messages.filter((m) => m.exceptionId === ex.exceptionId && m.status === "SENT");
    return [
      ex.orderRef,
      state.customers[ex.customerId].name,
      state.customers[ex.customerId].pilot ? "yes" : "no",
      ex.type,
      peakSeverity(ex),
      event?.receivedAt ?? ex.openedAt,
      ex.openedAt,
      ex.acknowledgedAt,
      sent[0]?.sentAt ?? null,
      ex.resolvedAt ?? ex.closedAt,
      ex.reasonCode,
      sent.length,
    ];
  });
  return [EXPORT_COLUMNS.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n") + "\n";
}

// What the customer sees in the portal (US-05, US-10). It follows the messages that were actually sent,
// never exposes internal exception details. Neutral confidence information may indicate an unconfirmed status.
import { effectiveWindow } from "./engine";
import { formatCustomerDayTime as formatDayTime, formatCustomerWindow as formatWindow } from "./time";
import type { CustomerMessage, DemoState } from "./types";

export type CustomerStatusTone = "unknown" | "ok" | "delayed" | "critical" | "action";

/** A sent message as the customer sees it: no severity, status, owner or rule IDs (NFR-05, NFR-08 stays internal). */
export interface PublicMessage {
  messageId: string;
  sentAt: string | null;
  channels: CustomerMessage["channels"];
  headline: string;
  agreedWindow: string;
  newEta: string | null;
  reasonCategory: string;
  nextStep: string;
  plannerNote: string | null;
}

const toPublic = (m: CustomerMessage): PublicMessage => ({
  messageId: m.messageId,
  sentAt: m.sentAt,
  channels: m.channels,
  headline: m.content.headline,
  agreedWindow: m.content.agreedWindow,
  newEta: m.content.newEta,
  reasonCategory: m.content.reasonCategory,
  nextStep: m.content.nextStep,
  plannerNote: m.content.plannerNote,
});

export interface CustomerView {
  orderRef: string;
  customerName: string;
  pilot: boolean;
  tone: CustomerStatusTone;
  headline: string;
  progress: string;
  agreedWindow: string;
  expected: string;
  reason: string | null;
  nextStep: string | null;
  plannerNote: string | null;
  messages: PublicMessage[];
}

const PROGRESS: Record<string, string> = {
  BOOKED: "Order received",
  COLLECTED: "Collected, on the way to the port",
  AT_ORIGIN_TERMINAL: "At the departure terminal",
  AT_SEA: "On the sea crossing",
  AT_DESTINATION_TERMINAL: "Arrived at the UK terminal",
  ON_DELIVERY_LEG: "Out for delivery",
  DELIVERED: "Delivered",
};

export function customerView(state: DemoState, orderRef: string): CustomerView | null {
  const s = state.shipments[orderRef];
  if (!s) return null;
  const customer = state.customers[s.customerId];
  const sent = state.messages.filter((m) => m.orderRef === orderRef && m.status === "SENT");
  const last = sent[sent.length - 1];
  const window = s.originalWindow ?? s.deliveryWindow;
  const base = {
    orderRef,
    customerName: customer.name,
    pilot: customer.pilot,
    progress: PROGRESS[s.status] ?? s.status,
    messages: sent.map(toPublic),
  };
  if (!last) {
    const unconfirmed = s.status !== 'DELIVERED' && (state.exceptions.some(e => e.orderRef === orderRef && (e.status === 'HELD' || (e.type === 'STATUS_MISSING' && !['CLOSED','RESOLVED','RECOVERED'].includes(e.status)))) || Date.parse(state.now) - Date.parse(s.lastStatusAt) > 120 * 60000);
    return {
      ...base,
      tone: unconfirmed ? "unknown" : "ok",
      headline: unconfirmed ? "Status awaiting confirmation" : s.status === "DELIVERED" ? "Delivered" : "On schedule",
      agreedWindow: window ? formatWindow(window) : `around ${formatDayTime(s.plannedEta)} (window not agreed)`,
      expected: unconfirmed ? `Last reported ETA: ${formatDayTime(s.eta)} (awaiting confirmation)` : window ? "Within your delivery window" : formatDayTime(effectiveWindow(s).window.start),
      reason: null,
      nextStep: unconfirmed ? "We are checking the latest transport status. Your agreed delivery window is shown above." : null,
      plannerNote: null,
    };
  }
  if (last.kind === "RECOVERY") {
    return {
      ...base,
      tone: "ok",
      headline: "Back on schedule",
      agreedWindow: formatWindow(s.deliveryWindow),
      expected: `Within the new window ${formatWindow(s.deliveryWindow)}`,
      reason: last.content.reasonCategory,
      nextStep: last.content.nextStep,
      plannerNote: null,
    };
  }
  return {
    ...base,
    tone: last.kind === "ACTION_REQUIRED" ? "action" : last.severity === "CRITICAL" ? "critical" : "delayed",
    headline: last.content.headline,
    agreedWindow: last.content.agreedWindow,
    expected: last.content.newEta ?? "After customs release",
    reason: last.content.reasonCategory,
    nextStep: last.content.nextStep,
    plannerNote: last.content.plannerNote,
  };
}

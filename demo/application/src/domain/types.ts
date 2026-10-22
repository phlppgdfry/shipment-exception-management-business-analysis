// Domain types of the control tower. They mirror the schemas in demo/mock-apis/openapi.yaml,
// so the mock API returns exactly what the proposed REST API would return.
import type { Cause, NotificationDecision, OwnerGroup, Severity } from "./rules";

export type { Cause, NotificationDecision, OwnerGroup, Severity };

export type ShipmentStatus =
  | "BOOKED"
  | "COLLECTED"
  | "AT_ORIGIN_TERMINAL"
  | "AT_SEA"
  | "AT_DESTINATION_TERMINAL"
  | "ON_DELIVERY_LEG"
  | "DELIVERED";

export interface TimeWindow {
  start: string;
  end: string;
}

export interface Customer {
  customerId: string;
  name: string;
  keyAccount: boolean;
  pilot: boolean;
  prefersAllUpdates: boolean;
  channel: "PORTAL" | "EDI" | "EMAIL";
  contactEmail: string;
}

export interface Milestone {
  code: string;
  label: string;
  plannedAt: string;
  actualAt: string | null;
  location: string;
}

export interface Leg {
  mode: "ROAD" | "SEA";
  from: string;
  to: string;
  plannedDeparture: string;
  plannedArrival: string;
  operator: string;
}

export interface ShipmentUpdate {
  at: string;
  text: string;
  source: string;
  eventId: string | null;
}

export interface Shipment {
  orderRef: string;
  customerId: string;
  route: string;
  sailingId: string;
  cargo: { description: string; unitType: "TRAILER" | "REEFER" | "FLATBED" | "CONTAINER"; timeCritical: boolean };
  consignee: string;
  /** Agreed delivery window. A re-plan (US-04) replaces it with the window agreed with the consignee. */
  deliveryWindow: TimeWindow | null;
  /** The window originally agreed, kept for the customer message and the pilot export. */
  originalWindow?: TimeWindow | null;
  plannedEta: string;
  eta: string;
  status: ShipmentStatus;
  lastStatusAt: string;
  legs: Leg[];
  milestones: Milestone[];
  scenarioOrder: boolean;
  updates?: ShipmentUpdate[];
  customsHold?: boolean;
  /** occurredAt of the last applied absolute ETA change — older events are ignored (out-of-order handling). */
  lastChangeAt?: string;
}

export interface Sailing {
  sailingId: string;
  route: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  status?: "SCHEDULED" | "DELAYED" | "CANCELLED";
  delayMinutes?: number;
}

export type TransportEventType =
  | "SAILING_DELAYED"
  | "SAILING_CANCELLED"
  | "ROAD_ETA_UPDATED"
  | "TERMINAL_DELAYED"
  | "CUSTOMS_HOLD_PLACED"
  | "STATUS_OVERDUE";

export interface TransportEvent {
  eventId: string;
  type: TransportEventType;
  occurredAt: string;
  source: string;
  reason: string;
  orderRef?: string;
  sailingId?: string;
  replacementSailingId?: string;
  delayMinutes?: number;
  newEta?: string;
}

export type ExceptionStatus = "OPEN" | "HELD" | "ACKNOWLEDGED" | "ESCALATED" | "RECOVERED" | "RESOLVED" | "CLOSED";

export const ACTIVE_STATUSES: ExceptionStatus[] = ["OPEN", "HELD", "ACKNOWLEDGED", "ESCALATED", "RECOVERED"];

export type ReasonCode =
  | "DELIVERED_IN_WINDOW"
  | "NEW_WINDOW_AGREED"
  | "CUSTOMER_INFORMED_NO_ACTION"
  | "FALSE_ALARM"
  | "OTHER";

export interface Evaluation {
  at: string;
  eventId: string | null;
  type: string;
  severity: Severity;
  minutesLate: number;
  nextDay: boolean;
  windowAssumed: boolean;
  notification: NotificationDecision;
  rules: string[];
}

export interface ResponseAction {
  at: string;
  actorId: string;
  text: string;
}

export interface ExceptionRecord {
  exceptionId: string;
  orderRef: string;
  customerId: string;
  type: Cause;
  severity: Severity;
  ownerGroup: OwnerGroup;
  status: ExceptionStatus;
  assigneeId: string | null;
  openedAt: string;
  dueAt: string | null;
  acknowledgedAt: string | null;
  escalatedAt: string | null;
  recoveredAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  windowAssumed: boolean;
  minutesLate: number;
  rulesApplied: string[];
  notification: NotificationDecision;
  reasonCode: ReasonCode | null;
  resolutionNote: string | null;
  release: "R1" | "R2";
  actions: ResponseAction[];
  evaluations: Evaluation[];
}

export type MessageKind = "DELAY" | "RECOVERY" | "ACTION_REQUIRED";
/**
 * SENT: delivered to portal + e-mail · PENDING_NOTE: critical message waiting up to 5 min for a planner note (D-08) ·
 * SHADOW: customer not in the pilot, logged only (AC-13.1) · SUPPRESSED: throttled (ER-12) ·
 * NOT_IN_RELEASE: decided by the rules but delivered only from release 2 (customs, US-09) ·
 * WITHDRAWN: a pending message cancelled because the order recovered before it went out.
 */
export type MessageStatus = "SENT" | "PENDING_NOTE" | "SHADOW" | "SUPPRESSED" | "NOT_IN_RELEASE" | "WITHDRAWN";

export interface CustomerMessage {
  messageId: string;
  orderRef: string;
  customerId: string;
  exceptionId: string;
  kind: MessageKind;
  severity: Severity;
  status: MessageStatus;
  createdAt: string;
  sendAt: string | null;
  sentAt: string | null;
  channels: ("PORTAL" | "EMAIL")[];
  content: {
    headline: string;
    agreedWindow: string;
    newEta: string | null;
    reasonCategory: string;
    nextStep: string;
    plannerNote: string | null;
  };
}

export interface CallTask {
  taskId: string;
  exceptionId: string;
  orderRef: string;
  customerId: string;
  createdAt: string;
  status: "OPEN" | "DONE";
  outcome: string | null;
  completedAt: string | null;
  completedBy: string | null;
}

export interface AuditEntry {
  seq: number;
  at: string;
  actorId: string;
  action: string;
  orderRef: string | null;
  exceptionId: string | null;
  detail: string;
}

export interface EventLogEntry {
  eventId: string;
  type: TransportEventType;
  receivedAt: string;
  occurredAt: string;
  outcome: "PROCESSED" | "DUPLICATE_IGNORED" | "STALE_IGNORED";
  affectedOrders: string[];
  exceptionsOpened: string[];
  summary: string;
}

export type Role = "ROAD_PLANNER" | "SHIFT_LEAD" | "TERMINAL_OPERATOR" | "CUSTOMS_AGENT" | "CS_AGENT";

export interface User {
  userId: string;
  name: string;
  role: Role;
  ownerGroup: OwnerGroup | null;
  title: string;
}

export interface DemoState {
  now: string;
  shipments: Record<string, Shipment>;
  sailings: Record<string, Sailing>;
  customers: Record<string, Customer>;
  users: Record<string, User>;
  exceptions: ExceptionRecord[];
  messages: CustomerMessage[];
  callTasks: CallTask[];
  audit: AuditEntry[];
  events: EventLogEntry[];
  processedEventIds: string[];
  /** Idempotency keys of commands already applied (proposed API: Idempotency-Key header). */
  processedCommandKeys: string[];
  commandReceipts?: Record<string, { fingerprint: string; result: unknown }>;
  counters: { exception: number; message: number; task: number; audit: number };
  scenarioStep: number;
}

// Mock implementation of the exception component's REST API (contract: demo/mock-apis/openapi.yaml).
// It runs in the browser: no server, no paid service. Each method names the endpoint it stands in for.
// Commands run on a copy of the state and are committed only when they succeed (all-or-nothing),
// like a transaction in the proposed service.
import {
  acknowledge,
  addAction,
  advanceClock,
  assign,
  completeCallTask,
  confirmStatus,
  DomainError,
  processEvent,
  replan,
  resolve,
  sendWithNote,
  type EventOutcome,
} from "@/domain/engine";
import { customerView, type CustomerView } from "@/domain/customer-view";
import { initialState } from "@/domain/seed";
import type { DemoState, ReasonCode, TimeWindow, TransportEvent } from "@/domain/types";

/** RFC 9457 problem details, as the proposed API returns them. */
export interface Problem {
  type: string;
  title: string;
  status: number;
  detail: string;
}

export class ApiError extends Error {
  constructor(public readonly problem: Problem) {
    super(problem.detail);
  }
}

const STATUS: Record<DomainError["code"], [number, string]> = {
  NOT_FOUND: [404, "Not found"],
  FORBIDDEN: [403, "Not allowed for this role"],
  INVALID_TRANSITION: [409, "Not possible in the current state"],
  VALIDATION: [422, "Invalid input"],
};

const STORAGE_KEY = "control-tower-demo-v1";

export interface Faults {
  /** Simulates the TMS API being unavailable: reads fail with 503, as in NFR-04. */
  tmsUnavailable: boolean;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${canonical((value as Record<string,unknown>)[k])}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}

type Listener = () => void;

export class MockControlTowerApi {
  private state: DemoState;
  private listeners = new Set<Listener>();
  faults: Faults = { tmsUnavailable: false };
  latencyMs: number;

  constructor(options: { latencyMs?: number; persist?: boolean; state?: DemoState } = {}) {
    this.latencyMs = options.latencyMs ?? 120;
    this.persist = options.persist ?? false;
    this.state = options.state ?? this.load() ?? initialState();
  }

  private persist: boolean;

  private load(): DemoState | null {
    if (!this.persist || typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DemoState) : null;
    } catch {
      return null;
    }
  }

  private save() {
    if (!this.persist || typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* storage unavailable: the demo still works for this page view */
    }
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Current state for rendering. Replaced (never mutated) on every commit. */
  snapshot = () => this.state;

  private emit() {
    this.save();
    for (const l of this.listeners) l();
  }

  private wait() {
    return this.latencyMs ? new Promise((r) => setTimeout(r, this.latencyMs)) : Promise.resolve();
  }

  private async read<T>(fn: (s: DemoState) => T): Promise<T> {
    await this.wait();
    if (this.faults.tmsUnavailable) {
      throw new ApiError({ type: "https://example.org/problems/upstream-unavailable", title: "TMS unavailable", status: 503, detail: "The TMS API did not answer. Data shown may be out of date; try again in a moment." });
    }
    return structuredClone(fn(this.state));
  }

  private async command<T>(fn: (draft: DemoState) => T, idempotencyKey?: string, identity?: unknown): Promise<T> {
    await this.wait();
    const fingerprint = canonical(identity);
    if (idempotencyKey && this.state.processedCommandKeys.includes(idempotencyKey)) {
      const receipt = this.state.commandReceipts?.[idempotencyKey];
      // Legacy v1 sessions have no payload proof. Refuse their key rather than silently accepting it.
      if (!receipt || receipt.fingerprint !== fingerprint) throw new ApiError({ type:'https://example.org/problems/idempotency-conflict', title:'Idempotency key conflict', status:409, detail:'This key belongs to another command or an unverifiable legacy request. Use a new key for a new operation.' });
      return structuredClone(receipt.result) as T;
    }
    const draft = structuredClone(this.state);
    try {
      const result = fn(draft);
      if (idempotencyKey) {
        draft.processedCommandKeys.push(idempotencyKey);
        draft.commandReceipts ??= {};
        Object.defineProperty(draft.commandReceipts, idempotencyKey, { value:{fingerprint,result:structuredClone(result)}, enumerable:true, writable:true, configurable:true });
      }
      this.state = draft;
      this.emit();
      return result;
    } catch (e) {
      if (e instanceof DomainError) {
        const [status, title] = STATUS[e.code];
        throw new ApiError({ type: `https://example.org/problems/${e.code.toLowerCase().replace(/_/g, "-")}`, title, status, detail: e.message });
      }
      throw e;
    }
  }

  // GET /v1/shipments · GET /v1/shipments/{orderRef}
  listShipments = () => this.read((s) => Object.values(s.shipments));
  getShipment = (orderRef: string) =>
    this.read((s) => {
      const shipment = s.shipments[orderRef];
      if (!shipment) throw new ApiError({ type: "https://example.org/problems/not-found", title: "Not found", status: 404, detail: `Order ${orderRef} does not exist` });
      return shipment;
    });

  // GET /v1/exceptions · GET /v1/exceptions/{exceptionId}
  listExceptions = () => this.read((s) => s.exceptions);

  // GET /v1/orders/{orderRef}/tracking — customer-facing; returns only what the customer was told
  getTracking = (orderRef: string) => this.read((s): CustomerView | null => customerView(s, orderRef));

  // POST /v1/tms-events (webhook receiver) → 202 Accepted, or 200 for a duplicate event ID
  postTmsEvent = (event: TransportEvent) =>
    this.command((d): EventOutcome & { httpStatus: 200 | 202 } => {
      if (event.occurredAt > d.now) d.now = event.occurredAt;
      const out = processEvent(d, event);
      return { ...out, httpStatus: out.outcome === "PROCESSED" ? 202 : 200 };
    });

  // POST /v1/exceptions/{id}/acknowledge · /assign · /actions · /confirm-status · /replan · /resolve
  acknowledge = (id: string, actorId: string, key?: string) => this.command((d) => acknowledge(d, id, actorId), key, ["acknowledge",id,actorId]);
  assign = (id: string, assigneeId: string, actorId: string, key?: string) => this.command((d) => assign(d, id, assigneeId, actorId), key, ["assign",id,assigneeId,actorId]);
  addAction = (id: string, text: string, actorId: string, key?: string) => this.command((d) => addAction(d, id, text, actorId), key, ["addAction",id,text,actorId]);
  confirmStatus = (id: string, outcome: "ON_TIME" | "DELAYED", newEta: string | null, actorId: string, key?: string) =>
    this.command((d) => confirmStatus(d, id, outcome, newEta, actorId), key, ["confirmStatus",id,outcome,newEta,actorId]);
  replan = (id: string, window: TimeWindow, actorId: string, key?: string) => this.command((d) => replan(d, id, window, actorId), key, ["replan",id,window,actorId]);
  resolve = (id: string, reason: ReasonCode, note: string, actorId: string, key?: string) => this.command((d) => resolve(d, id, reason, note, actorId), key, ["resolve",id,reason,note,actorId]);

  /**
   * Scenario step 6 as ONE command: register the action and, if a message is waiting for a note, send it with the note.
   * One commit means a page reload can never leave half of it applied.
   */
  respondAndSend = (id: string, text: string, messageId: string | null, note: string, actorId: string, key?: string) =>
    this.command((d) => {
      addAction(d, id, text, actorId);
      const pending = messageId ? d.messages.find((m) => m.messageId === messageId && m.status === "PENDING_NOTE") : undefined;
      if (pending) sendWithNote(d, pending.messageId, note, actorId);
    }, key, ["respondAndSend",id,text,messageId,note,actorId]);

  // POST /v1/messages/{id}/send · POST /v1/call-tasks/{id}/complete
  sendWithNote = (messageId: string, note: string, actorId: string, key?: string) => this.command((d) => sendWithNote(d, messageId, note, actorId), key, ["sendWithNote",messageId,note,actorId]);
  completeCallTask = (taskId: string, outcome: string, actorId: string, key?: string) => this.command((d) => completeCallTask(d, taskId, outcome, actorId), key, ["completeCallTask",taskId,outcome,actorId]);

  // Demo-only controls (no counterpart in the proposed API)
  advanceClock = (minutes: number) => this.command((d) => advanceClock(d, minutes));
  setScenarioStep = (step: number) => this.command((d) => void (d.scenarioStep = step));
  setFault = (faults: Partial<Faults>) => {
    this.faults = { ...this.faults, ...faults };
    this.state = { ...this.state };
    this.emit();
  };
  reset = () => {
    this.state = initialState();
    this.faults = { tmsUnavailable: false };
    this.emit();
  };
}

let instance: MockControlTowerApi | null = null;
/** One API instance per browser tab; the state survives navigation and reloads (sessionStorage). */
export function getApi(): MockControlTowerApi {
  if (!instance) instance = new MockControlTowerApi({ persist: true });
  return instance;
}

const serverState = initialState();
export const serverSnapshot = () => serverState;

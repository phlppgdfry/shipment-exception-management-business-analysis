// Lifecycle, permissions and failure paths: the parts of the engine the rules module does not decide.
import { describe, expect, test } from "vitest";
import {
  acknowledge,
  activeExceptionFor,
  addAction,
  advanceClock,
  assign,
  completeCallTask,
  confirmStatus,
  DomainError,
  processEvent,
  replan,
  resolve,
  TRANSITIONS,
} from "@/domain/engine";
import { customerView } from "@/domain/customer-view";
import { initialState, SCENARIO } from "@/domain/seed";
import { EXPORT_COLUMNS, pilotExportCsv } from "@/domain/pilot-export";
import { overview } from "@/domain/kpis";

const fresh = () => {
  const state = initialState();
  state.now = SCENARIO.delayEvent.occurredAt;
  processEvent(state, SCENARIO.delayEvent);
  return state;
};

describe("idempotency (NFR-03)", () => {
  test("a replayed event opens no second exception and sends no second message", () => {
    const state = fresh();
    const before = { ex: state.exceptions.length, msg: state.messages.length };
    const out = processEvent(state, SCENARIO.delayEvent);
    expect(out.outcome).toBe("DUPLICATE_IGNORED");
    expect(state.exceptions.length).toBe(before.ex);
    expect(state.messages.length).toBe(before.msg);
    expect(state.events.at(-1)?.outcome).toBe("DUPLICATE_IGNORED");
  });
});

describe("escalation (ER-09, AC-03.4)", () => {
  test("a critical exception not acknowledged within 30 minutes is escalated; the shift lead assigns it (AC-03.5)", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    advanceClock(state, 29);
    expect(ex.status).toBe("OPEN");
    advanceClock(state, 1);
    expect(ex.status).toBe("ESCALATED");
    expect(() => acknowledge(state, ex.exceptionId, "USR-PLANNER")).toThrow(DomainError);
    assign(state, ex.exceptionId, "USR-PLANNER-2", "USR-SHIFTLEAD");
    expect(ex.status).toBe("ACKNOWLEDGED");
  });

  test("a minor exception has no response time and never escalates", () => {
    const state = initialState();
    const minor = activeExceptionFor(state, "D2D-48255")!;
    expect(minor.dueAt).toBeNull();
    advanceClock(state, 240);
    expect(minor.status).toBe("OPEN");
  });
});

describe("permissions (NFR-06)", () => {
  test("a terminal coordinator cannot acknowledge a road-planning exception", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    expect(() => acknowledge(state, ex.exceptionId, "USR-TERMINAL")).toThrow(/cannot change exceptions owned by Road planning/);
  });
  test("only the shift lead assigns", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    expect(() => assign(state, ex.exceptionId, "USR-PLANNER-2", "USR-PLANNER")).toThrow(/Only the shift lead/);
  });
  test("an exception cannot be assigned to someone outside its owner group", () => {
    const state = initialState();
    const terminal = activeExceptionFor(state, "D2D-48222")!;
    expect(() => assign(state, terminal.exceptionId, "USR-PLANNER", "USR-SHIFTLEAD")).toThrow(/not in Terminal operations/);
  });
});

describe("resolution (AC-04.3)", () => {
  test("an open exception must be acknowledged before it is resolved", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    expect(() => resolve(state, ex.exceptionId, "NEW_WINDOW_AGREED", "", "USR-PLANNER")).toThrow(/Acknowledge the exception/);
  });
  test("reason 'other' requires a note (DEF-03)", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    acknowledge(state, ex.exceptionId, "USR-PLANNER");
    expect(() => resolve(state, ex.exceptionId, "OTHER", "  ", "USR-PLANNER")).toThrow(/note is required/);
    resolve(state, ex.exceptionId, "OTHER", "Customer collects at the terminal", "USR-PLANNER");
    expect(ex.status).toBe("RESOLVED");
  });
  test("a response action needs text", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    expect(() => addAction(state, ex.exceptionId, " ", "USR-PLANNER")).toThrow(/Describe the action/);
  });
  test("a re-planned window must end after it starts", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    acknowledge(state, ex.exceptionId, "USR-PLANNER");
    expect(() => replan(state, ex.exceptionId, { start: "2026-02-05T15:00:00Z", end: "2026-02-05T13:00:00Z" }, "USR-PLANNER")).toThrow(/end after it starts/);
  });
});

describe("missing status (US-08, ER-07)", () => {
  test("held: no customer message; confirmed on time → closed as false alarm, still no message", () => {
    const state = initialState();
    const ex = activeExceptionFor(state, "D2D-48288")!;
    expect(state.messages.some((m) => m.orderRef === "D2D-48288")).toBe(false);
    confirmStatus(state, ex.exceptionId, "ON_TIME", null, "USR-PLANNER");
    expect(ex.status).toBe("CLOSED");
    expect(ex.reasonCode).toBe("FALSE_ALARM");
    expect(state.messages.some((m) => m.orderRef === "D2D-48288")).toBe(false);
    expect(customerView(state, "D2D-48288")!.headline).toBe("On schedule");
  });
  test("held: confirmed delay → re-evaluated as a road delay and the customer is told", () => {
    const state = initialState();
    const ex = activeExceptionFor(state, "D2D-48288")!;
    confirmStatus(state, ex.exceptionId, "DELAYED", "2026-02-04T16:30:00Z", "USR-PLANNER");
    expect(ex.status).toBe("OPEN");
    expect(ex.type).toBe("ROAD_DELAY");
    expect(ex.severity).toBe("CRITICAL"); // 150 min → major, time-critical → critical
    expect(state.messages.filter((m) => m.orderRef === "D2D-48288").map((m) => m.status)).toEqual(["PENDING_NOTE"]);
  });
  test("a held exception cannot be acknowledged before it is confirmed", () => {
    const state = initialState();
    const ex = activeExceptionFor(state, "D2D-48288")!;
    expect(() => acknowledge(state, ex.exceptionId, "USR-PLANNER")).toThrow(DomainError);
  });
});

describe("recovery before the customer was told", () => {
  test("a pending critical message is withdrawn and no recovery message is sent", () => {
    const state = fresh();
    const ex = activeExceptionFor(state, SCENARIO.orderRef)!;
    acknowledge(state, ex.exceptionId, "USR-PLANNER");
    replan(state, ex.exceptionId, SCENARIO.newWindow, "USR-PLANNER");
    const msgs = state.messages.filter((m) => m.orderRef === SCENARIO.orderRef);
    expect(msgs.map((m) => m.status)).toEqual(["WITHDRAWN"]);
    expect(ex.status).toBe("RECOVERED");
    expect(customerView(state, SCENARIO.orderRef)!.headline).toBe("On schedule");
  });
});

describe("call tasks (US-11)", () => {
  test("closing a call task requires an outcome; only customer service closes it", () => {
    const state = fresh();
    const task = state.callTasks.find((t) => t.orderRef === SCENARIO.orderRef)!;
    expect(() => completeCallTask(state, task.taskId, "Called", "USR-PLANNER")).toThrow(/customer service/);
    expect(() => completeCallTask(state, task.taskId, " ", "USR-CS")).toThrow(/outcome/);
    completeCallTask(state, task.taskId, "Spoke to the transport manager; they re-plan the dock.", "USR-CS");
    expect(task.status).toBe("DONE");
  });
});

describe("lifecycle table", () => {
  test("terminal states have no way out, and every state is reachable from OPEN or HELD", () => {
    expect(TRANSITIONS.CLOSED).toEqual([]);
    const reachable = new Set<string>(["OPEN", "HELD"]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const s of [...reachable]) for (const t of TRANSITIONS[s as keyof typeof TRANSITIONS]) if (!reachable.has(t)) { reachable.add(t); grew = true; }
    }
    expect([...reachable].sort()).toEqual(Object.keys(TRANSITIONS).sort());
  });
});

describe("measurement (US-13)", () => {
  test("the pilot export has the AC-13.2 columns and one row per exception", () => {
    const state = fresh();
    const csv = pilotExportCsv(state).trim().split("\n");
    expect(csv[0].split(",")).toEqual([...EXPORT_COLUMNS]);
    expect(csv.length - 1).toBe(state.exceptions.length);
  });
  test("overview counts are consistent", () => {
    const o = overview(fresh());
    expect(o.onSchedule + o.delayed).toBe(o.activeShipments);
    expect(o.criticalExceptions).toBeGreaterThan(0);
    expect(o.k1ProactiveRate.numerator).toBeLessThanOrEqual(o.k1ProactiveRate.denominator);
  });
});

describe("held exceptions past their response time (D-09)", () => {
  test("are escalated to the shift lead but stay held: still no customer message", () => {
    const state = initialState();
    const ex = activeExceptionFor(state, "D2D-48288")!;
    expect(ex.dueAt).toBe("2026-02-04T10:20:00Z");
    advanceClock(state, 29);
    expect(ex.escalatedAt).toBeNull();
    advanceClock(state, 1);
    expect(ex.status).toBe("HELD");
    expect(ex.escalatedAt).toBe("2026-02-04T10:20:00Z");
    expect(state.messages.some((m) => m.orderRef === "D2D-48288")).toBe(false);
    expect(state.audit.at(-1)?.action).toBe("HELD_ESCALATED");
  });
  test("the shift lead can give a held exception to a planner; it stays held until confirmed", () => {
    const state = initialState();
    const ex = activeExceptionFor(state, "D2D-48288")!;
    advanceClock(state, 30);
    assign(state, ex.exceptionId, "USR-PLANNER-2", "USR-SHIFTLEAD");
    expect(ex.status).toBe("HELD");
    expect(ex.assigneeId).toBe("USR-PLANNER-2");
    confirmStatus(state, ex.exceptionId, "ON_TIME", null, "USR-PLANNER-2");
    expect(ex.status).toBe("CLOSED");
  });
  test("escalation happens once", () => {
    const state = initialState();
    advanceClock(state, 30);
    advanceClock(state, 60);
    expect(state.audit.filter((a) => a.action === "HELD_ESCALATED")).toHaveLength(1);
  });
});

describe("out-of-order events (TA-4)", () => {
  test("an ETA update that happened before the last applied one is logged but not applied", () => {
    const state = initialState();
    const before = { eta: state.shipments["D2D-48231"].eta, messages: state.messages.length, evaluations: activeExceptionFor(state, "D2D-48231")!.evaluations.length };
    expect(before.eta).toBe("2026-02-04T13:50:00Z");
    const out = processEvent(state, SCENARIO.staleEvent);
    expect(out.outcome).toBe("STALE_IGNORED");
    expect(state.shipments["D2D-48231"].eta).toBe(before.eta);
    expect(state.messages.length).toBe(before.messages);
    expect(activeExceptionFor(state, "D2D-48231")!.evaluations.length).toBe(before.evaluations);
    expect(state.audit.some((a) => a.action === "EVENT_STALE" && a.orderRef === "D2D-48231")).toBe(true);
  });
  test("a newer ETA update is still applied", () => {
    const state = initialState();
    processEvent(state, { ...SCENARIO.staleEvent, eventId: "EVT-NEWER", occurredAt: "2026-02-04T09:55:00Z", newEta: "2026-02-04T14:10:00Z" });
    expect(state.shipments["D2D-48231"].eta).toBe("2026-02-04T14:10:00Z");
  });
});

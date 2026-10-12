// The guided scenario of the demo, step by step, against the domain engine.
// These steps are the same ones the "Guided scenario" panel performs in the UI.
import { describe, expect, test } from "vitest";
import { addAction, advanceClock, processEvent, replan, resolve, sendWithNote, activeExceptionFor, assign } from "@/domain/engine";
import { customerView } from "@/domain/customer-view";
import { initialState, SCENARIO } from "@/domain/seed";

describe("guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h", () => {
  const state = initialState();
  const ref = SCENARIO.orderRef;

  test("1. the shipment starts on schedule", () => {
    expect(activeExceptionFor(state, ref)).toBeUndefined();
    expect(customerView(state, ref)?.headline).toBe("On schedule");
  });

  test("2–3. the sailing delay reaches every order on E-312; only orders outside their window become exceptions (ER-01)", () => {
    state.now = SCENARIO.delayEvent.occurredAt;
    const out = processEvent(state, SCENARIO.delayEvent);
    expect(out.outcome).toBe("PROCESSED");
    expect(out.affectedOrders.length).toBe(11);
    expect(out.exceptionsOpened.length).toBe(4);
    // Calder Retail has a wide window: later, but not late
    expect(activeExceptionFor(state, "D2D-48177")).toBeUndefined();
  });

  test("4. classification: 280 min late → major, reefer → critical, key account → message + call task", () => {
    const ex = activeExceptionFor(state, ref)!;
    expect(ex.minutesLate).toBe(280);
    expect(ex.severity).toBe("CRITICAL");
    expect(ex.ownerGroup).toBe("ROAD_PLANNING");
    expect(ex.notification).toBe("NOTIFY_AND_CALL");
    expect(ex.rulesApplied).toEqual(expect.arrayContaining(["ER-02", "ER-04", "ER-11"]));
    expect(ex.dueAt).toBe("2026-02-04T10:22:00Z"); // 30 min response time (ER-09)
    expect(state.callTasks.some((t) => t.orderRef === ref)).toBe(true);
    const msg = state.messages.find((m) => m.orderRef === ref)!;
    expect(msg.status).toBe("PENDING_NOTE"); // D-08: planner may add a note for 5 minutes
  });

  test("5. the shift lead assigns the exception to the senior planner", () => {
    const ex = activeExceptionFor(state, ref)!;
    assign(state, ex.exceptionId, SCENARIO.assignTo, "USR-SHIFTLEAD");
    expect(ex.status).toBe("ACKNOWLEDGED");
    expect(ex.assigneeId).toBe("USR-PLANNER");
  });

  test("6. the planner registers a response action and sends the message with a note", () => {
    const ex = activeExceptionFor(state, ref)!;
    addAction(state, ex.exceptionId, SCENARIO.responseAction, "USR-PLANNER");
    const msg = state.messages.find((m) => m.orderRef === ref && m.status === "PENDING_NOTE")!;
    sendWithNote(state, msg.messageId, SCENARIO.messageNote, "USR-PLANNER");
    expect(msg.status).toBe("SENT");
    expect(ex.actions).toHaveLength(1);
  });

  test("7. the customer view now shows the delay, new ETA and next step — and no driver data (NFR-05)", () => {
    const view = customerView(state, ref)!;
    expect(view.tone).toBe("critical");
    expect(view.expected).toBe("Thu 12:40");
    expect(view.plannerNote).toBe(SCENARIO.messageNote);
    const text = JSON.stringify(view);
    expect(text).not.toMatch(/driver|phone|\+44|latitude|longitude/i);
    // Nothing internal reaches the customer: no severity codes, owners or rule IDs
    expect(text).not.toMatch(/"severity"|ROAD_PLANNING|ER-\d\d|PENDING_NOTE|SUPPRESSED/);
  });

  test("8. a new window is agreed: the order recovers, the customer hears it (ER-13), the planner resolves", () => {
    const ex = activeExceptionFor(state, ref)!;
    advanceClock(state, 10);
    replan(state, ex.exceptionId, SCENARIO.newWindow, "USR-PLANNER");
    expect(ex.status).toBe("RECOVERED");
    expect(state.messages.filter((m) => m.orderRef === ref && m.kind === "RECOVERY" && m.status === "SENT")).toHaveLength(1);
    expect(customerView(state, ref)!.headline).toBe("Back on schedule");
    resolve(state, ex.exceptionId, SCENARIO.resolveReason, "", "USR-PLANNER");
    expect(ex.status).toBe("RESOLVED");
    expect(ex.reasonCode).toBe("NEW_WINDOW_AGREED");
  });

  test("9. the audit trail tells the story in order", () => {
    const ex = state.exceptions.find((e) => e.orderRef === ref)!;
    const actions = state.audit.filter((a) => a.exceptionId === ex.exceptionId).map((a) => a.action);
    expect(actions[0]).toBe("EXCEPTION_OPENED");
    expect(actions).toEqual(expect.arrayContaining(["CALL_TASK_CREATED", "ASSIGNED", "ACTION_ADDED", "MESSAGE_SENT", "WINDOW_AGREED", "STATUS_CHANGED"]));
    expect(actions[actions.length - 1]).toBe("STATUS_CHANGED");
    const seqs = state.audit.map((a) => a.seq);
    expect(seqs).toEqual([...seqs].sort((a, b) => a - b));
  });
});

describe("the morning replay", () => {
  test("starts at 09:50 with the morning's exceptions, all produced by the rules", () => {
    const state = initialState();
    expect(state.now).toBe("2026-02-04T09:50:00Z");
    const byOrder = Object.fromEntries(state.exceptions.map((e) => [e.orderRef, e]));
    expect(byOrder["D2D-48240"].type).toBe("CUSTOMS_HOLD");
    expect(byOrder["D2D-48240"].ownerGroup).toBe("CUSTOMS_DESK");
    expect(byOrder["D2D-48222"].ownerGroup).toBe("TERMINAL_OPS");
    expect(byOrder["D2D-48288"].status).toBe("HELD");
    expect(byOrder["D2D-48288"].severity).toBe("CRITICAL"); // time-critical, one level up (ER-04)
    expect(byOrder["D2D-48255"].severity).toBe("MINOR");
    expect(byOrder["D2D-48302"].type).toBe("SAILING_CANCELLED");
    // Both orders on the cancelled sailing S-417 are critical (ER-05); Arden Steel is in the control group
    expect(byOrder["D2D-48309"].severity).toBe("CRITICAL");
    expect(state.messages.find((m) => m.orderRef === "D2D-48309")?.status).toBe("SHADOW");
    expect(byOrder["D2D-48231"].status).toBe("ACKNOWLEDGED");
  });

  test("Oakridge was told 'major' at 09:15; the 09:45 update with the same severity is throttled (ER-12)", () => {
    const state = initialState();
    const msgs = state.messages.filter((m) => m.orderRef === "D2D-48231");
    expect(msgs.map((m) => m.status)).toEqual(["SENT", "SUPPRESSED"]);
  });

  test("the control group is in shadow mode: exceptions logged, nothing sent (AC-13.1)", () => {
    const state = initialState();
    const control = state.messages.filter((m) => !state.customers[m.customerId].pilot);
    expect(control.length).toBeGreaterThan(0);
    expect(control.every((m) => m.status === "SHADOW")).toBe(true);
  });

  test("the cancelled sailing's critical message went out without a note after 5 minutes (D-08)", () => {
    const state = initialState();
    const msg = state.messages.find((m) => m.orderRef === "D2D-48302")!;
    expect(msg.status).toBe("SENT");
    expect(msg.sentAt).toBe("2026-02-04T09:43:00Z");
  });
});

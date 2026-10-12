// Builds the demo's starting state from the fictional dataset in demo/mock-data. The morning's events
// are replayed through the engine, so every exception on screen at start-up was produced by the rules.
import customers from "../../../mock-data/customers.json";
import sailings from "../../../mock-data/sailings.json";
import shipments from "../../../mock-data/shipments.json";
import users from "../../../mock-data/users.json";
import scenarioFile from "../../../mock-data/scenario.json";
import { acknowledge, advanceClock } from "./engine";
import { processEvent } from "./engine";
import { minutesBetween } from "./time";
import type { Customer, DemoState, Sailing, Shipment, TransportEvent, User } from "./types";

export const SCENARIO = scenarioFile.scenario as {
  orderRef: string;
  staleEvent: TransportEvent;
  delayEvent: TransportEvent;
  assignTo: string;
  responseAction: string;
  messageNote: string;
  newWindow: { start: string; end: string };
  resolveReason: "NEW_WINDOW_AGREED";
};
export const DEMO_START: string = scenarioFile.demoStart;
/** The morning shift starts here; the first event is at 08:30. */
const SHIFT_START = "2026-02-04T08:00:00Z";

const byKey = <T, K extends keyof T>(list: T[], key: K) => Object.fromEntries(list.map((x) => [x[key] as string, structuredClone(x)]));

export function emptyState(): DemoState {
  return {
    now: SHIFT_START,
    shipments: byKey(shipments as Shipment[], "orderRef"),
    sailings: byKey(sailings as Sailing[], "sailingId"),
    customers: byKey(customers as Customer[], "customerId"),
    users: byKey(users as User[], "userId"),
    exceptions: [],
    messages: [],
    callTasks: [],
    audit: [],
    events: [],
    processedEventIds: [],
    processedCommandKeys: [],
    counters: { exception: 0, message: 0, task: 0, audit: 0 },
    scenarioStep: 0,
  };
}

function advanceTo(state: DemoState, iso: string) {
  const minutes = minutesBetween(state.now, iso);
  if (minutes > 0) advanceClock(state, minutes);
}

/** The state at 09:50 on the demo Wednesday, after the morning's events and commands. */
export function initialState(): DemoState {
  const state = emptyState();
  type Step = { at: string; run: () => void };
  const steps: Step[] = [
    ...(scenarioFile.morningEvents as TransportEvent[]).map((e) => ({ at: e.occurredAt, run: () => void processEvent(state, e) })),
    ...scenarioFile.morningCommands.map((c) => ({
      at: c.at,
      run: () => {
        const ex = state.exceptions.find((x) => x.orderRef === c.orderRef && x.status === "OPEN");
        if (ex && c.command === "acknowledge") acknowledge(state, ex.exceptionId, c.actor);
      },
    })),
  ].sort((a, b) => a.at.localeCompare(b.at));
  for (const step of steps) {
    advanceTo(state, step.at);
    step.run();
  }
  advanceTo(state, DEMO_START);
  return state;
}

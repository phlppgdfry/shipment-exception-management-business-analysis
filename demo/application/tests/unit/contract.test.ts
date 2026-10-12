// Contract test: the objects the demo's mock API returns conform to the proposed OpenAPI contract
// (demo/mock-apis/openapi.yaml), and so do the example payloads. Run with UPDATE_EXAMPLES=1 to rewrite the
// examples from the engine (they are then reviewed in the pull request like any other change).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { describe, expect, test } from "vitest";
import { MockControlTowerApi, ApiError } from "@/api/mock-api";
import { SCENARIO } from "@/domain/seed";

const dir = join(__dirname, "../../../mock-apis");
const spec = parse(readFileSync(join(dir, "openapi.yaml"), "utf8"));
type Schema = Record<string, unknown>;

/** A deliberately small JSON-schema checker: $ref, type (incl. null), enum, required, properties, items, oneOf. */
function check(value: unknown, schema: Schema, path = "$"): string[] {
  if (schema.$ref) return check(value, spec.components.schemas[String(schema.$ref).split("/").pop()!], path);
  if (schema.oneOf) {
    const ok = (schema.oneOf as Schema[]).some((s) => check(value, s, path).length === 0);
    return ok ? [] : [`${path}: matches none of oneOf`];
  }
  const errors: string[] = [];
  const types = schema.type ? ([] as string[]).concat(schema.type as string) : [];
  const actual = value === null ? "null" : Array.isArray(value) ? "array" : Number.isInteger(value) ? "integer" : typeof value;
  if (types.length && !types.includes(actual) && !(actual === "integer" && types.includes("number"))) return [`${path}: expected ${types.join("|")}, got ${actual}`];
  if (schema.enum && !(schema.enum as unknown[]).includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in enum`);
  if (actual === "object" && value) {
    for (const r of (schema.required as string[]) ?? []) if (!(r in (value as object))) errors.push(`${path}: missing ${r}`);
    for (const [k, sub] of Object.entries((schema.properties as Record<string, Schema>) ?? {})) {
      if (k in (value as object)) errors.push(...check((value as Record<string, unknown>)[k], sub, `${path}.${k}`));
    }
  }
  if (actual === "array" && schema.items) (value as unknown[]).forEach((v, i) => errors.push(...check(v, schema.items as Schema, `${path}[${i}]`)));
  return errors;
}
const schema = (name: string): Schema => ({ $ref: `#/components/schemas/${name}` });

async function scenarioApi() {
  const api = new MockControlTowerApi({ latencyMs: 0 });
  const outcome = await api.postTmsEvent(SCENARIO.delayEvent);
  const ex = (await api.listExceptions()).find((e) => e.orderRef === SCENARIO.orderRef)!;
  await api.assign(ex.exceptionId, "USR-PLANNER", "USR-SHIFTLEAD");
  const pending = api.snapshot().messages.find((m) => m.orderRef === SCENARIO.orderRef && m.status === "PENDING_NOTE")!;
  await api.sendWithNote(pending.messageId, SCENARIO.messageNote, "USR-PLANNER");
  return { api, outcome, exceptionId: ex.exceptionId };
}

describe("mock API responses conform to openapi.yaml", () => {
  test("event outcome, shipments, exceptions, messages, tracking", async () => {
    const { api, outcome, exceptionId } = await scenarioApi();
    const { httpStatus, ...body } = outcome;
    expect(httpStatus).toBe(202);
    expect(check(body, schema("EventOutcome"))).toEqual([]);
    for (const s of await api.listShipments()) expect(check(s, schema("Shipment")), s.orderRef).toEqual([]);
    for (const e of await api.listExceptions()) expect(check(e, schema("Exception")), e.exceptionId).toEqual([]);
    for (const m of api.snapshot().messages) expect(check(m, schema("CustomerMessage")), m.messageId).toEqual([]);
    for (const t of api.snapshot().callTasks) expect(check(t, schema("CallTask")), t.taskId).toEqual([]);
    expect(check(await api.getTracking(SCENARIO.orderRef), schema("Tracking"))).toEqual([]);
    expect(check(SCENARIO.delayEvent, schema("TransportEvent"))).toEqual([]);
    expect(exceptionId).toMatch(/^EX-\d{4}$/);
  });

  test("a duplicate event returns 200 and changes nothing (NFR-03)", async () => {
    const { api } = await scenarioApi();
    const before = api.snapshot().exceptions.length;
    const again = await api.postTmsEvent(SCENARIO.delayEvent);
    expect(again.httpStatus).toBe(200);
    expect(again.outcome).toBe("DUPLICATE_IGNORED");
    expect(api.snapshot().exceptions.length).toBe(before);
  });

  test("a refused command returns RFC 9457 problem details with the documented status codes", async () => {
    const { api, exceptionId } = await scenarioApi();
    const fresh = (await api.listExceptions()).find((e) => e.status === "OPEN" && e.ownerGroup === "ROAD_PLANNING")!;
    const problem = await api.resolve(fresh.exceptionId, "NEW_WINDOW_AGREED", "", "USR-PLANNER").catch((e: ApiError) => e.problem);
    expect(problem).toMatchObject({ status: 409, title: "Not possible in the current state" });
    expect(check(problem, schema("Problem"))).toEqual([]);
    const forbidden = await api.assign(exceptionId, "USR-PLANNER-2", "USR-CS").catch((e: ApiError) => e.problem);
    expect(forbidden).toMatchObject({ status: 403 });
    const invalid = await api.resolve(exceptionId, "OTHER", "", "USR-PLANNER").catch((e: ApiError) => e.problem);
    expect(invalid).toMatchObject({ status: 422 });
  });

  test("a retried command with the same Idempotency-Key is applied once", async () => {
    const { api, exceptionId } = await scenarioApi();
    await api.addAction(exceptionId, "Called the consignee", "USR-PLANNER", "key-1");
    await api.addAction(exceptionId, "Called the consignee", "USR-PLANNER", "key-1");
    expect(api.snapshot().exceptions.find((e) => e.exceptionId === exceptionId)!.actions).toHaveLength(1);
  });

  test("a TMS outage returns 503 problem details for reads", async () => {
    const api = new MockControlTowerApi({ latencyMs: 0 });
    api.setFault({ tmsUnavailable: true });
    const problem = await api.listShipments().catch((e: ApiError) => e.problem);
    expect(problem).toMatchObject({ status: 503 });
  });
});

describe("example payloads", () => {
  const examples: Record<string, string> = {
    "tms-event-sailing-delayed.json": "TransportEvent",
    "event-outcome-processed.json": "EventOutcome",
    "exception-critical.json": "Exception",
    "tracking-delayed.json": "Tracking",
    "problem-409.json": "Problem",
  };

  test("are generated from the engine when UPDATE_EXAMPLES=1", async () => {
    if (!process.env.UPDATE_EXAMPLES) return;
    const { api, outcome, exceptionId } = await scenarioApi();
    const { httpStatus: _status, ...processed } = outcome;
    void _status;
    const fresh = (await api.listExceptions()).find((e) => e.status === "OPEN" && e.ownerGroup === "ROAD_PLANNING")!;
    const problem = await api.resolve(fresh.exceptionId, "NEW_WINDOW_AGREED", "", "USR-PLANNER").catch((e: ApiError) => e.problem);
    const write = (name: string, data: unknown) => writeFileSync(join(dir, "examples", name), JSON.stringify(data, null, 2) + "\n");
    write("tms-event-sailing-delayed.json", SCENARIO.delayEvent);
    write("event-outcome-processed.json", processed);
    write("exception-critical.json", (await api.listExceptions()).find((e) => e.exceptionId === exceptionId));
    write("tracking-delayed.json", await api.getTracking(SCENARIO.orderRef));
    write("problem-409.json", problem);
  });

  for (const [file, name] of Object.entries(examples)) {
    test(`${file} conforms to ${name}`, () => {
      const data = JSON.parse(readFileSync(join(dir, "examples", file), "utf8"));
      expect(check(data, schema(name))).toEqual([]);
    });
  }
});

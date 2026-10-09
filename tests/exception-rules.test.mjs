// Runs every Examples row of the @decision feature files against the rule module.
// The acceptance criteria are the test data: when the Product Owner changes a threshold,
// the analyst updates the .feature file and this test shows which examples changed meaning.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate, PARAMS, RULE_TEXT } from "../site/assets/exception-rules.mjs";
import { SEED_ORDERS } from "../site/assets/seed-data.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const featureDir = join(root, "docs/06-backlog/features");

function examplesFrom(text) {
  const rows = text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const cells = (l) => l.slice(1, -1).split("|").map((c) => c.trim());
  const [header, ...data] = rows.map(cells);
  return data.map((row) => Object.fromEntries(header.map((h, i) => [h, row[i]])));
}

const yes = (v) => v === "yes";
const orNull = (v) => (v === "-" ? null : v);
const toChange = (e) => ({
  cause: e.cause,
  minutesLate: Number(e.late),
  nextDay: yes(e.next_day),
  timeCritical: yes(e.time_critical),
  keyAccount: yes(e.key),
  prefersAllUpdates: yes(e.all_updates),
  statusConfirmed: yes(e.confirmed),
  lastNotifiedSeverity: orNull(e.last_sev),
  minutesSinceLastNotice: e.since === "-" ? null : Number(e.since),
});

const decisionFeatures = readdirSync(featureDir)
  .filter((f) => f.endsWith(".feature"))
  .filter((f) => readFileSync(join(featureDir, f), "utf8").includes("@decision"));

test("at least one executable feature file exists", () => {
  assert.ok(decisionFeatures.length > 0);
});

for (const file of decisionFeatures) {
  for (const e of examplesFrom(readFileSync(join(featureDir, file), "utf8"))) {
    test(`${e.id} ${e.title}`, () => {
      const r = evaluate(toChange(e));
      assert.equal(r.type, e.type);
      assert.equal(r.severity, e.severity);
      assert.equal(r.owner, orNull(e.owner));
      assert.equal(r.responseSlaMinutes, e.sla === "-" ? null : Number(e.sla));
      assert.equal(r.notification, e.notification);
    });
  }
}

test("every rule the module can fire has a plain-language explanation", () => {
  const fired = new Set();
  for (const file of decisionFeatures) {
    for (const e of examplesFrom(readFileSync(join(featureDir, file), "utf8"))) {
      evaluate(toChange(e)).rules.forEach((id) => fired.add(id));
    }
  }
  for (const id of fired) assert.ok(RULE_TEXT[id], `missing text for ${id}`);
  assert.equal(fired.size, Object.keys(RULE_TEXT).length, "every documented rule is exercised by an example");
});

test("severity never decreases when the delay grows (monotonic thresholds)", () => {
  const order = ["NONE", "MINOR", "MAJOR", "CRITICAL"];
  let previous = 0;
  for (let late = -60; late <= 600; late += 1) {
    const r = evaluate({ cause: "ROAD_DELAY", minutesLate: late, nextDay: false, timeCritical: false, keyAccount: false, prefersAllUpdates: false, statusConfirmed: false, lastNotifiedSeverity: null, minutesSinceLastNotice: null });
    const now = order.indexOf(r.severity);
    assert.ok(now >= previous, `severity dropped at ${late} min`);
    previous = now;
  }
  assert.equal(PARAMS.majorFromMinutes < PARAMS.criticalFromMinutes, true);
});

test("prototype seed data uses only known causes and evaluates without errors", () => {
  assert.ok(SEED_ORDERS.length >= 8);
  for (const o of SEED_ORDERS) {
    const r = evaluate(o.change);
    assert.ok(r.severity, o.ref);
  }
});

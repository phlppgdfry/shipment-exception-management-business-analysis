// The DMN decision tables (docs/05-requirements/dmn/exception-decisions.dmn) and the rule module must decide the same.
// A small evaluator for the FEEL subset the tables use: -, "x", not("a","b"), true/false, <= n, >= n, [a..b), (a..b), and a
// name reference as output. Severity and notification are compared for every combination of a grid of inputs;
// throttling (ER-12) and recovery (ER-13) are stateful and stay outside DMN, so the grid has no previous notice.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate, CAUSES } from "../site/assets/exception-rules.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const xml = readFileSync(join(root, "docs/05-requirements/dmn/exception-decisions.dmn"), "utf8");
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();

function parseDecisions(text) {
  const decisions = {};
  for (const [, id, body] of text.matchAll(/<decision id="([^"]+)"[^>]*>([\s\S]*?)<\/decision>/g)) {
    const hit = body.match(/hitPolicy="([A-Z]+)"/)[1];
    const inputs = [...body.matchAll(/<inputExpression[^>]*><text>([^<]+)<\/text>/g)].map((m) => unescape(m[1]));
    const output = body.match(/<output [^>]*name="([^"]+)"/)[1];
    const rules = [...body.matchAll(/<rule [^>]*>([\s\S]*?)<\/rule>/g)].map(([, r]) => ({
      inputs: [...r.matchAll(/<inputEntry><text>([^<]*)<\/text><\/inputEntry>/g)].map((m) => unescape(m[1])),
      output: unescape(r.match(/<outputEntry><text>([^<]*)<\/text><\/outputEntry>/)[1]),
    }));
    decisions[id] = { hit, inputs, output, rules };
  }
  return decisions;
}

function matches(entry, value) {
  if (entry === "-") return true;
  if (entry === "true" || entry === "false") return value === (entry === "true");
  const not = entry.match(/^not\((.*)\)$/);
  if (not) return !not[1].split(",").map((x) => JSON.parse(x.trim())).includes(value);
  if (entry.startsWith('"')) return value === JSON.parse(entry);
  let m = entry.match(/^(<=|>=|<|>)\s*(-?\d+)$/);
  if (m) return { "<=": value <= +m[2], ">=": value >= +m[2], "<": value < +m[2], ">": value > +m[2] }[m[1]];
  m = entry.match(/^([[(])(-?\d+)\.\.(-?\d+)([\])])$/);
  if (m) return (m[1] === "[" ? value >= +m[2] : value > +m[2]) && (m[4] === "]" ? value <= +m[3] : value < +m[3]);
  throw new Error(`Unsupported FEEL unary test: ${entry}`);
}

function decide(table, context) {
  const hits = table.rules.filter((r) => r.inputs.every((e, i) => matches(e, context[table.inputs[i]])));
  if (table.hit === "UNIQUE") assert.ok(hits.length <= 1, `UNIQUE table has ${hits.length} hits for ${JSON.stringify(context)}`);
  const hit = hits[0];
  if (!hit) return null;
  return hit.output.startsWith('"') ? JSON.parse(hit.output) : context[hit.output];
}

const dmn = parseDecisions(xml);

test("the DMN file has the three decisions with the expected hit policies", () => {
  assert.deepEqual(Object.keys(dmn), ["base_severity", "severity", "notification"]);
  assert.deepEqual(Object.values(dmn).map((d) => d.hit), ["FIRST", "UNIQUE", "FIRST"]);
});

test("DMN and the rule module give the same severity and notification for every input combination", () => {
  let checked = 0;
  for (const cause of CAUSES)
    for (const minutesLate of [-120, -1, 0, 1, 60, 119, 120, 200, 359, 360, 600])
      for (const nextDay of [false, true])
        for (const timeCritical of [false, true])
          for (const keyAccount of [false, true])
            for (const prefersAllUpdates of [false, true]) {
              if (nextDay && minutesLate <= 0) continue; // a later calendar day is always after the window end
              const ctx = { cause, minutesLate, nextDay, timeCritical, keyAccount, prefersAllUpdates };
              ctx.baseSeverity = decide(dmn.base_severity, ctx);
              ctx.severity = decide(dmn.severity, ctx);
              const notification = decide(dmn.notification, ctx);
              const r = evaluate({ ...ctx, statusConfirmed: false, lastNotifiedSeverity: null, minutesSinceLastNotice: null });
              assert.equal(ctx.severity, r.severity, `severity for ${JSON.stringify(ctx)}`);
              assert.equal(notification, r.notification, `notification for ${JSON.stringify(ctx)}`);
              checked++;
            }
  assert.equal(checked, 912, `checked ${checked} combinations`);
});

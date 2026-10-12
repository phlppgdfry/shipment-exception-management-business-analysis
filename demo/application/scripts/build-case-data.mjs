#!/usr/bin/env node
// Reads the case documentation (the single source of truth) and writes src/generated/case-data.json for
// the Business Analysis and Product Delivery workspaces. Also runs the executable acceptance examples
// (tests/exception-rules.test.mjs at the repository root) and records their actual results, so the
// workspace never shows a test as passed unless it ran in this build.
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(app, "..", "..");
const read = (p) => readFileSync(join(repo, p), "utf8");

// --- Markdown helpers ---------------------------------------------------------------------
const clean = (s) =>
  s
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

function tableAfter(text, headingPattern) {
  const lines = text.split("\n");
  let i = headingPattern ? lines.findIndex((l) => headingPattern.test(l)) : 0;
  if (i < 0) throw new Error(`Heading not found: ${headingPattern}`);
  while (i < lines.length && !lines[i].trim().startsWith("|")) i++;
  const rows = [];
  while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++].trim());
  const cells = (l) => l.slice(1, -1).split("|").map((c) => clean(c));
  const [header, , ...body] = rows.map(cells);
  if (!header) throw new Error(`No table after ${headingPattern}`);
  return body.map((r) => Object.fromEntries(header.map((h, j) => [h || `col${j}`, r[j] ?? ""])));
}

function csv(path) {
  const text = read(path).replace(/\r/g, "").trim();
  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out;
  };
  const [header, ...rows] = text.split("\n").map(parseLine);
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

// --- Business analysis ----------------------------------------------------------------------
const requirementsMd = read("docs/05-requirements/requirements.md");
const businessRequirements = tableAfter(requirementsMd, /^## Business requirements/).map((r) => ({ id: r.ID, text: r.Requirement, measuredBy: r["Measured by"] }));
const functionalRequirements = tableAfter(requirementsMd, /^## Functional requirements/).map((r) => ({ id: r.ID, text: r.Requirement, moscow: r.MoSCoW, stories: r.Story }));
const nonFunctionalRequirements = tableAfter(requirementsMd, /^## Non-functional requirements/).map((r) => ({ id: r.ID, text: r.Requirement, verification: r["How it is verified"] }));

const kpis = tableAfter(read("docs/01-opportunity/kpi-tree.md"), /^\| ID \| KPI/).map((r) => ({ id: r.ID, name: r.KPI, baseline: r.Baseline, target: r["Target (pilot, week 6)"], owner: r.Owner }));

const rules = tableAfter(read("docs/05-requirements/exception-rules.md"), /^## Rules/).map((r) => ({ id: r.ID, text: r.Rule, owner: r.Owner }));

const traceability = tableAfter(read("docs/05-requirements/traceability.md"), /^## Matrix/).map((r) => ({ pain: r.Pain, br: r.BR, fr: r["FR / NFR"], rules: r.Rules, stories: r.Story, tests: r.Tests, kpi: r.KPI }));

// User stories: "### US-01 Classify a change *(5 pts)*", then narrative and bullets until the next heading.
const storiesMd = read("docs/06-backlog/user-stories.md");
const stories = [];
for (const block of storiesMd.split(/^### /m).slice(1)) {
  const [head, ...rest] = block.split("\n");
  const m = head.match(/^((?:US|EN)-\d+)\s+(.+?)\s+\*\((?:enabler · )?(\d+) pts?\)\*/);
  if (!m) continue;
  const body = rest.join("\n").split(/^---|^## /m)[0];
  const narrative = clean(body.split("\n").find((l) => l.trim() && !l.trim().startsWith("-")) ?? "");
  const criteria = body
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => clean(l.trim().slice(2)));
  stories.push({ id: m[1], title: m[2], points: Number(m[3]), narrative, criteria });
}

// Executable decision examples (Gherkin Examples table)
const featureDir = join(repo, "docs/06-backlog/features");
const examples = [];
for (const f of readdirSync(featureDir).filter((x) => x.endsWith(".feature"))) {
  const text = readFileSync(join(featureDir, f), "utf8");
  if (!text.includes("@decision")) continue;
  const rows = text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const cells = (l) => l.slice(1, -1).split("|").map((c) => c.trim());
  const [header, ...data] = rows.map(cells);
  for (const r of data) examples.push({ file: f, ...Object.fromEntries(header.map((h, i) => [h, r[i]])) });
}
const scenarios = [];
for (const f of readdirSync(featureDir).filter((x) => x.endsWith(".feature"))) {
  const text = readFileSync(join(featureDir, f), "utf8");
  if (text.includes("@decision")) continue;
  for (const m of text.matchAll(/^\s*Scenario:\s*(.+)$/gm)) scenarios.push({ file: f, title: m[1].trim() });
}

const decisions = [];
for (const block of read("docs/03-workshops/decision-log.md").split(/^## /m).slice(1)) {
  const lines = block.split("\n");
  const id = lines[0].trim();
  if (!/^D-\d+/.test(id)) continue;
  const title = clean((lines.find((l) => l.startsWith("**")) ?? "").split("·")[0]);
  const decision = clean((lines.find((l) => l.includes("**Decision:**")) ?? "").replace(/^-\s*\*\*Decision:\*\*/, ""));
  decisions.push({ id, title, decision });
}

// --- Product delivery ----------------------------------------------------------------------
const backlog = csv("data/backlog.csv").map((r) => ({ id: r.ID, item: r.Item, value: Number(r["Business value"]), timeCriticality: Number(r["Time criticality"]), riskReduction: Number(r["Risk reduction / enablement"]), size: Number(r["Size (pts)"]), costOfDelay: Number(r["Cost of delay"]), wsjf: Number(r.WSJF), release: r.Release }));

const sprintMd = read("docs/08-delivery/sprint-plan.md");
const sprints = [1, 2].map((n) => {
  const heading = sprintMd.split("\n").find((l) => l.startsWith(`## Sprint ${n}`)) ?? "";
  const goal = (heading.match(/"([^"]+)"/) ?? [])[1] ?? "";
  const items = tableAfter(sprintMd, new RegExp(`^## Sprint ${n}`)).map((r) => ({ item: r.Item, points: Number(r.Pts), notes: r.Notes }));
  return { sprint: n, goal, items };
});
const timeline = tableAfter(sprintMd, /^## Timeline/).map((r) => ({ week: r.Week, what: r.What, who: r.Who, exit: r.Exit }));

const bat = csv("data/bat-log.csv").map((r) => ({ id: r.ID, scenario: r.Scenario, keyUser: r["Key user"], stories: r.Stories, run1: r["Run 1"], finding: r.Finding, retest: r.Retest, final: r.Final }));
const defects = tableAfter(read("docs/09-acceptance/bat-log.md"), /^## Findings/).map((r) => ({ id: r.ID, severity: r.Severity, finding: r.Finding, decision: r.Decision, status: r.Status }));
const readiness = tableAfter(read("docs/10-go-live/release-readiness.md"), /^## Go\/no-go checklist/).map((r) => ({ id: r["#"], criterion: r.Criterion, owner: r.Owner, evidence: r.Evidence, status: r.Status }));

// --- Actual test run of the decision examples -----------------------------------------------
function runAcceptanceExamples() {
  const dir = mkdtempSync(join(tmpdir(), "ct-results-"));
  const file = join(dir, "junit.xml");
  const testFiles = readdirSync(join(repo, "tests")).filter((f) => f.endsWith(".test.mjs")).map((f) => join("tests", f));
  const run = spawnSync(process.execPath, ["--test", "--test-reporter=junit", `--test-reporter-destination=${file}`, ...testFiles], { cwd: repo, encoding: "utf8" });
  let xml = "";
  try {
    xml = readFileSync(file, "utf8");
  } catch {
    /* no output: the run failed before reporting */
  }
  rmSync(dir, { recursive: true, force: true });
  const tests = [];
  for (const m of xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const name = (m[1].match(/name="([^"]*)"/) ?? [])[1] ?? "";
    const inner = m[3] ?? "";
    const status = /<failure\b/.test(inner) ? "failed" : /<skipped\b/.test(inner) ? "skipped" : "passed";
    tests.push({ name: name.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&apos;/g, "'"), status });
  }
  let commit = null;
  try {
    commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();
  } catch {
    /* not a git checkout */
  }
  return {
    ranAt: new Date().toISOString(),
    commit,
    command: "node --test tests/*.test.mjs",
    exitCode: run.status,
    total: tests.length,
    passed: tests.filter((t) => t.status === "passed").length,
    failed: tests.filter((t) => t.status === "failed").length,
    tests,
  };
}

const testRun = runAcceptanceExamples();

// --- Write ---------------------------------------------------------------------------------
const out = join(app, "src/generated");
mkdirSync(out, { recursive: true });
writeFileSync(
  join(out, "case-data.json"),
  JSON.stringify({ businessRequirements, functionalRequirements, nonFunctionalRequirements, kpis, rules, traceability, stories, examples, scenarios, decisions, backlog, sprints, timeline, bat, defects, readiness }, null, 2),
);
writeFileSync(join(out, "test-results.json"), JSON.stringify(testRun, null, 2));

// Process diagrams for the workspace (published by the BPMN generator in scripts/build_bpmn.py)
mkdirSync(join(app, "public/bpmn"), { recursive: true });
for (const f of ["as-is.svg", "to-be.svg"]) copyFileSync(join(repo, "site/assets/bpmn", f), join(app, "public/bpmn", f));

console.log(
  `case data: ${stories.length} stories, ${examples.length} decision examples, ${functionalRequirements.length} FRs, ${backlog.length} backlog items · acceptance examples: ${testRun.passed}/${testRun.total} passed (exit ${testRun.exitCode})`,
);

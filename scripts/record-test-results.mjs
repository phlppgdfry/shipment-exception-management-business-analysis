#!/usr/bin/env node
// Runs every automated check of the repository and writes what actually happened to
// docs/09-acceptance/test-results.md. Nothing is marked "passed" unless the tool reported it.
//   node scripts/record-test-results.mjs
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, platform, release } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "demo/application");
const BASE_PATH = "/shipment-exception-management-business-analysis/control-tower";
const tmp = mkdtempSync(join(tmpdir(), "results-"));

function run(cmd, args, cwd, env = {}) {
  const started = Date.now();
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout ?? "") + (r.stderr ?? ""), seconds: Math.round((Date.now() - started) / 100) / 10 };
}

const suites = [];

// 1. Acceptance examples (node:test, JUnit)
{
  const file = join(tmp, "rules.xml");
  const r = run(process.execPath, ["--test", "--test-reporter=junit", `--test-reporter-destination=${file}`, "tests/exception-rules.test.mjs"], root);
  const xml = readFileSync(file, "utf8");
  const tests = [...xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)].map((m) => ({
    name: ((m[1].match(/name="([^"]*)"/) ?? [])[1] ?? "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&apos;/g, "'"),
    status: /<failure\b/.test(m[3] ?? "") ? "failed" : "passed",
  }));
  suites.push({ name: "Acceptance examples against the rule module", tool: "node --test", command: "node --test tests/*.test.mjs", code: r.code, seconds: r.seconds, tests });
}

// 2. Unit and contract tests (Vitest, JSON)
{
  const file = join(tmp, "vitest.json");
  const r = run("npx", ["vitest", "run", "--reporter=json", `--outputFile=${file}`], app);
  const json = JSON.parse(readFileSync(file, "utf8"));
  const tests = json.testResults.flatMap((f) => f.assertionResults.map((a) => ({ name: `${f.name.split("/tests/unit/")[1]} › ${[...a.ancestorTitles, a.title].join(" › ")}`, status: a.status })));
  suites.push({ name: "Engine, lifecycle and API contract", tool: "Vitest", command: "cd demo/application && npm test", code: r.code, seconds: r.seconds, tests });
}

// 3. Static checks
const checks = [
  ["ESLint", "cd demo/application && npm run lint", () => run("npm", ["run", "lint"], app)],
  ["TypeScript", "cd demo/application && npm run typecheck", () => run("npm", ["run", "typecheck"], app)],
  ["Production build (static export)", "npm run build", () => run("npm", ["run", "build"], app, { BASE_PATH })],
  ["Mock data up to date", "node demo/mock-data/generate.mjs --check", () => run(process.execPath, ["demo/mock-data/generate.mjs", "--check"], root)],
  ["OpenAPI lint (Redocly)", "npx @redocly/cli lint demo/mock-apis/openapi.yaml", () => run("npx", ["--yes", "@redocly/cli@2.62.1", "lint", "demo/mock-apis/openapi.yaml", "--config", "demo/mock-apis/redocly.yaml"], root)],
  ["Documentation links", "python3 scripts/check-links.py", () => run("python3", ["scripts/check-links.py"], root)],
].map(([name, command, fn]) => ({ name, command, ...fn() }));

// 4. End-to-end, routes and accessibility (Playwright, JSON) — needs the build from step 3
{
  const file = join(tmp, "pw.json");
  const r = run("npx", ["playwright", "test", "--reporter=json"], app, { PLAYWRIGHT_JSON_OUTPUT_NAME: file });
  let tests = [];
  try {
    const json = JSON.parse(readFileSync(file, "utf8"));
    const walk = (suite, path) =>
      [
        ...(suite.specs ?? []).flatMap((s) => s.tests.map((t) => ({ name: `${t.projectName} › ${[...path, s.title].filter(Boolean).join(" › ")}`, status: t.results.at(-1)?.status === "passed" ? "passed" : t.results.at(-1)?.status ?? "not run" }))),
        ...(suite.suites ?? []).flatMap((s) => walk(s, [...path, s.title])),
      ];
    tests = json.suites.flatMap((s) => walk(s, []));
  } catch {
    /* reporter did not write output */
  }
  suites.push({ name: "Browser: scenario, workbench, routes, accessibility (axe, WCAG 2.2 A/AA)", tool: "Playwright + axe-core", command: "cd demo/application && npm run test:e2e", code: r.code, seconds: r.seconds, tests });
}

// 5. Repository quality gate (runs last: it checks that this page exists)
const gate = run("python3", ["scripts/validate_repo.py"], root);

rmSync(tmp, { recursive: true, force: true });

let commit = "unknown";
try {
  commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const dirty = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim();
  if (dirty) commit += " + uncommitted changes";
} catch {
  /* not a git checkout */
}

const total = suites.reduce((n, s) => n + s.tests.length, 0);
const passed = suites.reduce((n, s) => n + s.tests.filter((t) => t.status === "passed").length, 0);
const icon = (ok) => (ok ? "✅ pass" : "❌ fail");
const now = new Date().toISOString().slice(0, 16).replace("T", " ");

const md = `# Test results — what was actually executed

> **What this is:** the result of running every automated check in this repository, written by \`scripts/record-test-results.mjs\`. **For:** reviewers who want evidence, not claims. **Previous:** [BAT log](bat-log.md) · **Next:** [release readiness](../10-go-live/release-readiness.md).

| | |
|---|---|
| Run | ${now} UTC |
| Commit | \`${commit}\` |
| Environment | Node ${process.version}, ${platform()} ${release()} |
| Automated tests | **${passed} of ${total} passed** |

This page contains only **executed** results. The fictional team's system test and the Business Acceptance Testing with key users are **simulated** and live in the [BAT log](bat-log.md) — they are not test results of this repository. The same checks run in [CI](../../.github/workflows/ci.yml) on every push; the CI run of a commit is the authoritative result for that commit.

## Summary

| Suite | Tool | Tests | Passed | Result | Time |
|---|---|---:|---:|---|---:|
${suites.map((s) => `| ${s.name} | ${s.tool} | ${s.tests.length} | ${s.tests.filter((t) => t.status === "passed").length} | ${icon(s.code === 0)} | ${s.seconds} s |`).join("\n")}

| Check | Command | Result |
|---|---|---|
${checks.map((c) => `| ${c.name} | \`${c.command}\` | ${icon(c.code === 0)} |`).join("\n")}
| Repository quality gate (deliverables, IDs, traceability, test names, BPMN, learning lab) | \`python3 scripts/validate_repo.py\` | ${icon(gate.code === 0)} |

${[...checks, { name: "Repository quality gate", ...gate }].filter((c) => c.code !== 0).map((c) => `### ${c.name} — output\n\n\`\`\`text\n${c.out.trim().split("\n").slice(-25).join("\n")}\n\`\`\``).join("\n\n")}

## Every test

${suites.map((s) => `<details><summary><b>${s.name}</b> — ${s.tests.filter((t) => t.status === "passed").length}/${s.tests.length}</summary>\n\n| Test | Result |\n|---|---|\n${s.tests.map((t) => `| ${t.name.replace(/\|/g, "\\|")} | ${t.status} |`).join("\n")}\n\n</details>`).join("\n\n")}

## Not covered by automated tests

See [test strategy — what is not tested here](test-strategy.md#what-is-not-tested-here-and-why): real TMS webhooks and e-mail, load (NFR-01), out-of-order events, bounces (FR-09), and a screen-reader walkthrough by a real user.

---

[Documentation map](../00-documentation-map.md) · Next: [Release readiness →](../10-go-live/release-readiness.md)
`;
writeFileSync(join(root, "docs/09-acceptance/test-results.md"), md);
console.log(`Wrote docs/09-acceptance/test-results.md — ${passed}/${total} tests passed; checks: ${checks.map((c) => `${c.name}=${c.code}`).join(", ")}; gate=${gate.code}`);

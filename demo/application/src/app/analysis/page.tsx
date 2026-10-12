import caseData from "@/generated/case-data.json";
import testResults from "@/generated/test-results.json";
import { evaluate, RULE_TEXT } from "@/domain/rules";
import type { Cause, Severity } from "@/domain/rules";
import { Card, ExternalLink, PageHeader, RuleChip } from "@/components/ui";
import { ExampleTable, type ExampleRow } from "@/components/ExampleTable";
import { DOCS, withBase } from "@/lib/links";

export const metadata = { title: "Business analysis workspace" };

const SECTIONS = [
  ["goals", "Goals and KPIs"],
  ["process", "Process"],
  ["rules", "Exception rules"],
  ["requirements", "Requirements"],
  ["stories", "User stories"],
  ["examples", "Acceptance examples and tests"],
  ["traceability", "Traceability"],
  ["decisions", "Decisions"],
] as const;

const yes = (v: string) => v === "yes";

export default function AnalysisPage() {
  // Re-evaluate every documented example with the shared rule module, to show which rules it exercises.
  const examples: ExampleRow[] = caseData.examples.map((e: Record<string, string>) => {
    const decision = evaluate({
      cause: e.cause as Cause,
      minutesLate: Number(e.late),
      nextDay: yes(e.next_day),
      timeCritical: yes(e.time_critical),
      keyAccount: yes(e.key),
      prefersAllUpdates: yes(e.all_updates),
      statusConfirmed: yes(e.confirmed),
      lastNotifiedSeverity: e.last_sev === "-" ? null : (e.last_sev as Severity),
      minutesSinceLastNotice: e.since === "-" ? null : Number(e.since),
    });
    const result = testResults.tests.find((t) => t.name.startsWith(`${e.id} `));
    return { id: e.id, title: e.title, given: `${e.cause}, ${e.late} min${yes(e.next_day) ? ", next day" : ""}${yes(e.time_critical) ? ", time-critical" : ""}${yes(e.key) ? ", key account" : ""}${e.last_sev !== "-" ? `, last told ${e.last_sev} ${e.since} min ago` : ""}`, expected: `${e.severity} · ${e.notification}`, rules: decision.rules, status: (result?.status ?? "not run") as ExampleRow["status"] };
  });

  return (
    <>
      <PageHeader
        title="Business analysis workspace"
        intro={<>The analysis behind the demo, read from the case documentation at build time — the documents stay the source of truth. Each section links to its document.</>}
      />
      <nav aria-label="Workspace sections" className="mb-6 flex flex-wrap gap-2">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm hover:border-accent">{label}</a>
        ))}
      </nav>
      <div className="flex flex-col gap-6">
        <Card id="goals" title="Business goals and how they are measured" actions={<ExternalLink href={DOCS.kpiTree}>KPI tree</ExternalLink>}>
          <p className="mb-3 text-sm"><strong>Goal:</strong> when a change puts the agreed delivery window at risk, the right planner owns it within minutes and the customer is told before they need to ask.</p>
          <div className="grid gap-6 md:grid-cols-2">
            <SimpleTable caption="Business requirements" head={["ID", "Requirement", "Measured by"]} rows={caseData.businessRequirements.map((r) => [r.id, r.text, r.measuredBy])} />
            <SimpleTable caption="KPIs (illustrative baselines and targets)" head={["ID", "KPI", "Baseline", "Target"]} rows={caseData.kpis.map((k) => [k.id, k.name, k.baseline, k.target])} />
          </div>
        </Card>

        <Card id="process" title="AS-IS and TO-BE (BPMN 2.0)" actions={<ExternalLink href={DOCS.toBe}>TO-BE process</ExternalLink>}>
          <div className="flex flex-col gap-6">
            {[["to-be", "TO-BE: every change is evaluated by the rules; exceptions get an owner and a response time; the customer is told proactively"], ["as-is", "AS-IS: delays noticed by chance, copied into an Excel sheet; customers find out at the gate"]].map(([f, alt]) => (
              <figure key={f} tabIndex={0} aria-label={alt} className="overflow-x-auto rounded-md border border-border bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG generated from the .bpmn file */}
                <img src={withBase(`/bpmn/${f}.svg`)} alt={alt} className="h-auto max-w-none" style={{ minWidth: 900 }} />
                <figcaption className="px-2 pt-2 text-sm text-slate-600">{f === "to-be" ? "TO-BE (release 1)" : "AS-IS"} — generated from the BPMN 2.0 XML in docs/04-process/bpmn</figcaption>
              </figure>
            ))}
          </div>
        </Card>

        <Card id="rules" title="Exception rules" actions={<ExternalLink href={DOCS.rules}>Rules and decision table</ExternalLink>}>
          <SimpleTable caption="Business rules" head={["ID", "Rule", "Owner"]} rows={caseData.rules.map((r) => [r.id, r.text, r.owner])} />
        </Card>

        <Card id="requirements" title="Functional and non-functional requirements" actions={<ExternalLink href={DOCS.requirements}>Requirements</ExternalLink>}>
          <div className="flex flex-col gap-6">
            <SimpleTable caption="Functional requirements (MoSCoW for release 1)" head={["ID", "Requirement", "MoSCoW", "Story"]} rows={caseData.functionalRequirements.map((r) => [r.id, r.text, r.moscow, r.stories])} />
            <SimpleTable caption="Non-functional requirements" head={["ID", "Requirement", "Verified by"]} rows={caseData.nonFunctionalRequirements.map((r) => [r.id, r.text, r.verification])} />
          </div>
        </Card>

        <Card id="stories" title="User stories and acceptance criteria (release 1)" actions={<ExternalLink href={DOCS.stories}>User stories</ExternalLink>}>
          <div className="grid gap-3 md:grid-cols-2">
            {caseData.stories.map((s) => (
              <details key={s.id} className="rounded-md border border-border p-3 text-sm">
                <summary className="cursor-pointer font-medium">{s.id} {s.title} <span className="font-normal text-muted">· {s.points} pts</span></summary>
                <p className="mt-2">{s.narrative}</p>
                <ul className="mt-2 list-disc pl-5 text-muted">
                  {s.criteria.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </details>
            ))}
          </div>
        </Card>

        <Card id="examples" title="Acceptance examples and test results" actions={<ExternalLink href={DOCS.feature}>Feature file</ExternalLink>}>
          <p className="mb-3 text-sm">
            These Given/When/Then examples are executable: <code className="font-mono text-xs">{testResults.command}</code> ran them against the same rule module this demo uses.{" "}
            <strong>
              Result in this build: {testResults.passed} of {testResults.total} tests passed{testResults.failed ? `, ${testResults.failed} failed` : ""}
            </strong>{" "}
            <span className="text-muted">(run {testResults.ranAt.slice(0, 16).replace("T", " ")} UTC{testResults.commit ? `, commit ${testResults.commit}` : ""}).</span>
          </p>
          <ExampleTable rows={examples} />
          <h3 className="mt-6 font-semibold">Scenarios tested by the tester and in BAT (not automated here)</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {caseData.scenarios.map((s) => <li key={s.title}>{s.title}</li>)}
          </ul>
        </Card>

        <Card id="traceability" title="Traceability: pain point → requirement → rule → story → test → KPI" actions={<ExternalLink href={DOCS.traceability}>Traceability</ExternalLink>}>
          <SimpleTable caption="Traceability matrix" head={["Pain", "BR", "FR / NFR", "Rules", "Story", "Tests", "KPI"]} rows={caseData.traceability.map((t) => [t.pain, t.br, t.fr, t.rules, t.stories, t.tests, t.kpi])} />
        </Card>

        <Card id="decisions" title="Decisions that shaped the release" actions={<ExternalLink href={DOCS.decisions}>Decision log</ExternalLink>}>
          <SimpleTable caption="Decision log" head={["ID", "Question", "Decision"]} rows={caseData.decisions.map((d) => [d.id, d.title, d.decision])} />
        </Card>
        <p className="text-sm text-muted">
          Rule texts in the chips: {Object.keys(RULE_TEXT).slice(0, 3).map((r) => <RuleChip key={r} id={r} text={RULE_TEXT[r]} />)} … hover for the plain-language rule.
        </p>
      </div>
    </>
  );
}

function SimpleTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
      <table className="w-full text-sm">
        <caption className="mb-2 text-left font-medium">{caption}</caption>
        <thead className="text-left text-muted">
          <tr className="border-b border-border">{head.map((h) => <th key={h} scope="col" className="py-1.5 pr-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border align-top last:border-0">
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="py-1.5 pr-3 text-left font-mono text-xs font-normal whitespace-nowrap">{c}</th> : <td key={j} className="py-1.5 pr-3">{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

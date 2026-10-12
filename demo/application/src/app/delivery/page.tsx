import caseData from "@/generated/case-data.json";
import { Card, ExternalLink, PageHeader, cx } from "@/components/ui";
import { PilotExport } from "@/components/PilotExport";
import { DOCS } from "@/lib/links";

export const metadata = { title: "Product delivery workspace" };

const SECTIONS = [
  ["backlog", "Backlog and priorities"],
  ["sprints", "Sprints"],
  ["uat", "Acceptance (BAT)"],
  ["defects", "Findings"],
  ["readiness", "Release readiness"],
  ["measure", "Pilot measurement"],
] as const;

export default function DeliveryPage() {
  const r1 = caseData.backlog.filter((b) => b.release === "R1");
  const r1Points = r1.reduce((n, b) => n + b.size, 0);
  const go = caseData.readiness.filter((r) => r.status.startsWith("go")).length;
  return (
    <>
      <PageHeader
        title="Product delivery workspace"
        intro={<>How release 1 was prioritised with the Product Owner, delivered in two sprints, accepted by the business and prepared for production. Simulated delivery of a fictional organisation; read from the case documents at build time.</>}
      />
      <nav aria-label="Workspace sections" className="mb-6 flex flex-wrap gap-2">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm hover:border-accent">{label}</a>
        ))}
      </nav>
      <div className="flex flex-col gap-6">
        <Card id="backlog" title={`Backlog ordered by WSJF — release 1 = ${r1Points} points`} actions={<ExternalLink href={DOCS.prioritisation}>Prioritisation and trade-offs</ExternalLink>}>
          <p className="mb-3 text-sm text-muted">WSJF = cost of delay ÷ size. Business value scored by the business, time criticality by whoever knows the deadlines, size by the team; the Product Owner decided. Relative scores, not measurements.</p>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
            <table className="w-full text-sm">
              <caption className="sr-only">Backlog items with WSJF scores</caption>
              <thead className="text-left text-muted">
                <tr className="border-b border-border">
                  {["ID", "Item", "Value", "Time crit.", "Risk / enable", "Cost of delay", "Size", "WSJF", "Release"].map((h) => <th key={h} scope="col" className="py-1.5 pr-3 font-medium whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {caseData.backlog.map((b) => (
                  <tr key={b.id} className={cx("border-b border-border last:border-0", b.release !== "R1" && "text-muted")}>
                    <th scope="row" className="py-1.5 pr-3 text-left font-mono text-xs font-normal">{b.id}</th>
                    <td className="py-1.5 pr-3">{b.item}</td>
                    <td className="tabular py-1.5 pr-3">{b.value}</td>
                    <td className="tabular py-1.5 pr-3">{b.timeCriticality}</td>
                    <td className="tabular py-1.5 pr-3">{b.riskReduction}</td>
                    <td className="tabular py-1.5 pr-3">{b.costOfDelay}</td>
                    <td className="tabular py-1.5 pr-3">{b.size}</td>
                    <td className="tabular py-1.5 pr-3 font-semibold">{b.wsjf.toFixed(1)}</td>
                    <td className="py-1.5">{b.release}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card id="sprints" title="Sprints and timeline" actions={<ExternalLink href={DOCS.sprintPlan}>Sprint plan</ExternalLink>}>
          <div className="grid gap-4 md:grid-cols-2">
            {caseData.sprints.map((s) => (
              <section key={s.sprint} aria-label={`Sprint ${s.sprint}`} className="rounded-md border border-border p-3">
                <h3 className="font-semibold">Sprint {s.sprint}: “{s.goal}”</h3>
                <p className="text-sm text-muted">{s.items.reduce((n, i) => n + i.points, 0)} points</p>
                <ul className="mt-2 flex flex-col gap-1 text-sm">
                  {s.items.map((i) => (
                    <li key={i.item}><span className="tabular inline-block w-8 text-muted">{i.points}</span>{i.item}{i.notes ? <span className="text-muted"> — {i.notes}</span> : null}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <ol className="mt-4 grid gap-1 text-sm">
            {caseData.timeline.map((t) => (
              <li key={t.week + t.what} className="grid grid-cols-[5rem_1fr] gap-2 border-b border-border py-1 last:border-0">
                <span className="text-muted">Week {t.week}</span>
                <span>{t.what} <span className="text-muted">— exit: {t.exit}</span></span>
              </li>
            ))}
          </ol>
        </Card>

        <Card id="uat" title="Business Acceptance Testing — simulated" actions={<ExternalLink href={DOCS.batLog}>BAT log and sign-off</ExternalLink>}>
          <p className="mb-3 text-sm text-muted">Simulated BAT with key users of a fictional organisation: it shows the format and the decisions, not real results. Automated test results of this repository are in the BA workspace and in docs/09-acceptance/test-results.md.</p>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
            <table className="w-full text-sm">
              <caption className="sr-only">BAT scenarios and results</caption>
              <thead className="text-left text-muted">
                <tr className="border-b border-border">{["ID", "Scenario", "Key user", "Stories", "Run 1", "Finding", "Final"].map((h) => <th key={h} scope="col" className="py-1.5 pr-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {caseData.bat.map((b) => (
                  <tr key={b.id} className="border-b border-border align-top last:border-0">
                    <th scope="row" className="py-1.5 pr-3 text-left font-mono text-xs font-normal">{b.id}</th>
                    <td className="py-1.5 pr-3">{b.scenario}</td>
                    <td className="py-1.5 pr-3">{b.keyUser}</td>
                    <td className="py-1.5 pr-3 whitespace-nowrap">{b.stories}</td>
                    <td className="py-1.5 pr-3">{b.run1}</td>
                    <td className="py-1.5 pr-3 text-muted">{b.finding || "—"}</td>
                    <td className="py-1.5">{b.final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card id="defects" title="Findings and decisions (simulated)">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
            <table className="w-full text-sm">
              <caption className="sr-only">BAT findings</caption>
              <thead className="text-left text-muted">
                <tr className="border-b border-border">{["ID", "Severity", "Finding", "Decision", "Status"].map((h) => <th key={h} scope="col" className="py-1.5 pr-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {caseData.defects.map((d) => (
                  <tr key={d.id} className="border-b border-border align-top last:border-0">
                    <th scope="row" className="py-1.5 pr-3 text-left font-mono text-xs font-normal">{d.id}</th>
                    <td className="py-1.5 pr-3">{d.severity}</td>
                    <td className="py-1.5 pr-3">{d.finding}</td>
                    <td className="py-1.5 pr-3 text-muted">{d.decision}</td>
                    <td className="py-1.5">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card id="readiness" title={`Go/no-go checklist — ${go} of ${caseData.readiness.length} criteria go (simulated)`} actions={<ExternalLink href={DOCS.readiness}>Release readiness</ExternalLink>}>
          <ol className="flex flex-col gap-1 text-sm">
            {caseData.readiness.map((r) => (
              <li key={r.id} className="grid grid-cols-[2rem_1fr_auto] gap-2 border-b border-border py-1.5 last:border-0">
                <span className="text-muted">{r.id}</span>
                <span>{r.criterion} <span className="text-muted">— {r.owner}; evidence: {r.evidence}</span></span>
                <span className={cx("rounded px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap", r.status === "go" ? "bg-ok-soft text-ok" : "bg-major-soft text-major")}>{r.status}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card id="measure" title="Pilot measurement export (US-13)">
          <PilotExport />
        </Card>
      </div>
    </>
  );
}

"use client";
import Link from "next/link";
import { ScenarioGuide } from "@/components/ScenarioGuide";
import { Card, EmptyState, ErrorState, KpiTile, LoadingState, PageHeader, SeverityBadge, StatusBadge } from "@/components/ui";
import { OWNER_LABEL, CAUSE_LABEL, isActive } from "@/domain/engine";
import { overview } from "@/domain/kpis";
import { formatDayTime, formatDuration } from "@/domain/time";
import { useDemoState, useQuery } from "@/state/store";
import type { OwnerGroup } from "@/domain/types";
import { DOCS } from "@/lib/links";

const pct = (v: number | null) => (v == null ? "—" : `${Math.round(v * 100)}%`);
const SEVERITY_ORDER = { CRITICAL: 0, MAJOR: 1, MINOR: 2, NONE: 3 };

export default function OverviewPage() {
  const state = useDemoState();
  // Reading through the API shows the loading and error states (try "Simulate TMS outage").
  const shipmentsQuery = useQuery((api) => api.listShipments(), "shipments");
  const o = overview(state);
  const active = state.exceptions
    .filter(isActive)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || (a.dueAt ?? "9").localeCompare(b.dueAt ?? "9"));

  return (
    <>
      <PageHeader
        title="Operations overview"
        intro={
          <>
            Door-to-door orders on the pilot routes BE-UK East and BE-UK South, Wednesday morning. Every exception below was opened by the{" "}
            <a className="text-accent underline" href={DOCS.rules}>
              exception rules
            </a>
            , not typed in.
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          {shipmentsQuery.error ? (
            <ErrorState title={shipmentsQuery.error.problem.title} detail={`${shipmentsQuery.error.problem.detail} The workbench keeps working on the last data it received.`} onRetry={shipmentsQuery.retry} />
          ) : shipmentsQuery.loading ? (
            <LoadingState label="Loading shipments from the TMS…" />
          ) : null}
          <section aria-label="Operational KPIs" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <KpiTile label="Active shipments" value={o.activeShipments} href="/shipments/" />
            <KpiTile label="On schedule" value={o.onSchedule} tone="ok" hint="inside the agreed window" href="/shipments/?filter=on-time" />
            <KpiTile label="Delayed" value={o.delayed} tone="major" hint="expected after the window" href="/shipments/?filter=delayed" />
            <KpiTile label="Critical exceptions" value={o.criticalExceptions} tone="critical" href="/exceptions/?severity=CRITICAL" />
            <KpiTile label="Unassigned" value={o.unassignedExceptions} tone={o.unassignedExceptions ? "major" : "ok"} hint={`${o.escalated} escalated · ${o.held} held`} href="/exceptions/?unassigned=1" />
            <KpiTile label="Open call tasks" value={o.openCallTasks} hint="key accounts (ER-11)" href="/exceptions/?calls=1" />
          </section>

          <Card title="Exceptions to act on" actions={<Link href="/exceptions/" className="text-sm text-accent underline">Open the workbench</Link>}>
            {active.length === 0 ? (
              <EmptyState title="No open exceptions">Every active shipment is inside its agreed delivery window.</EmptyState>
            ) : (
              <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
                <table className="w-full text-sm">
                  <caption className="sr-only">Open exceptions, most urgent first</caption>
                  <thead className="text-left text-muted">
                    <tr className="border-b border-border">
                      <th scope="col" className="py-2 pr-3 font-medium">Severity</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Exception</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Customer</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Owner</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Status</th>
                      <th scope="col" className="py-2 font-medium">Respond by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {active.map((e) => (
                      <tr key={e.exceptionId} className="border-b border-border last:border-0">
                        <td className="py-2 pr-3"><SeverityBadge severity={e.severity} /></td>
                        <td className="py-2 pr-3">
                          <Link className="font-medium text-accent underline" href={`/exceptions/?id=${e.exceptionId}`}>{e.exceptionId}</Link>{" "}
                          <span className="text-muted">{e.orderRef} · {CAUSE_LABEL[e.type]}</span>
                        </td>
                        <td className="py-2 pr-3">{state.customers[e.customerId].name}{!state.customers[e.customerId].pilot && <span className="ml-1 text-xs text-muted">(shadow)</span>}</td>
                        <td className="py-2 pr-3">{OWNER_LABEL[e.ownerGroup]}</td>
                        <td className="py-2 pr-3"><StatusBadge status={e.status} /></td>
                        <td className="tabular py-2">{e.dueAt && ["OPEN", "HELD", "ESCALATED"].includes(e.status) ? formatDayTime(e.dueAt) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Open exceptions by owner">
              <table className="w-full text-sm">
                <caption className="sr-only">Count of open exceptions per owner group and severity</caption>
                <thead className="text-left text-muted">
                  <tr className="border-b border-border">
                    <th scope="col" className="py-1.5 font-medium">Owner group</th>
                    <th scope="col" className="py-1.5 text-right font-medium">Critical</th>
                    <th scope="col" className="py-1.5 text-right font-medium">Major</th>
                    <th scope="col" className="py-1.5 text-right font-medium">Minor</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(OWNER_LABEL) as OwnerGroup[]).map((g) => (
                    <tr key={g} className="border-b border-border last:border-0">
                      <th scope="row" className="py-1.5 text-left font-normal">{OWNER_LABEL[g]}</th>
                      <td className="tabular py-1.5 text-right">{o.byOwner[g]?.CRITICAL ?? 0}</td>
                      <td className="tabular py-1.5 text-right">{o.byOwner[g]?.MAJOR ?? 0}</td>
                      <td className="tabular py-1.5 text-right">{o.byOwner[g]?.MINOR ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card title="Pilot KPIs, live from the simulated day">
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
                <dt>K1 Major/critical told before the window starts</dt>
                <dd className="tabular text-right font-semibold">{pct(o.k1ProactiveRate.value)} <span className="font-normal text-muted">({o.k1ProactiveRate.numerator}/{o.k1ProactiveRate.denominator})</span></dd>
                <dt>K2 Median time to inform</dt>
                <dd className="tabular text-right font-semibold">{o.k2MedianMinutesToInform == null ? "—" : formatDuration(o.k2MedianMinutesToInform)}</dd>
                <dt>K6 Acknowledged within response time</dt>
                <dd className="tabular text-right font-semibold">{pct(o.k6AckWithinResponse.value)} <span className="font-normal text-muted">({o.k6AckWithinResponse.numerator}/{o.k6AckWithinResponse.denominator})</span></dd>
                <dt>K8 Messages per notified exception</dt>
                <dd className="tabular text-right font-semibold">{o.k8MessagesPerNotifiedException == null ? "—" : o.k8MessagesPerNotifiedException.toFixed(1)}</dd>
              </dl>
              <p className="mt-3 text-xs text-muted">
                Computed from this demo session for pilot customers only — it shows how the <a className="underline" href={DOCS.kpiTree}>KPI tree</a> is measured. Not results of a real pilot.
              </p>
            </Card>
          </div>
        </div>
        <aside className="flex flex-col gap-6" aria-label="Guided scenario and recent activity">
          <ScenarioGuide />
          <Card title="Recent activity">
            <ol className="flex flex-col gap-2 text-sm" aria-label="Latest audit entries">
              {state.audit.slice(-8).reverse().map((a) => (
                <li key={a.seq} className="border-b border-border pb-2 last:border-0">
                  <span className="tabular text-muted">{formatDayTime(a.at)}</span> · <span className="font-medium">{a.orderRef ?? "—"}</span>
                  <p className="text-muted">{a.detail}</p>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </>
  );
}

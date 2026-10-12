"use client";
import Link from "next/link";
import { CAUSE_LABEL, OWNER_LABEL, lateness } from "@/domain/engine";
import { formatDayTime, formatDuration, formatWindow } from "@/domain/time";
import { useDemoState, useQuery } from "@/state/store";
import { Card, ErrorState, LoadingState, PageHeader, SeverityBadge, StatusBadge, cx } from "./ui";
import { STATUS_LABEL } from "./ShipmentExplorer";

export function ShipmentDetail({ orderRef }: { orderRef: string }) {
  const state = useDemoState();
  const query = useQuery((api) => api.getShipment(orderRef), `shipment-${orderRef}`);
  if (query.error) return <ErrorState title={query.error.problem.title} detail={query.error.problem.detail} onRetry={query.retry} />;
  if (query.loading || !query.data) return <LoadingState label={`Loading ${orderRef}…`} />;
  const s = query.data;
  const customer = state.customers[s.customerId];
  const l = lateness(s);
  const exceptions = state.exceptions.filter((e) => e.orderRef === orderRef);
  const sailing = state.sailings[s.sailingId];

  return (
    <>
      <p className="mb-2 text-sm"><Link href="/shipments/" className="text-accent underline">← All shipments</Link></p>
      <PageHeader title={`Shipment ${s.orderRef}`} intro={`${customer.name} → ${s.consignee} · ${s.cargo.description}`}>
        <Link href={`/track/?ref=${s.orderRef}`} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-accent">What the customer sees →</Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Delivery promise" className="lg:col-span-1">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted">Agreed window</dt>
            <dd className="tabular">{s.deliveryWindow ? formatWindow(s.deliveryWindow) : <>none — <span className="text-major">assumed {formatWindow(l.window)} (FR-03)</span></>}</dd>
            {s.originalWindow && (<><dt className="text-muted">Originally</dt><dd className="tabular">{formatWindow(s.originalWindow)}</dd></>)}
            <dt className="text-muted">Planned ETA</dt>
            <dd className="tabular">{formatDayTime(s.plannedEta)}</dd>
            <dt className="text-muted">Expected now</dt>
            <dd className="tabular font-semibold">{formatDayTime(s.eta)}</dd>
            <dt className="text-muted">Against the window</dt>
            <dd className={cx("tabular font-semibold", l.minutesLate > 0 || l.nextDay ? "text-critical" : "text-ok")}>
              {l.minutesLate > 0 ? `${formatDuration(l.minutesLate)} after the end${l.nextDay ? ", next day" : ""}` : `inside (${formatDuration(-l.minutesLate)} to spare)`}
            </dd>
            <dt className="text-muted">Status</dt>
            <dd>{STATUS_LABEL[s.status]}{s.customsHold ? " · customs hold" : ""}</dd>
            <dt className="text-muted">Customer</dt>
            <dd>{customer.name}{customer.keyAccount ? " · key account" : ""} · {customer.pilot ? "pilot" : "control group (shadow mode)"} · {customer.channel}</dd>
            <dt className="text-muted">Cargo</dt>
            <dd>{s.cargo.description}{s.cargo.timeCritical || s.cargo.unitType === "REEFER" ? " · time-critical (ER-04)" : ""}</dd>
          </dl>
        </Card>

        <Card title="Route" className="lg:col-span-2">
          <ol className="grid gap-3 md:grid-cols-3" aria-label="Transport legs">
            {s.legs.map((leg, i) => (
              <li key={i} className="rounded-md border border-border p-3 text-sm">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">{leg.mode === "SEA" ? "Sea crossing" : i === 0 ? "Pre-carriage (road)" : "On-carriage (road)"}</p>
                <p className="mt-1 font-medium">{leg.from} → {leg.to}</p>
                <p className="tabular text-muted">{formatDayTime(leg.plannedDeparture)} → {formatDayTime(leg.plannedArrival)} (planned)</p>
                <p className="text-muted">{leg.operator}</p>
                {leg.mode === "SEA" && sailing?.status && sailing.status !== "SCHEDULED" && (
                  <p className="mt-1 font-medium text-critical">{s.sailingId !== leg.operator.replace("Sailing ", "") ? `Moved to ${s.sailingId}` : sailing.status === "CANCELLED" ? "Cancelled" : `Delayed +${formatDuration(sailing.delayMinutes ?? 0)}`}</p>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Milestones and updates" className="lg:col-span-2">
          <ol className="relative ml-2 border-l border-border" aria-label="Status timeline">
            {[
              ...s.milestones.map((m) => ({ at: m.actualAt ?? m.plannedAt, label: m.label, sub: m.location, kind: m.actualAt ? ("done" as const) : ("planned" as const) })),
              ...(s.updates ?? []).map((u) => ({ at: u.at, label: u.text, sub: u.source, kind: "update" as const })),
            ]
              .sort((a, b) => a.at.localeCompare(b.at))
              .map((item, i) => (
                <li key={i} className="mb-3 ml-4">
                  <span aria-hidden="true" className={cx("absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border", item.kind === "done" ? "border-ok bg-ok" : item.kind === "update" ? "border-critical bg-critical" : "border-border bg-surface")} />
                  <p className="text-sm"><span className="tabular text-muted">{formatDayTime(item.at)}</span> · <span className={cx(item.kind === "planned" && "text-muted", item.kind === "update" && "font-medium")}>{item.label}</span> <span className="text-xs text-muted">({item.kind === "planned" ? "planned" : item.kind === "update" ? "event" : "reached"})</span></p>
                  <p className="text-xs text-muted">{item.sub}</p>
                </li>
              ))}
          </ol>
          <p className="text-xs text-muted">The prototype keeps planned milestones as planned; it does not move them after a delay. Times in UK local time.</p>
        </Card>

        <Card title="Exceptions on this order">
          {exceptions.length === 0 ? (
            <p className="text-sm text-muted">None. Changes so far kept the delivery inside the agreed window.</p>
          ) : (
            <ul className="flex flex-col gap-3 text-sm">
              {exceptions.map((e) => (
                <li key={e.exceptionId} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2"><SeverityBadge severity={e.severity} /><StatusBadge status={e.status} /></div>
                  <p className="mt-1"><Link href={`/exceptions/?id=${e.exceptionId}`} className="font-medium text-accent underline">{e.exceptionId}</Link> · {CAUSE_LABEL[e.type]} · {OWNER_LABEL[e.ownerGroup]}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

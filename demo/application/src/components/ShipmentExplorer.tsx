"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { activeExceptionFor, lateness } from "@/domain/engine";
import { formatDayTime, formatDuration, formatWindow } from "@/domain/time";
import type { Shipment, ShipmentStatus } from "@/domain/types";
import { useDemoState, useQuery } from "@/state/store";
import { EmptyState, ErrorState, Field, LoadingState, PageHeader, SeverityBadge, inputClass } from "./ui";

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  BOOKED: "Booked",
  COLLECTED: "Collected",
  AT_ORIGIN_TERMINAL: "At origin terminal",
  AT_SEA: "At sea",
  AT_DESTINATION_TERMINAL: "At UK terminal",
  ON_DELIVERY_LEG: "On delivery leg",
  DELIVERED: "Delivered",
};

type Schedule = "all" | "on-time" | "delayed" | "exception";
type Sort = "eta" | "late" | "ref";

export function ShipmentExplorer() {
  const params = useSearchParams();
  const state = useDemoState();
  const query = useQuery((api) => api.listShipments(), "shipments");
  const [search, setSearch] = useState("");
  const [route, setRoute] = useState("all");
  const [status, setStatus] = useState("active");
  const [schedule, setSchedule] = useState<Schedule>((params.get("filter") as Schedule) ?? "all");
  const [sort, setSort] = useState<Sort>("eta");

  const rows = useMemo(() => {
    const list = (query.data ?? []).map((s: Shipment) => {
      const l = lateness(s);
      const ex = activeExceptionFor(state, s.orderRef);
      return { s, l, ex, customer: state.customers[s.customerId] };
    });
    const q = search.trim().toLowerCase();
    return list
      .filter((r) => !q || [r.s.orderRef, r.customer.name, r.s.consignee, r.s.sailingId].some((v) => v.toLowerCase().includes(q)))
      .filter((r) => route === "all" || r.s.route === route)
      .filter((r) => (status === "all" ? true : status === "active" ? r.s.status !== "DELIVERED" : r.s.status === status))
      .filter((r) => {
        const late = r.l.minutesLate > 0 || r.l.nextDay;
        if (schedule === "on-time") return !late;
        if (schedule === "delayed") return late;
        if (schedule === "exception") return Boolean(r.ex);
        return true;
      })
      .sort((a, b) => (sort === "ref" ? a.s.orderRef.localeCompare(b.s.orderRef) : sort === "late" ? b.l.minutesLate - a.l.minutesLate : a.s.eta.localeCompare(b.s.eta)));
  }, [query.data, state, search, route, status, schedule, sort]);

  return (
    <>
      <PageHeader title="Shipment explorer" intro="Search and filter door-to-door orders. “Late” always means: expected after the end of the agreed delivery window (ER-01) — not later than planned." />
      <form role="search" aria-label="Filter shipments" className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5" onSubmit={(e) => e.preventDefault()}>
        <Field label="Search" htmlFor="q" hint="Order, customer, consignee or sailing">
          <input id="q" type="search" value={search} onChange={(e) => setSearch(e.target.value)} className={inputClass} placeholder="e.g. D2D-48213" />
        </Field>
        <Field label="Route" htmlFor="route">
          <select id="route" value={route} onChange={(e) => setRoute(e.target.value)} className={inputClass}>
            <option value="all">All routes</option>
            <option>BE-UK East</option>
            <option>BE-UK South</option>
          </select>
        </Field>
        <Field label="Status" htmlFor="status">
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="active">Active (not delivered)</option>
            <option value="all">All</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Schedule" htmlFor="schedule">
          <select id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value as Schedule)} className={inputClass}>
            <option value="all">All</option>
            <option value="on-time">Inside the window</option>
            <option value="delayed">After the window</option>
            <option value="exception">With an open exception</option>
          </select>
        </Field>
        <Field label="Sort by" htmlFor="sort">
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={inputClass}>
            <option value="eta">Expected delivery</option>
            <option value="late">Most late first</option>
            <option value="ref">Order reference</option>
          </select>
        </Field>
      </form>
      {query.error ? (
        <ErrorState title={query.error.problem.title} detail={query.error.problem.detail} onRetry={query.retry} />
      ) : query.loading ? (
        <LoadingState label="Loading shipments…" />
      ) : rows.length === 0 ? (
        <EmptyState title="No shipments match these filters">Clear the search or choose “All” to see more.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface" tabIndex={0} role="region" aria-label="Shipments table, scrolls sideways on small screens">
          <p aria-live="polite" className="px-4 pt-3 text-sm text-muted">{rows.length} shipment{rows.length === 1 ? "" : "s"}</p>
          <table className="w-full text-sm">
            <caption className="sr-only">Shipments matching the filters</caption>
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                {["Order", "Customer", "Route · sailing", "Status", "Agreed window", "Expected", "vs. window", "Exception"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-2 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ s, l, ex, customer }) => (
                <tr key={s.orderRef} className="border-b border-border last:border-0 hover:bg-surface-2">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link href={`/shipments/${s.orderRef}/`} className="font-medium text-accent underline">{s.orderRef}</Link>
                  </td>
                  <td className="px-4 py-2">
                    {customer.name}
                    <span className="block text-xs text-muted">{customer.pilot ? "pilot" : "control group (shadow)"}{customer.keyAccount ? " · key account" : ""}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.route} · {s.sailingId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{STATUS_LABEL[s.status]}</td>
                  <td className="tabular px-4 py-2 whitespace-nowrap">{s.deliveryWindow ? formatWindow(s.deliveryWindow) : <span className="text-major">none — assumed {formatWindow(l.window)}</span>}</td>
                  <td className="tabular px-4 py-2 whitespace-nowrap">{formatDayTime(s.eta)}</td>
                  <td className="tabular px-4 py-2 whitespace-nowrap">{l.minutesLate > 0 || l.nextDay ? <span className="font-medium text-critical">{formatDuration(l.minutesLate)} late</span> : <span className="text-ok">inside</span>}</td>
                  <td className="px-4 py-2">{ex ? <Link href={`/exceptions/?id=${ex.exceptionId}`} className="inline-flex items-center gap-1.5"><SeverityBadge severity={ex.severity} /><span className="text-accent underline">{ex.exceptionId}</span></Link> : <span className="text-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

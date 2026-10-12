"use client";
// The planner workbench (US-03, US-04, US-08, US-11): one list, most urgent first, and everything an owner does with an exception.
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CAUSE_LABEL, OWNER_LABEL, REASON_CODES, isActive } from "@/domain/engine";
import { RULE_TEXT } from "@/domain/rules";
import { addMinutes, formatDayTime, formatDuration, formatWindow, minutesBetween } from "@/domain/time";
import type { DemoState, ExceptionRecord, OwnerGroup, ReasonCode } from "@/domain/types";
import { useActingAs, useCommand, useDemoState, useQuery } from "@/state/store";
import { Button, Card, EmptyState, ErrorState, Field, InlineError, LoadingState, MessageStatusBadge, PageHeader, RuleChip, SeverityBadge, StatusBadge, cx, inputClass } from "./ui";

const SEVERITY_ORDER = { CRITICAL: 0, MAJOR: 1, MINOR: 2, NONE: 3 };
const key = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()));
/** Inputs are in UK local time; in the demo week (February) that equals UTC. */
const fromInput = (v: string) => (v ? `${v}:00Z` : "");
const toInput = (iso: string) => iso.slice(0, 16);

/** AC-03.1: critical first, then major, then minor; within a severity the earliest due time first. */
export function sortForWorkbench(list: ExceptionRecord[]) {
  return [...list].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999") || a.openedAt.localeCompare(b.openedAt));
}

export function ExceptionWorkbench() {
  const params = useSearchParams();
  const router = useRouter();
  const state = useDemoState();
  const { userId } = useActingAs();
  const me = state.users[userId];
  const query = useQuery((api) => api.listExceptions(), "exceptions");
  const selectedId = params.get("id");
  const sailing = params.get("sailing");
  const [owner, setOwner] = useState<string>(params.get("owner") ?? "all");
  const [view, setView] = useState<string>("active");
  const [severity, setSeverity] = useState<string>(params.get("severity") ?? "all");
  const [unassigned, setUnassigned] = useState(params.get("unassigned") === "1");
  const onlyCalls = params.get("calls") === "1";

  const list = useMemo(() => {
    const all = query.data ?? [];
    return sortForWorkbench(
      all
        .filter((e) => (view === "active" ? isActive(e) : view === "closed" ? !isActive(e) : true))
        .filter((e) => owner === "all" || e.ownerGroup === owner)
        .filter((e) => severity === "all" || e.severity === severity)
        .filter((e) => !unassigned || (!e.assigneeId && isActive(e)))
        .filter((e) => !sailing || state.shipments[e.orderRef].legs.some((l) => l.operator === `Sailing ${sailing}`))
        .filter((e) => !onlyCalls || state.callTasks.some((t) => t.exceptionId === e.exceptionId && t.status === "OPEN")),
    );
  }, [query.data, view, owner, severity, unassigned, sailing, onlyCalls, state]);

  const selected = (query.data ?? []).find((e) => e.exceptionId === selectedId) ?? null;
  const select = (id: string) => {
    const p = new URLSearchParams(params.toString());
    p.set("id", id);
    router.replace(`/exceptions/?${p.toString()}`, { scroll: false });
  };

  return (
    <>
      <PageHeader
        title="Exception management"
        intro={
          <>
            Acting as <strong>{me?.name}</strong> ({me?.title}). Owners see what they can change; everyone else reads (NFR-06). Change the role in the bar above.
          </>
        }
      />
      {sailing && (
        <p className="mb-3 rounded-md border border-border bg-surface px-3 py-2 text-sm">
          Showing exceptions from sailing <strong>{sailing}</strong>. <Link href="/exceptions/" className="text-accent underline">Show all</Link>
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="flex min-w-0 flex-col gap-3">
          <form aria-label="Filter exceptions" className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-3" onSubmit={(e) => e.preventDefault()}>
            <Field label="Show" htmlFor="view">
              <select id="view" className={inputClass} value={view} onChange={(e) => setView(e.target.value)}>
                <option value="active">Active</option>
                <option value="closed">Resolved and closed</option>
                <option value="all">All</option>
              </select>
            </Field>
            <Field label="Owner group" htmlFor="owner">
              <select id="owner" className={inputClass} value={owner} onChange={(e) => setOwner(e.target.value)}>
                <option value="all">All groups</option>
                {(Object.keys(OWNER_LABEL) as OwnerGroup[]).map((g) => (
                  <option key={g} value={g}>{OWNER_LABEL[g]}</option>
                ))}
              </select>
            </Field>
            <Field label="Severity" htmlFor="sev">
              <select id="sev" className={inputClass} value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="all">All</option>
                <option value="CRITICAL">Critical</option>
                <option value="MAJOR">Major</option>
                <option value="MINOR">Minor</option>
              </select>
            </Field>
            <label className="flex items-end gap-2 pb-1.5 text-sm">
              <input type="checkbox" checked={unassigned} onChange={(e) => setUnassigned(e.target.checked)} /> Unassigned only
            </label>
          </form>
          {query.error ? (
            <ErrorState title={query.error.problem.title} detail={query.error.problem.detail} onRetry={query.retry} />
          ) : query.loading ? (
            <LoadingState label="Loading exceptions…" />
          ) : list.length === 0 ? (
            <EmptyState title="Nothing to act on">No exceptions match these filters. Delays inside the agreed window are not exceptions (ER-01).</EmptyState>
          ) : (
            <ul aria-label="Exceptions, most urgent first" className="flex flex-col gap-2">
              {list.map((e) => (
                <li key={e.exceptionId}>
                  <button
                    type="button"
                    onClick={() => select(e.exceptionId)}
                    aria-current={e.exceptionId === selectedId ? "true" : undefined}
                    className={cx("w-full rounded-lg border bg-surface p-3 text-left", e.exceptionId === selectedId ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent")}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={e.severity} />
                      <StatusBadge status={e.status} />
                      {e.windowAssumed && <span className="rounded bg-major-soft px-1.5 py-0.5 text-xs text-major">window assumed</span>}
                      {e.release === "R2" && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">release 2</span>}
                      <span className="ml-auto text-xs text-muted">{e.exceptionId}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium">{e.orderRef} · {CAUSE_LABEL[e.type]}</p>
                    <p className="text-sm text-muted">
                      {state.customers[e.customerId].name}
                      {!state.customers[e.customerId].pilot && " (shadow)"} · {OWNER_LABEL[e.ownerGroup]}
                      {e.assigneeId ? ` · ${state.users[e.assigneeId].name}` : " · unassigned"}
                    </p>
                    <DueLine e={e} now={state.now} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="min-w-0">
          {selected ? <ExceptionDetail ex={selected} state={state} actorId={userId} /> : <EmptyState title="Select an exception">Choose one from the list to see why it exists, who owns it and what to do.</EmptyState>}
        </div>
      </div>
    </>
  );
}

function DueLine({ e, now }: { e: ExceptionRecord; now: string }) {
  if (!e.dueAt || !["OPEN", "HELD", "ESCALATED"].includes(e.status)) {
    return <p className="mt-1 text-xs text-muted">{e.dueAt ? `acknowledged ${formatDayTime(e.acknowledgedAt)}` : "monitored — no response time (minor)"}</p>;
  }
  const left = minutesBetween(now, e.dueAt);
  return (
    <p className={cx("tabular mt-1 text-xs", left < 0 ? "font-semibold text-critical" : left <= 10 ? "text-major" : "text-muted")}>
      Respond by {formatDayTime(e.dueAt)} · {left < 0 ? `overdue ${formatDuration(-left)}` : `${formatDuration(left)} left`}
    </p>
  );
}

function ExceptionDetail({ ex, state, actorId }: { ex: ExceptionRecord; state: DemoState; actorId: string }) {
  const me = state.users[actorId];
  const s = state.shipments[ex.orderRef];
  const customer = state.customers[ex.customerId];
  const canWork = me.role === "SHIFT_LEAD" || me.ownerGroup === ex.ownerGroup;
  const messages = state.messages.filter((m) => m.orderRef === ex.orderRef);
  const tasks = state.callTasks.filter((t) => t.exceptionId === ex.exceptionId);
  const audit = state.audit.filter((a) => a.exceptionId === ex.exceptionId || (a.orderRef === ex.orderRef && a.exceptionId === null && a.at >= ex.openedAt));
  const last = ex.evaluations[ex.evaluations.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <Card
        title={
          <span className="flex flex-wrap items-center gap-2">
            {ex.exceptionId} <SeverityBadge severity={ex.severity} /> <StatusBadge status={ex.status} />
          </span>
        }
        actions={<Link href={`/shipments/${ex.orderRef}/`} className="text-sm text-accent underline">Shipment {ex.orderRef}</Link>}
      >
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Cause</dt><dd>{CAUSE_LABEL[ex.type]} — {s.updates?.at(-1)?.text ?? ""}</dd></div>
          <div><dt className="text-muted">Customer</dt><dd>{customer.name}{customer.keyAccount ? " · key account" : ""} · {customer.pilot ? "pilot" : "control group — shadow mode, nothing is sent (AC-13.1)"}</dd></div>
          <div><dt className="text-muted">Window → expected</dt><dd className="tabular">{formatWindow(s.deliveryWindow)}{ex.windowAssumed ? " (assumed, FR-03)" : ""} → {formatDayTime(s.eta)} · {last.minutesLate > 0 ? `${formatDuration(last.minutesLate)} after the window` : "inside the window"}{last.nextDay ? ", next day" : ""}</dd></div>
          <div><dt className="text-muted">Owner</dt><dd>{OWNER_LABEL[ex.ownerGroup]}{ex.assigneeId ? ` · ${state.users[ex.assigneeId].name}` : " · nobody yet"}</dd></div>
          <div><dt className="text-muted">Opened</dt><dd className="tabular">{formatDayTime(ex.openedAt)}</dd></div>
          <div><dt className="text-muted">Respond by</dt><dd className="tabular">{ex.dueAt ? formatDayTime(ex.dueAt) : "no response time (minor, ER-09)"}{ex.escalatedAt ? ` · escalated ${formatDayTime(ex.escalatedAt)}` : ""}</dd></div>
        </dl>
        <div className="mt-4 rounded-md bg-surface-2 p-3 text-sm">
          <p className="font-medium">Why the rules decided this</p>
          <ul className="mt-1 flex flex-col gap-1">
            {ex.rulesApplied.map((r) => (
              <li key={r}><RuleChip id={r} /> <span className="text-muted">{RULE_TEXT[r]}</span></li>
            ))}
          </ul>
          <p className="mt-2 text-muted">Customer notification decided: <strong className="text-text">{ex.notification}</strong></p>
          <p className="mt-2"><Link href={`/analysis/?rules=${ex.rulesApplied.join(",")}#examples`} className="text-accent underline">See the acceptance examples and test results for these rules →</Link></p>
        </div>
      </Card>

      <Actions ex={ex} state={state} actorId={actorId} canWork={canWork} />

      <Card title="Customer messages for this order">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">{ex.status === "HELD" ? "Held: nothing goes to the customer until a planner confirms the situation with the haulier (ER-07)." : "No message — the rules did not ask for one (minor, ER-10)."}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((m) => (
              <li key={m.messageId} className="rounded-md border border-border p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{m.messageId}</span>
                  <MessageStatusBadge status={m.status} />
                  <span className="text-muted">{m.kind.toLowerCase().replace("_", " ")} · {formatDayTime(m.sentAt ?? m.createdAt)}{m.status === "SENT" ? ` · ${m.channels.join(" + ").toLowerCase()}` : ""}</span>
                </div>
                <p className="mt-1 font-medium">{m.content.headline}</p>
                <p className="text-muted">Agreed window {m.content.agreedWindow} · {m.content.reasonCategory}. {m.content.nextStep}</p>
                {m.content.plannerNote && <p className="mt-1 italic">Planner: “{m.content.plannerNote}”</p>}
                {m.status === "PENDING_NOTE" && <PendingMessage messageId={m.messageId} sendAt={m.sendAt} now={state.now} actorId={actorId} canWork={canWork} />}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {tasks.length > 0 && (
        <Card title="Call tasks for customer service (ER-11)">
          {tasks.map((t) => (
            <CallTaskRow key={t.taskId} taskId={t.taskId} state={state} actorId={actorId} />
          ))}
        </Card>
      )}

      <Card title="Evaluation history">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
          <table className="w-full text-sm">
            <caption className="sr-only">Every rule evaluation of this exception</caption>
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                {["When", "Result", "Severity", "vs. window", "Notification", "Rules"].map((h) => <th key={h} scope="col" className="py-1.5 pr-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {ex.evaluations.map((ev, i) => (
                <tr key={i} className="border-b border-border last:border-0 align-top">
                  <td className="tabular py-1.5 pr-3 whitespace-nowrap">{formatDayTime(ev.at)}</td>
                  <td className="py-1.5 pr-3">{ev.type}</td>
                  <td className="py-1.5 pr-3"><SeverityBadge severity={ev.severity} /></td>
                  <td className="tabular py-1.5 pr-3 whitespace-nowrap">{ev.minutesLate > 0 ? `+${formatDuration(ev.minutesLate)}` : "inside"}</td>
                  <td className="py-1.5 pr-3">{ev.notification}</td>
                  <td className="py-1.5 font-mono text-xs">{ev.rules.join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Audit trail" id="audit">
        <ol className="flex flex-col gap-2 text-sm" aria-label="Audit entries, oldest first">
          {audit.map((a) => (
            <li key={a.seq} className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-border pb-2 last:border-0">
              <span className="tabular text-muted">{formatDayTime(a.at)}</span>
              <span>
                <span className="font-mono text-xs">{a.action}</span> · <span className="text-muted">{a.actorId === "SYSTEM" ? "system" : state.users[a.actorId]?.name}</span>
                <span className="block">{a.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function Actions({ ex, state, actorId, canWork }: { ex: ExceptionRecord; state: DemoState; actorId: string; canWork: boolean }) {
  const { run, pending, error } = useCommand();
  const me = state.users[actorId];
  const s = state.shipments[ex.orderRef];
  const planners = Object.values(state.users).filter((u) => u.ownerGroup === ex.ownerGroup && u.role !== "SHIFT_LEAD");
  const [assignee, setAssignee] = useState(planners[0]?.userId ?? "");
  const [action, setAction] = useState("");
  const [winStart, setWinStart] = useState(toInput(addMinutes(s.eta, -30)));
  const [winEnd, setWinEnd] = useState(toInput(addMinutes(s.eta, 90)));
  const [reason, setReason] = useState<ReasonCode | "">("");
  const [note, setNote] = useState("");
  const [newEta, setNewEta] = useState(toInput(addMinutes(state.now, 180)));

  if (!isActive(ex)) {
    return (
      <Card title="Outcome">
        <p className="text-sm">
          {ex.status === "RESOLVED" ? `Resolved ${formatDayTime(ex.resolvedAt)}` : `Closed ${formatDayTime(ex.closedAt)}`} · reason: <strong>{REASON_CODES.find((r) => r.code === ex.reasonCode)?.label ?? "—"}</strong>
          {ex.resolutionNote ? ` — ${ex.resolutionNote}` : ""}
        </p>
        {ex.actions.length > 0 && <ActionList ex={ex} state={state} />}
      </Card>
    );
  }

  return (
    <Card title="What to do">
      {!canWork && (
        <p className="mb-3 rounded-md bg-surface-2 p-3 text-sm">
          You are acting as <strong>{me.title}</strong>. You can read this exception; only {OWNER_LABEL[ex.ownerGroup]} or the shift lead can change it (NFR-06).
        </p>
      )}
      <div className="flex flex-col gap-4">
        {ex.status === "HELD" && (
          <fieldset className="rounded-md border border-border p-3" disabled={!canWork || pending}>
            <legend className="px-1 text-sm font-medium">Confirm with the haulier (US-08)</legend>
            <p className="mb-2 text-sm text-muted">The customer hears nothing until you confirm. Many hauliers simply did not update the app (D-04).</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button onClick={() => run((api) => api.confirmStatus(ex.exceptionId, "ON_TIME", null, actorId, key()))}>Haulier confirms on time</Button>
              <Field label="New ETA from the haulier (UK time)" htmlFor="neweta">
                <input id="neweta" type="datetime-local" className={inputClass} value={newEta} onChange={(e) => setNewEta(e.target.value)} />
              </Field>
              <Button variant="primary" onClick={() => run((api) => api.confirmStatus(ex.exceptionId, "DELAYED", fromInput(newEta), actorId, key()))}>Haulier confirms a delay</Button>
            </div>
          </fieldset>
        )}
        {ex.status === "OPEN" && (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" disabled={!canWork || pending} onClick={() => run((api) => api.acknowledge(ex.exceptionId, actorId, key()))}>
              Acknowledge — I own this
            </Button>
            <span className="text-sm text-muted">Records your name and time; stops the response clock (AC-04.1).</span>
          </div>
        )}
        {me.role === "SHIFT_LEAD" && ["OPEN", "ESCALATED", "ACKNOWLEDGED", "RECOVERED"].includes(ex.status) && (
          <div className="flex flex-wrap items-end gap-3">
            <Field label={ex.status === "ESCALATED" ? "Escalated — assign to a planner (AC-03.5)" : "Assign to"} htmlFor="assignee">
              <select id="assignee" className={inputClass} value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                {planners.map((p) => <option key={p.userId} value={p.userId}>{p.name}</option>)}
              </select>
            </Field>
            <Button disabled={pending || !assignee} onClick={() => run((api) => api.assign(ex.exceptionId, assignee, actorId, key()))}>Assign</Button>
          </div>
        )}
        {ex.status === "ESCALATED" && me.role !== "SHIFT_LEAD" && <p className="text-sm text-critical">Escalated to the shift lead: not acknowledged within the response time (ER-09).</p>}
        {["ACKNOWLEDGED", "RECOVERED"].includes(ex.status) && (
          <>
            <fieldset className="rounded-md border border-border p-3" disabled={!canWork || pending}>
              <legend className="px-1 text-sm font-medium">Register a response action</legend>
              <div className="flex flex-col gap-2">
                <label htmlFor="action" className="sr-only">Action taken</label>
                <textarea id="action" rows={2} className={inputClass} value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. Called the consignee's goods-in desk; new slot possible this afternoon" />
                <Button className="self-start" onClick={async () => { await run((api) => api.addAction(ex.exceptionId, action, actorId, key())); setAction(""); }}>Add action</Button>
              </div>
              {ex.actions.length > 0 && <ActionList ex={ex} state={state} />}
            </fieldset>
            <fieldset className="rounded-md border border-border p-3" disabled={!canWork || pending}>
              <legend className="px-1 text-sm font-medium">Agree a new delivery window (AC-04.2)</legend>
              <div className="flex flex-wrap items-end gap-3">
                <Field label="From (UK time)" htmlFor="ws"><input id="ws" type="datetime-local" className={inputClass} value={winStart} onChange={(e) => setWinStart(e.target.value)} /></Field>
                <Field label="To (UK time)" htmlFor="we"><input id="we" type="datetime-local" className={inputClass} value={winEnd} onChange={(e) => setWinEnd(e.target.value)} /></Field>
                <Button onClick={() => run((api) => api.replan(ex.exceptionId, { start: fromInput(winStart), end: fromInput(winEnd) }, actorId, key()))}>Record new window</Button>
              </div>
              <p className="mt-2 text-xs text-muted">The order is re-evaluated. Back inside the window → recovered; the customer gets “back on schedule” only if they were told before (ER-13).</p>
            </fieldset>
            <fieldset className="rounded-md border border-border p-3" disabled={!canWork || pending}>
              <legend className="px-1 text-sm font-medium">Resolve (AC-04.3)</legend>
              <div className="flex flex-wrap items-end gap-3">
                <Field label="Reason (required)" htmlFor="reason">
                  <select id="reason" className={inputClass} value={reason} onChange={(e) => setReason(e.target.value as ReasonCode)}>
                    <option value="">Choose…</option>
                    {REASON_CODES.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
                  </select>
                </Field>
                <Field label={reason === "OTHER" ? "Note (required for “other”)" : "Note (optional)"} htmlFor="note">
                  <input id="note" className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
                </Field>
                <Button variant="primary" onClick={() => run((api) => api.resolve(ex.exceptionId, reason as ReasonCode, note, actorId, key()))}>Resolve</Button>
              </div>
            </fieldset>
          </>
        )}
      </div>
      <InlineError message={error} />
    </Card>
  );
}

function ActionList({ ex, state }: { ex: ExceptionRecord; state: DemoState }) {
  return (
    <ul className="mt-3 flex flex-col gap-1 text-sm" aria-label="Response actions">
      {ex.actions.map((a, i) => (
        <li key={i}><span className="tabular text-muted">{formatDayTime(a.at)}</span> · {state.users[a.actorId]?.name}: {a.text}</li>
      ))}
    </ul>
  );
}

function PendingMessage({ messageId, sendAt, now, actorId, canWork }: { messageId: string; sendAt: string | null; now: string; actorId: string; canWork: boolean }) {
  const { run, pending, error } = useCommand();
  const [note, setNote] = useState("");
  const left = sendAt ? minutesBetween(now, sendAt) : 0;
  return (
    <div className="mt-2 rounded-md bg-major-soft p-3">
      <p className="text-sm">Goes out automatically at {formatDayTime(sendAt)} ({left} min). Add a short personal note first if you like (D-08).</p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <label htmlFor={`note-${messageId}`} className="sr-only">Planner note</label>
        <input id={`note-${messageId}`} className={cx(inputClass, "min-w-64 flex-1")} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. We are asking your DC for a new slot this afternoon." disabled={!canWork} />
        <Button variant="primary" disabled={!canWork || pending} onClick={() => run((api) => api.sendWithNote(messageId, note, actorId, key()))}>Send now</Button>
      </div>
      <InlineError message={error} />
    </div>
  );
}

function CallTaskRow({ taskId, state, actorId }: { taskId: string; state: DemoState; actorId: string }) {
  const task = state.callTasks.find((t) => t.taskId === taskId)!;
  const { run, pending, error } = useCommand();
  const [outcome, setOutcome] = useState("");
  return (
    <div className="text-sm">
      <p>
        <span className="font-medium">{task.taskId}</span> · call {state.customers[task.customerId].name} about {task.orderRef} · created {formatDayTime(task.createdAt)} ·{" "}
        {task.status === "DONE" ? <span className="text-ok">done by {state.users[task.completedBy!]?.name}: {task.outcome}</span> : <span className="text-major">open</span>}
      </p>
      {task.status === "OPEN" && (
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <label htmlFor={`outcome-${taskId}`} className="sr-only">Call outcome</label>
          <input id={`outcome-${taskId}`} className={cx(inputClass, "min-w-64 flex-1")} value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Outcome of the call (required)" />
          <Button disabled={pending} onClick={() => run((api) => api.completeCallTask(taskId, outcome, actorId, key()))}>Complete call task</Button>
        </div>
      )}
      <InlineError message={error} />
    </div>
  );
}

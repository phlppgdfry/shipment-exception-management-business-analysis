"use client";
// The customer portal's order card (US-05, US-10): what the customer sees, in their words.
// It is built only from messages that were actually sent — never from internal severity, rules or owners.
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatDayTime } from "@/domain/time";
import { useDemoState, useQuery } from "@/state/store";
import { Button, EmptyState, ErrorState, Field, LoadingState, PageHeader, cx, inputClass } from "./ui";

const TONE = {
  ok: { box: "border-ok", badge: "bg-ok-soft text-ok", label: "On schedule" },
  delayed: { box: "border-major", badge: "bg-major-soft text-major", label: "Delayed" },
  critical: { box: "border-critical", badge: "bg-critical-soft text-critical", label: "Significant delay" },
  action: { box: "border-major", badge: "bg-major-soft text-major", label: "Action required" },
};

export function CustomerTracking() {
  const params = useSearchParams();
  const router = useRouter();
  const state = useDemoState();
  const ref = (params.get("ref") ?? "").toUpperCase();
  const [input, setInput] = useState(ref || "D2D-48213");
  const query = useQuery((api) => (ref ? api.getTracking(ref) : Promise.resolve(null)), `track-${ref}`);
  const examples = ["D2D-48213", "D2D-48231", "D2D-48288", "D2D-48302"];

  return (
    <>
      <PageHeader title="Customer view" intro="The order card in the customer portal. Customers see the agreed window, the new expected time, the reason in plain words and the next step — nothing internal." />
      <form
        className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/track/?ref=${encodeURIComponent(input.trim().toUpperCase())}`);
        }}
      >
        <Field label="Order reference" htmlFor="ref">
          <input id="ref" className={inputClass} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Button type="submit" variant="primary">Track</Button>
        <p className="text-sm text-muted">
          Try:{" "}
          {examples.map((x, i) => (
            <span key={x}>
              <button type="button" className="text-accent underline" onClick={() => { setInput(x); router.replace(`/track/?ref=${x}`); }}>{x}</button>
              {i < examples.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </form>
      {!ref ? (
        <EmptyState title="Enter an order reference">Use the reference from your order confirmation, for example D2D-48213.</EmptyState>
      ) : query.error ? (
        <ErrorState title="We could not load your order" detail="Please try again in a moment. If it keeps failing, contact customer service." onRetry={query.retry} />
      ) : query.loading ? (
        <LoadingState label="Looking up your order…" />
      ) : !query.data ? (
        <EmptyState title={`We could not find ${ref}`}>Check the reference on your order confirmation.</EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article aria-label={`Order ${query.data.orderRef}`} className={cx("rounded-xl border-2 bg-surface p-5", TONE[query.data.tone].box)}>
            <p className="text-sm text-muted">{query.data.customerName} · order {query.data.orderRef}</p>
            <p className={cx("mt-2 inline-flex rounded px-2 py-0.5 text-sm font-semibold", TONE[query.data.tone].badge)}>{TONE[query.data.tone].label}</p>
            <h2 className="mt-2 text-xl font-semibold">{query.data.headline}</h2>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Progress</dt><dd>{query.data.progress}</dd>
              <dt className="text-muted">Your delivery window</dt><dd className="tabular">{query.data.agreedWindow}</dd>
              <dt className="text-muted">Expected</dt><dd className="tabular font-semibold">{query.data.expected}</dd>
              {query.data.reason && (<><dt className="text-muted">Reason</dt><dd>{query.data.reason}</dd></>)}
              {query.data.nextStep && (<><dt className="text-muted">Next step</dt><dd>{query.data.nextStep}</dd></>)}
            </dl>
            {query.data.plannerNote && <p className="mt-4 rounded-md bg-surface-2 p-3 text-sm">Message from your planner: “{query.data.plannerNote}”</p>}
            <p className="mt-4 text-xs text-muted">Times are UK local time. Questions? Reply to the e-mail or call customer service.</p>
          </article>
          <section aria-label="Messages" className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-semibold">Messages about this order</h2>
            {query.data.messages.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No messages. We only write when your delivery window is at risk — or when it is back on schedule.</p>
            ) : (
              <ol className="mt-3 flex flex-col gap-3">
                {query.data.messages.map((m) => (
                  <li key={m.messageId} className="rounded-md border border-border p-3 text-sm">
                    <p className="tabular text-xs text-muted">{formatDayTime(m.sentAt)} · {m.channels.join(" + ").toLowerCase()}</p>
                    <p className="font-medium">{m.headline}</p>
                    <p>{m.reasonCategory}. {m.nextStep}</p>
                    {m.plannerNote && <p className="italic">“{m.plannerNote}”</p>}
                  </li>
                ))}
              </ol>
            )}
            {!query.data.pilot && (
              <p className="mt-4 rounded-md bg-surface-2 p-3 text-sm">
                Demo note: {query.data.customerName} is in the <strong>control group</strong>. Exceptions are logged for the pilot measurement, but no messages are sent (shadow mode, AC-13.1).
              </p>
            )}
            <p className="mt-4 text-xs text-muted">Demo note: internal details — severity, owner, rule IDs, held or throttled messages — are never shown here. Simulated clock: {formatDayTime(state.now)}.</p>
          </section>
        </div>
      )}
    </>
  );
}

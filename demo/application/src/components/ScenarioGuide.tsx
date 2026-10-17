"use client";
// The guided scenario: ten steps from "on schedule" to "inspect the acceptance criteria".
// Every button calls the same mock API the screens use; the guide only adds the script.
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { SCENARIO } from "@/domain/seed";
import { formatCustomerWindow } from "@/domain/time";
import { useCommand, useDemoState } from "@/state/store";
import type { DemoState } from "@/domain/types";
import { Button, InlineError, RuleChip, SeverityBadge, cx } from "./ui";
import { RULE_TEXT } from "@/domain/rules";

const REF = SCENARIO.orderRef;

function facts(state: DemoState) {
  const ex = state.exceptions.find((e) => e.orderRef === REF);
  const msgs = state.messages.filter((m) => m.orderRef === REF);
  const delayEvent = state.events.find((e) => e.eventId === SCENARIO.delayEvent.eventId && e.outcome === "PROCESSED");
  return {
    ex,
    delayEvent,
    published: Boolean(delayEvent),
    duplicateTried: state.events.some((e) => e.eventId === SCENARIO.delayEvent.eventId && e.outcome === "DUPLICATE_IGNORED"),
    staleTried: state.events.some((e) => e.eventId === SCENARIO.staleEvent.eventId),
    assigned: Boolean(ex?.assigneeId),
    actionLogged: Boolean(ex?.actions.length),
    delaySent: msgs.some((m) => m.kind === "DELAY" && m.status === "SENT"),
    pending: msgs.find((m) => m.status === "PENDING_NOTE"),
    replanned: Boolean(state.shipments[REF].originalWindow),
    resolved: ex ? ["RESOLVED", "CLOSED"].includes(ex.status) : false,
  };
}

interface Step {
  title: string;
  body: ReactNode;
  done: boolean;
  actions?: { label: string; run: () => Promise<unknown>; disabled?: boolean }[];
  link?: { href: string; label: string };
}

export function ScenarioGuide() {
  const state = useDemoState();
  const { run, pending, error } = useCommand();
  const f = facts(state);
  const exId = f.ex?.exceptionId;
  const step = state.scenarioStep;
  const [expanded, setExpanded] = useState(true);

  const steps: Step[] = [
    {
      title: "A shipment starts on schedule",
      body: (
        <>
          <strong>{REF}</strong> — Northfield Foods (key account), reefer with chilled food, window {formatCustomerWindow(state.shipments[REF].originalWindow ?? state.shipments[REF].deliveryWindow)} UK time, gated in at the
          continental terminal for sailing E-312.
        </>
      ),
      done: true,
      link: { href: `/shipments/${REF}/`, label: "Open the shipment" },
    },
    {
      title: "A transport event creates a delay",
      body: <>The sailing system publishes: sailing E-312 departs at 18:00 instead of 12:00 (+6 h, technical inspection). The TMS sends it to the exception component as an event.</>,
      done: f.published,
      actions: [{ label: "Publish the sailing delay", run: () => run((api) => api.postTmsEvent(SCENARIO.delayEvent)), disabled: f.published }],
    },
    {
      title: "The detection rule finds the orders that matter",
      body: (
        <>
          All {f.delayEvent?.affectedOrders.length ?? 11} orders on E-312 are evaluated; only the {f.delayEvent?.exceptionsOpened.length ?? 4} whose delivery now falls <em>after the end of their window</em> become exceptions <RuleChip id="ER-01" text={RULE_TEXT["ER-01"]} />. Calder Retail has a wide window: later, but not late.
          {f.published && (
            <>
              {" "}Two integration checks you can try: send the same event again (recognised by its ID and ignored, NFR-03), or deliver an <em>older</em> ETA update for D2D-48231 after a newer one (not applied: out of order).
            </>
          )}
        </>
      ),
      done: f.published,
      actions: f.published
        ? [
            { label: f.duplicateTried ? "Duplicate ignored ✓" : "Send the same event again", run: () => run((api) => api.postTmsEvent(SCENARIO.delayEvent)), disabled: f.duplicateTried },
            { label: f.staleTried ? "Out-of-order update ignored ✓" : "Send an older ETA update", run: () => run((api) => api.postTmsEvent(SCENARIO.staleEvent)), disabled: f.staleTried },
          ]
        : undefined,
      link: { href: "/exceptions/?sailing=E-312", label: "See the exceptions from E-312" },
    },
    {
      title: "The rules classify the severity",
      body: (
        <>
          Expected 280 min after the window → major <RuleChip id="ER-02" text={RULE_TEXT["ER-02"]} />; reefer goes one level up → <SeverityBadge severity="CRITICAL" /> <RuleChip id="ER-04" text={RULE_TEXT["ER-04"]} />. Key account → message plus a
          call task for customer service <RuleChip id="ER-11" text={RULE_TEXT["ER-11"]} />. Response time 30 min <RuleChip id="ER-09" text={RULE_TEXT["ER-09"]} />. The message waits up to 5 min for a planner note (D-08).
        </>
      ),
      done: Boolean(f.ex),
      link: exId ? { href: `/exceptions/?id=${exId}`, label: `Open ${exId}` } : undefined,
    },
    {
      title: "An operations user assigns an owner",
      body: <>The shift lead (Priya Raman) assigns the exception to the senior planner, Maren Vos (AC-03.5). The response clock stops.</>,
      done: f.assigned,
      actions: [{ label: "Assign to Maren Vos (as shift lead)", run: () => run((api) => api.assign(exId!, SCENARIO.assignTo, "USR-SHIFTLEAD", "scenario-assign")), disabled: !exId || f.assigned }],
    },
    {
      title: "A response action is registered",
      body: (
        <>
          Maren calls the consignee and logs it: “{SCENARIO.responseAction}” She adds a short note to the customer message and sends it now instead of waiting (D-08, AC-05.4).
        </>
      ),
      done: f.actionLogged,
      actions: [
        {
          label: f.pending ? "Log the action and send the message with a note" : "Log the action",
          disabled: !f.assigned || f.actionLogged,
          run: () => run((api) => api.respondAndSend(exId!, SCENARIO.responseAction, f.pending?.messageId ?? null, SCENARIO.messageNote, "USR-PLANNER", "scenario-action")),
        },
      ],
    },
    {
      title: "The customer-facing status is updated",
      body: <>The customer sees one clear message: the agreed window, the new ETA, the reason in plain words and what happens next — never driver data (NFR-05). Internal details (severity, rules, owner) stay inside.</>,
      done: f.delaySent,
      link: { href: `/track/?ref=${REF}`, label: "Open the customer view" },
    },
    {
      title: "The exception is resolved",
      body: (
        <>
          A new window {formatCustomerWindow(SCENARIO.newWindow)} (UK time) is agreed with the consignee. The order is re-evaluated: back inside the window → <em>recovered</em>, and because the customer was told, they get a “back on schedule” message <RuleChip id="ER-13" text={RULE_TEXT["ER-13"]} />. Maren then resolves with reason
          “new window agreed” (AC-04.3).
        </>
      ),
      done: f.resolved,
      actions: [
        { label: "Record the new window", run: () => run((api) => api.replan(exId!, SCENARIO.newWindow, "USR-PLANNER", "scenario-replan")), disabled: !f.assigned || f.replanned },
        { label: "Resolve: new window agreed", run: () => run((api) => api.resolve(exId!, SCENARIO.resolveReason, "", "USR-PLANNER", "scenario-resolve")), disabled: !f.replanned || f.resolved },
      ],
    },
    {
      title: "The audit trail records every change",
      body: <>Every event, rule decision, message, assignment and status change is logged with who, when and which rules applied — so support can answer “why did this customer get this message?” (NFR-08).</>,
      done: f.resolved,
      link: exId ? { href: `/exceptions/?id=${exId}#audit`, label: "Open the audit trail" } : undefined,
    },
    {
      title: "Inspect the acceptance criteria and tests",
      body: <>The same rules are specified as Given/When/Then examples. AC-01.11 (reefer → critical), AC-11.1 (key account → call task) and AC-10.1 (recovery message) cover this scenario; the workspace shows the result of the test run in this build.</>,
      done: false,
      link: { href: "/analysis/#examples", label: "Open acceptance criteria and test results" },
    },
  ];

  const current = Math.min(step, steps.length - 1);
  const s = steps[current];
  const go = (n: number) => run((api) => api.setScenarioStep(Math.max(0, Math.min(steps.length - 1, n))));

  return (
    <section id="scenario" aria-labelledby="scenario-title" className="rounded-lg border border-accent bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <h2 id="scenario-title" className="text-base font-semibold">
          Guided scenario <span className="font-normal text-muted">· step {current + 1} of {steps.length}</span>
        </h2>
        <Button variant="ghost" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Hide steps" : "Show steps"}
        </Button>
      </div>
      <div className="p-4">
        <ol className={cx("mb-4 grid gap-1 text-sm", !expanded && "hidden")} aria-label="Scenario steps">
          {steps.map((x, i) => (
            <li key={x.title}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === current ? "step" : undefined}
                className={cx("flex w-full items-center gap-2 rounded px-2 py-1 text-left", i === current ? "bg-accent-soft font-semibold text-accent" : "hover:bg-surface-2")}
              >
                <span aria-hidden="true" className={cx("inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs", x.done && i !== current ? "border-ok bg-ok-soft text-ok" : "border-border")}>
                  {x.done && i !== current ? "✓" : i + 1}
                </span>
                {x.title}
                {x.done && i !== current && <span className="sr-only"> (done)</span>}
              </button>
            </li>
          ))}
        </ol>
        <h3 className="font-semibold">
          {current + 1}. {s.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed">{s.body}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {s.actions?.map((a) => (
            <Button key={a.label} variant="primary" disabled={pending || a.disabled} onClick={() => a.run()}>
              {a.label}
            </Button>
          ))}
          {s.link && (
            <Link href={s.link.href} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-accent">
              {s.link.label} →
            </Link>
          )}
        </div>
        <InlineError message={error} />
        <div className="mt-4 flex justify-between border-t border-border pt-3">
          <Button onClick={() => go(current - 1)} disabled={current === 0 || pending}>
            ← Previous
          </Button>
          <Button onClick={() => go(current + 1)} disabled={current === steps.length - 1 || pending} variant={s.done ? "primary" : "secondary"}>
            Next step →
          </Button>
        </div>
      </div>
    </section>
  );
}

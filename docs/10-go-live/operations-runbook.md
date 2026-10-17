# Operations runbook — exception component

> **What this is:** what application support does when the exception component misbehaves — detection, triage, workaround, recovery and communication for the six incidents that matter. **For:** application support (first and second line), the on-call developer, the PO during hypercare. **Previous:** [support handover](support-handover.md) · **Next:** [change and adoption](change-and-adoption.md).

*Proposed runbook for a fictional organisation. It has not been rehearsed with a real support team; the demo can show some of the failure paths (TMS outage, duplicate and out-of-order events). Never paste customer contact data or message bodies into incident tickets.*

## Service at a glance

| | |
|---|---|
| Service | Exception component (rules, workbench API, messaging, audit) — [ADR-001](../12-architecture/adr/ADR-001-small-component-next-to-tms.md) |
| Business owner | Product Owner Customer Visibility · operational owner: road planning lead |
| Technical owner | the delivery team (hypercare weeks 6–7), then application support |
| Hours that matter | planning hours 05:00–23:00, 7 days (NFR-02) |
| Dependencies | TMS webhooks + REST API, notification service, identity provider, CS queue mailbox |
| Kill switch | feature toggle per customer (FR-14); message templates can be disabled separately |

## Signals and thresholds

| Signal | Threshold | Severity | Where it comes from |
|---|---|---|---|
| No webhook received | 15 min in planning hours | **P2** | heartbeat (NFR-04) |
| Event processing failed | ≥ 1 event in *failed* | P3, P2 if ≥ 10 | queue table status |
| Evaluation latency | p95 > 2 min for 15 min | P3 | metrics (NFR-01) |
| Messages pending > 10 min (not in a planner-note window) | ≥ 1 | P2 | message status |
| Duplicate messages to one customer | any confirmed | **P1** | customer, CS or K8 spike |
| False alarms | > 1 per day (hypercare threshold) | P2 | planner report, K7 |

**P1** — wrong or duplicate customer messages, or personal data exposed: act within 15 minutes, any hour. **P2** — customers not informed or planners blind: act within 1 hour in planning hours. **P3** — degraded, workaround exists: next working day.

## Playbooks

### RB-1 Webhooks stopped (P2)

1. **Confirm:** last received event time; TMS status page; test call to the TMS API with the service account.
2. **Protect the work:** tell the shift lead; planners fall back to the disruption sheet (kept for 4 weeks after go-live) for sailing delays.
3. **Recover:** if the API works, start the *re-read changed orders* job for the gap window (NFR-04); events are idempotent, so re-reading is safe.
4. **Escalate** to the TMS supplier if webhooks do not resume within 30 minutes; log their ticket number.
5. **Close** when the gap is re-read and new events arrive; note the window in the pilot log (K2 will show it).

### RB-2 Events failing to process (P3/P2)

1. Group failed events by error class: TMS read failed, mapping error, rule error.
2. **TMS read failed** → transient: retry the batch. **Mapping or rule error** → do *not* retry endlessly; capture the event ID and input, raise a defect, keep the event in *failed*.
3. Check whether any affected order is late now (open the order in the TMS); if yes, tell the owner group so a human handles it.

### RB-3 Wrong or duplicate customer messages (P1)

1. **Stop the harm first:** toggle off the affected customer (< 5 min); if the cause is unclear within 30 minutes, toggle off all pilot customers ([rollback](release-readiness.md#rollback)).
2. Find the orders and messages in the audit trail by order reference; the rule IDs show *why* each message was decided.
3. Decide with the PO: rule working as designed (then it is a rule question → backlog) or a bug (→ fix, retest with the decision examples).
4. Customer contact: the account manager or CS calls the affected customers the same day with one short correction; no technical detail.
5. Post-incident review within two working days; add the missing example or test.

### RB-4 Notification service down (P2)

1. Messages stay *pending* and retry; the workbench shows "message not yet sent".
2. If pending > 30 minutes for a critical exception, CS calls the customer (call-task fallback) and logs it on the exception.
3. When the service is back, verify pending messages went out once (idempotent message IDs) — no manual resend.

### RB-5 Planner workload unmanageable (business, P2)

1. Shift lead reports; check exceptions per planner per shift vs. the guardrail (KPI tree).
2. PO decides: keep the workbench, toggle off messages, or raise a threshold — never silently.
3. Record the decision and the data in the decision log.

### RB-6 "Why did this customer get this message?" (service request)

Use the [KB article](support-handover.md#kb-article--proactive-delivery-updates-pilot): open the exception, read the evaluation history (rule IDs, minutes late, notification decision). Most answers are a rule (e.g. ER-12 throttling), not a bug.

## Communication

| Audience | When | What | Who |
|---|---|---|---|
| Shift lead / planners | P1/P2 start and end | impact, workaround, next update time | application support |
| PO | P1 immediately, P2 within 1 h | scope, decision needed | application support |
| Pilot customers | only for P1 that reached them | short correction by phone | account manager / CS |
| Sponsor | P1 summary next morning | what happened, what changes | PO |

## Hypercare (weeks 6–7) and handover to support

Daily 09:30 check-in (see [release readiness](release-readiness.md#hypercare-weeks-67)). Support takes over when: two consecutive weeks within thresholds, R1.1 is live, this runbook has been walked through once (tabletop exercise with RB-1 and RB-3), and the on-call rota includes someone who has replayed a failed event in the acceptance environment.

---

[Documentation map](../00-documentation-map.md) · Next: [Change and adoption →](change-and-adoption.md)

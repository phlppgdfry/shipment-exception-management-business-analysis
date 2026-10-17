# ADR-001 — A small exception component next to the TMS

**Status:** accepted · **Date:** sprint 0 (fictional) · **Deciders:** PO, IT architect · **Follows from:** [D-03](../../03-workshops/decision-log.md#d-03)

## Context

The SaaS TMS holds orders, windows, statuses and the customer portal. It publishes webhooks and has a REST API, but it has no exception object, severity or owner. The supplier has an exception module on its roadmap without a committed date. The pilot must start within ±6 weeks.

## Options

| Option | For | Against |
|---|---|---|
| A. Configure TMS standard notifications | cheap, fast | ±9 messages per order, 0.3 relevant (O2 test); no owner, no severity |
| B. Wait for the supplier module | no new component to support | no date; unknown fit with our rules |
| C. External visibility platform | strong tracking | duplicates TMS data; €150–250k/year; does not solve ownership (O4) |
| **D. Small component next to the TMS** | our rules, our timing; thin | one more component for application support |

## Decision

D. The component listens to TMS webhooks, reads what the rules need through the API, keeps exceptions, messages and audit, and writes back only an order note. It does **not** copy order data or re-plan deliveries.

## Consequences

- Application support owns one more service: runbook, monitoring and on-call in [the operations runbook](../../10-go-live/operations-runbook.md).
- The TMS stays system of record ([data ownership](../data-model-and-states.md#who-owns-which-data)).
- Quarterly review against the supplier roadmap; ADR-002 keeps a move cheap.
- Revisit if the supplier module covers ≥ 90% of the decision examples (see competency task T10 in the learning lab).

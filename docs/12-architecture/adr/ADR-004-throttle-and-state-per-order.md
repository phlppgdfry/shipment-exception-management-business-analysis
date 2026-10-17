# ADR-004 — One active exception and one throttle per order

**Status:** accepted · **Deciders:** PO, team · **Follows from:** BAT finding [DEF-04](../../09-acceptance/bat-log.md), ER-12

## Context

In BAT a customer received two e-mails within ten minutes about one order: a sailing delay and the resulting road re-plan opened two exceptions, and throttling worked per exception. The customer thinks in orders, not in exceptions.

## Options

| Option | For | Against |
|---|---|---|
| Keep per-exception state and throttle | precise per cause | the customer sees one order, two stories |
| **Per order: one active exception, throttle per order** | one story per order; simple for support | a second cause updates the active exception instead of opening its own |

## Decision

Per order. A new cause on an order with an active exception re-evaluates that exception (type, severity, owner may change; history keeps every evaluation). Throttling compares with the last message **for the order**.

## Consequences

- Reporting per cause uses the evaluation history, not the number of exceptions.
- Recorded as a known simplification in the demo README; revisit if causes need separate owners at the same time (e.g. customs + road in release 2).

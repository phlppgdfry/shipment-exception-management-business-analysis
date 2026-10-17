# ADR-003 — Webhooks into a queue table, idempotent on event ID

**Status:** accepted · **Deciders:** architect, team · **Serves:** NFR-01, NFR-03, NFR-04, TA-4

## Context

One event source (the TMS), ±1,600 orders a week, a few thousand events a day. Webhooks can arrive late, twice or out of order (TA-4). Evaluation must happen within 2 minutes (NFR-01) and nothing may be sent twice (NFR-03).

## Options

| Option | For | Against |
|---|---|---|
| Poll the TMS API every few minutes | simple | slow, load on the TMS, misses the 2-minute target at peaks |
| Message broker (Kafka, Service Bus…) | scale, replay | new infrastructure for support to run; oversized for the volume |
| **Webhook → queue table → evaluator** | ordering per order, retries, visible state in one database | must build retry and dead-letter handling ourselves |

## Decision

Accept the webhook within 5 s after checking the signature, store it with its event ID (unique constraint), process in `occurredAt` order per order, retry with back-off, mark failed after 3 attempts and alert. Ignore an absolute ETA older than the last applied change (out of order). A heartbeat alerts when no event arrives for 15 minutes in planning hours.

## Consequences

- Duplicates and stale events are visible in the audit, not silent — tested in the demo (TC-08, TC-34).
- Re-assess when volume grows tenfold or a second event source joins.

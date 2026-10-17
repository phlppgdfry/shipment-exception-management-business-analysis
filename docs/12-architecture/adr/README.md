# Architecture decision records

> **What this is:** the architecture-significant decisions of the exception component, one record each, in the usual ADR format (context, options, decision, consequences). **For:** the IT architect, developers and anyone reviewing the design later. **Back to:** [architecture overview](../README.md).

*Proposed decisions for a fictional organisation, prepared by the analyst with the (fictional) architect and team. Business decisions live in the [decision log](../../03-workshops/decision-log.md); these records cover how the solution is built. Where an ADR follows from a business decision, it says so.*

| ADR | Decision | Status | Follows from |
|---|---|---|---|
| [ADR-001](ADR-001-small-component-next-to-tms.md) | A small exception component next to the TMS, not a TMS customisation or a visibility platform | accepted | D-03 |
| [ADR-002](ADR-002-rules-as-one-portable-module.md) | Business rules in one portable module, specified by executable examples and DMN | accepted | D-02, NFR-09 |
| [ADR-003](ADR-003-webhooks-with-queue-table.md) | TMS webhooks into a queue table, idempotent on event ID — no message broker | accepted | NFR-01, NFR-03, NFR-04 |
| [ADR-004](ADR-004-throttle-and-state-per-order.md) | One active exception and one message throttle **per order** | accepted | DEF-04, ER-12 |
| [ADR-005](ADR-005-browser-demo-on-mock-api.md) | The public demo runs in the browser on a mock API that follows the contract | accepted (demo only) | portfolio constraint |

**How to add one:** copy the structure of ADR-001, give it the next number, link the business decision or requirement it serves, and never edit an accepted ADR's decision — supersede it with a new one.

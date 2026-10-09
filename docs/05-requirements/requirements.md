# Requirements

> **What this is:** business, functional and non-functional requirements for release 1, with IDs that the stories, tests and KPIs refer to. **For:** PO, developers, testers, application support. **Previous:** [exception rules](exception-rules.md) · **Next:** [traceability](traceability.md).

Priorities use MoSCoW **for release 1**. The order inside the backlog is decided with WSJF ([prioritisation](../06-backlog/prioritisation.md)).

## Business requirements

| ID | Requirement | Measured by |
|---|---|---|
| BR-1 | Customers hear about a major or critical exception before their delivery window starts | K1, K2 |
| BR-2 | Customer service spends less time answering "where is my load?" | K3 |
| BR-3 | Fewer delivery slots are missed without a new agreed window | K4, K5 |
| BR-4 | Planners act on exceptions that matter, without extra workload | K6, K7, guardrail |
| BR-5 | Every exception is closed with a reason, so we learn what causes them | reason-code completeness |

## Functional requirements

| ID | Requirement | MoSCoW | Story |
|---|---|---|---|
| FR-01 | Evaluate every status, ETA, window and sailing change on a door-to-door order with the exception rules within 2 minutes of the change | Must | US-01 |
| FR-02 | Store an exception with type, severity, owner, response time, rules applied and history | Must | US-01, US-02 |
| FR-03 | If an order has no delivery window, assume window end = planned ETA + 2 h and flag "window assumed" | Must | US-01 |
| FR-04 | Show open exceptions per owner group, sorted by severity and time left to respond | Must | US-03 |
| FR-05 | Let the planner acknowledge, add a note, re-plan (new window) and resolve with a mandatory reason code | Must | US-04 |
| FR-06 | Send the customer a message in the portal and by e-mail with new ETA, reason category and next step | Must | US-05 |
| FR-07 | Escalate exceptions not acknowledged within the response time to the shift lead | Must | US-03 |
| FR-08 | Hold the customer message for missing status until the planner confirms; then re-evaluate | Must | US-08 |
| FR-09 | When a message cannot be delivered (bounce), flag the exception and create a call task | Should | US-05 |
| FR-10 | Throttle customer messages per order (ER-12) | Must | US-07 |
| FR-11 | Send a "back on schedule" message when a notified exception recovers (ER-13) | Should | US-10 |
| FR-12 | Log timestamps (change received, exception opened, acknowledged, message sent, resolved) and export them per day for the pilot | Must | US-13 |
| FR-13 | Create a call task for customer service for critical exceptions of key accounts (ER-11) | Should | US-11 |
| FR-14 | Switch the feature on per customer (feature toggle) | Must | US-13 |
| FR-15 | Status messages for EDI/API customers | Won't (R2) | US-06 |
| FR-16 | Customs hold handling with "action required" | Won't (R2) | US-09 |
| FR-17 | Customers manage their notification preferences in the portal | Won't (R2) | US-12 |

## Non-functional requirements

| ID | Requirement | How it is verified |
|---|---|---|
| NFR-01 | **Timeliness:** 95% of changes evaluated within 2 min of the TMS event; customer message within 5 min of the exception opening | timestamps (FR-12) during BAT and pilot |
| NFR-02 | **Availability:** during planning hours (05:00–23:00, 7 days) 99.5%; outside these hours events are queued and processed on restart | monitoring |
| NFR-03 | **Idempotency:** a TMS event processed twice never opens a second exception or sends a second message | integration test with replayed events |
| NFR-04 | **Recovery:** no webhook for 15 min during planning hours → alert to application support; component re-reads changed orders via the API | test in BAT environment (switch webhooks off) |
| NFR-05 | **Privacy:** messages never contain driver name, phone number or location; contact data used only for order communication | message template review with the DPO |
| NFR-06 | **Access:** planners see exceptions of their owner group; customer service sees all (read) + call tasks; changes logged with user and time | role test in BAT |
| NFR-07 | **Accessibility and language:** customer messages in English (release 1) with plain-language reason categories; workbench usable on a standard 24" planning screen and a laptop | design review, BAT |
| NFR-08 | **Auditability:** every rule decision stores the rule IDs applied, so support can answer "why did this customer get this message?" | KB article test with support |
| NFR-09 | **Changeability:** thresholds are configuration, changeable by the PO's request without a release; every change is re-tested against the decision examples | test run in CI |

## Data quality rules (checked before the pilot)

| ID | Rule | Baseline | Action |
|---|---|---|---|
| DQ-1 | Door-to-door orders of pilot customers have a delivery window | 72% overall | mandatory field for pilot customers in order intake (TMS configuration) |
| DQ-2 | Pilot customers have at least one valid operational contact e-mail | 4 of 5 | CS checks contacts before go-live ([readiness](../10-go-live/release-readiness.md)) |
| DQ-3 | Reefer units are flagged as such on the order | ±90% | default from unit type |

---

[Documentation map](../00-documentation-map.md) · Next: [Traceability →](traceability.md)

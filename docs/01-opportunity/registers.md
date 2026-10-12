# Assumptions, constraints, risks and dependencies

> **What this is:** the four registers the PO and the BA review at every sprint review. **For:** PO, Scrum Master, sponsor. **Previous:** [KPI tree](kpi-tree.md) · **Next:** [context](../02-discovery/context.md).

*Fictional organisation. Probabilities and impacts are the team's judgement in a 30-minute session, not measurements.*

## Assumptions

An assumption is something we act on as if it were true, with a named way to check it.

| ID | Assumption | If wrong | Check with | Status |
|---|---|---|---|---|
| A-01 | The TMS webhook fires within 2 minutes of a status or ETA change | K2 (time to inform) cannot reach 30 min | TMS supplier, sprint-0 spike | **confirmed** (spike) |
| A-02 | The delivery window is filled in for ≥95% of door-to-door orders | ER-01/ER-02 cannot judge "late" | TMS data, 8 weeks | **wrong: 72%** → EN-2 and FR-03 ([D-06](../03-workshops/decision-log.md#d-06)) |
| A-03 | Pilot customers accept e-mail + portal; no SMS needed | Channel rework | 5 pilot customers | **confirmed** |
| A-04 | Planners can absorb the work list without extra staff | Guardrail breached, rollback of messages | Road planning lead | measured in the pilot |
| A-05 | Proactive messages remove ±35% of WISMO contacts | Business case payback moves from 13.5 to ±31 months | Pilot vs. control group (D-07) | **riskiest** — the stage gate tests it |
| A-06 | Customers read the operational e-mail address on the order | Messages unread; WISMO does not fall | DQ-2 check + BAT-07 | 4 of 5 valid before go-live, corrected |
| A-07 | A cost of ±€140 per missed slot is representative | Benefit line 2 over- or understated | Finance, 3 months of credit notes | accepted for the pilot; re-check at stage gate |

## Constraints

A constraint is not negotiable within this release.

| ID | Constraint | Source | Effect on the design |
|---|---|---|---|
| C-01 | No changes to the TMS beyond configuration | Supplier contract, D-03 | Separate exception component; TMS keeps orders and statuses |
| C-02 | Customer messages may not contain driver name, phone or location | GDPR data minimisation (S-09), DPO | NFR-05; template review in BAT |
| C-03 | Release 1 budget ±€114k (2 sprints + set-up) | Sponsor decision D-07 | Pilot on one route cluster, five customers |
| C-04 | Pilot must be switchable per customer, and off within 5 minutes | Release readiness, rollback | FR-14 feature toggle; shadow mode |
| C-05 | Customer messages in English only in R1 | PO, pilot customers are UK-facing | NFR-07; other languages in R2 backlog |
| C-06 | No customer data in test environments | Information security policy | BAT uses a synthetic set of 40 orders |

## Risks

Score = probability × impact (1–3 each). Reviewed at every sprint review; owner acts, PO decides on trade-offs.

| ID | Risk | P | I | Score | Response | Owner | Trigger to watch |
|---|---|:-:|:-:|:-:|---|---|---|
| R-01 | WISMO reduction lower than 20% → release 2 not funded | 2 | 3 | 6 | **Accept + measure**: pilot with control group; business case shows the pessimistic case | PO | K3 after week 3 of the pilot |
| R-02 | False alarms on missing status destroy customer trust in week 1 | 2 | 3 | 6 | **Mitigate**: hold until the planner confirms (ER-07); K7 in hypercare | Road planning lead | > 1 false alarm per day |
| R-03 | Message storm when a sailing is updated several times | 2 | 3 | 6 | **Mitigate**: throttle per order (ER-12); BAT-08 | PO | K8 > 2.0 |
| R-04 | Webhooks silently stop; nobody notices | 1 | 3 | 3 | **Mitigate**: 15-min heartbeat alert, re-read via API (NFR-04) | Application support | alert fired |
| R-05 | Planners ignore the workbench and keep the Excel sheet | 2 | 2 | 4 | **Mitigate**: workbench designed with the senior planner; key user in BAT; sheet kept 4 weeks only | Road planning lead | sheet still updated in week 3 |
| R-06 | TMS supplier ships an overlapping exception module | 1 | 2 | 2 | **Accept**: rules in one portable module; quarterly review (D-03) | PO + IT architect | supplier roadmap |
| R-07 | Delivery window still missing on pilot orders despite EN-2 (EDI orders) | 2 | 2 | 4 | **Mitigate**: FR-03 default, "window assumed" flag; DQ dashboard | TMS product owner | > 5% assumed windows |
| R-08 | Key users not released by their managers for BAT | 2 | 2 | 4 | **Avoid**: two half-days blocked in week 3 by the Head of CS and planning lead | Scrum Master | calendar not confirmed by week 3 |
| R-09 | Wrong local time in messages (UK vs. continental time) | 2 | 2 | 4 | **Mitigate**: BAT-07 with a pilot customer reading in their own inbox | BA | — (became DEF-01, fixed) |

## Dependencies

| ID | Dependency | On whom | Needed for | Needed by | Status |
|---|---|---|---|---|---|
| DEP-01 | TMS webhooks and API access in test and production | TMS supplier | EN-1 | sprint 1 | delivered (sprint-0 spike) |
| DEP-02 | Delivery window mandatory for pilot customers (configuration) | TMS product team | EN-2, DQ-1 | end of sprint 1 | delivered |
| DEP-03 | E-mail sending domain and portal message API | Notification service team | US-05 | sprint 2 | delivered |
| DEP-04 | Call-task queue in the CS tool (R1: e-mail to the CS queue) | Customer service tooling | US-11 | sprint 2 | workaround agreed; direct link is DEF-06 |
| DEP-05 | DPO review of message templates | Data protection officer | US-05, go/no-go #13 | week 5 | approved with one wording change |
| DEP-06 | Pilot customers' contact data checked | Head of CS | DQ-2, go/no-go #4 | week 5 | done |
| DEP-07 | Consignee opening hours as data | not available today | better ER-04 (BAT-02 note) | release 2 | **open** — no owner yet |
| DEP-08 | eFTI-ready road-leg data (S-07) | Hauliers, authorities | future data exchange | not in R1–R3 | watch only |

## How these registers are used

- **Before refinement:** a story that depends on an open DEP is not *ready* ([DoR](../06-backlog/definition-of-ready-done.md)).
- **At sprint review:** the BA brings the register changes; the PO decides what to do with any risk with score ≥ 6.
- **At go/no-go:** every risk with score ≥ 6 has an evidence line on the [checklist](../10-go-live/release-readiness.md).

---

[Documentation map](../00-documentation-map.md) · Next: [Context →](../02-discovery/context.md)

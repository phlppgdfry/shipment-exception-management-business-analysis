# Sprint plan — release 1

> **What this is:** how release 1 was planned over two sprints, plus BAT and the pilot start. **For:** PO, Scrum Master, team and stakeholders who need dates. **Previous:** [design](../07-design/design.md) · **Next:** [refinement log](refinement-log.md).

Two-week sprints. Velocity ±18–20 points. Release 1 = 36 points ([prioritisation](../06-backlog/prioritisation.md)).

## Timeline

| Week | What | Who | Exit |
|---|---|---|---|
| 0 | Refinement of R1 stories; TMS webhook spike (time-boxed 2 days) | team, BA, PO | stories ready; A-01 confirmed |
| 1–2 | **Sprint 1** — *"A planner sees the right exceptions"* | team | review with planners |
| 3–4 | **Sprint 2** — *"The customer hears it first"* | team | review with CS, AMs and one pilot customer |
| 5 (Mon–Thu) | **Business Acceptance Testing** with key users | BA organises, key users test | [BAT sign-off](../09-acceptance/bat-log.md) |
| 5 (Thu) | **Go/no-go** | PO decides, BA prepares | [readiness checklist](../10-go-live/release-readiness.md) |
| 6 (Mon) | **Pilot go-live** — not on a Friday: hypercare needs the planners' full week | team, support | toggle on for 5 customers |
| 6–7 | Hypercare | team + support | daily check-in, then weekly |
| 6–11 | Pilot measurement | PO, Head of CS | [benefits review](../11-measure/benefits-review.md) |
| 12 | **Stage gate** in the sprint review: fund release 2? | sponsor + PO | decision |

## Sprint 1 — "A planner sees the right exceptions" (19 pts)

| Item | Pts | Notes |
|---|---:|---|
| EN-1 Receive TMS changes reliably | 3 | after the spike |
| EN-2 Window mandatory for pilot customers | 1 | TMS configuration by the TMS product team; we test |
| US-01 Classify a change | 5 | decision examples first (they are the spec) |
| US-02 Owner and response time | 2 | |
| US-03 Workbench (list + escalation) | 5 | escalation is the first thing to drop if needed |
| US-13 Pilot toggle + measurement (toggle + shadow mode) | 3 | export finished in sprint 2 |

## Sprint 2 — "The customer hears it first" (17 pts)

| Item | Pts | Notes |
|---|---:|---|
| US-05 Proactive customer message | 5 | templates reviewed by DPO and two pilot customers in sprint 1 |
| US-07 No message storm | 2 | |
| US-08 Missing status: confirm first | 3 | |
| US-04 Acknowledge, re-plan, resolve | 3 | |
| US-10 Back on schedule | 2 | first to drop |
| US-11 Call task for key accounts | 2 | CS tool integration = a task by e-mail to the CS queue in R1 |

## What the BA does during the sprints

| Moment | BA activity |
|---|---|
| Sprint planning | Explains the sprint goal in business terms; answers questions on acceptance criteria; confirms dependencies are ready |
| Daily stand-up | Joins; picks up domain questions the same day so developers are not blocked |
| During the sprint | Refines the next sprint's stories; prepares BAT scenarios and test data; writes the KB draft with support |
| Sprint review | Prepares the demo script with the developer who demos; invites the stakeholders who asked for the feature ([review notes](sprint-review.md)) |
| Retrospective | Takes part as a team member; brings one improvement on the analysis side ([retro](sprint-review.md#retrospective-sprint-2)) |

---

[Documentation map](../00-documentation-map.md) · Next: [Refinement log →](refinement-log.md)

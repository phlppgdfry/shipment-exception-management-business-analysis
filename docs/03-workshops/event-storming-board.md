# Event storming — the board

> **What this is:** the cleaned-up big-picture board after the session, as text. The visual version is on the [site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/event-storming/). **For:** the team, as the shared picture of the domain. **Previous:** [facilitation plan](event-storming-plan.md) · **Next:** [decision log](decision-log.md).

Sticky colours on the wall: orange = domain event · blue = command · yellow = actor · lilac = policy · red = hotspot · green = read model · pink = external system.

## Timeline

| Phase | Events (orange) | Actors / commands | Systems | Policies (lilac) | Read models (green) | Hotspots (red) |
|---|---|---|---|---|---|---|
| **1. Something changes** | Sailing delay published · Sailing cancelled · Haulier ETA updated · Discharge delayed · Customs hold placed · Status not received | Haulier *updates ETA* · Terminal *publishes discharge time* | Sailing system · Haulier app · TOS · Customs broker | — | — | **H-01** Which time counts as "late"? Planned ETA, window or slot? |
| **2. Is it a problem?** | Delivery window at risk · Delivery moved to next day · No status for 6 h | Planner *checks affected orders* | TMS | Whenever a sailing is delayed, then check all orders on it | Disruption sheet (Excel) | **H-03** Missing status = alarm or usually nothing? |
| **3. Who acts?** | Exception noticed · Haulier re-planned · New window agreed with consignee | Planner *re-plans delivery* · Customs desk *requests documents* | TMS | Whenever customs hold, then customs desk owns it | Orders per planner | **H-05** Customs is "everyone's problem" |
| **4. Who is told?** | Account manager informed · Customer e-mailed · Customer called us · Customer informed | AM *e-mails key account* · CS agent *asks planner* | E-mail · CS tool | Whenever key account, then AM informs (sometimes) | Planner chat | **H-02** Key accounts: everything? **H-04** Planner calls vs. system message |
| **5. It ends** | Delivered in window · Delivered late · Slot missed · Credit note issued | Finance *issues credit note* | ERP | — | — | **H-06** Nobody records why, so nobody learns |

## Hotspots after dot voting

| ID | Hotspot | Votes | Decision owner | Decided |
|---|---|---:|---|---|
| H-01 | What counts as "late"? | 7 | PO with Head of CS and road planning lead | [D-01](decision-log.md#d-01) |
| H-02 | Key accounts: tell everything? | 6 | PO | [D-02](decision-log.md#d-02) |
| H-03 | Missing status: alarm or noise? | 5 | Road planning lead | [D-04](decision-log.md#d-04) |
| H-04 | Planner's own call vs. system message | 4 | PO with road planning lead | [D-08](decision-log.md#d-08) |
| H-06 | No reason recorded on close | 3 | PO | reason code mandatory ([US-04](../06-backlog/user-stories.md)) |
| H-05 | Customs ownership | 2 | Customs desk lead | owner = customs desk ([ER-08](../05-requirements/exception-rules.md)); release 2 |

## Parking lot (solution ideas, not discussed)

Live map of the trailer · SMS to drivers · automatic re-planning · ETA prediction from vessel AIS data · consignee self-service slot booking.

## What changed because of the session

- The word "late" got one meaning (glossary) — before, three teams counted three different things.
- **Severity** appeared as the missing concept: every hotspot became easier once we separated "minor, major, critical".
- The developer recognised that the TMS already sends webhooks for most orange events; the missing piece is the policy layer. That led to [D-03](decision-log.md#d-03).

---

[Documentation map](../00-documentation-map.md) · Next: [Decision log →](decision-log.md)

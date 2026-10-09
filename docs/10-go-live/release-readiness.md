# Release readiness and go/no-go

> **What this is:** the checklist that decides whether release 1 goes live, how the pilot is switched on, how we roll back and how hypercare works. **For:** PO (decides), team, application support, key users. **Previous:** [BAT log](../09-acceptance/bat-log.md) · **Next:** [communication plan](communication-plan.md).

The BA prepares the checklist and collects the evidence; each line has an owner who confirms it; the **PO decides** in a 30-minute go/no-go meeting.

## Go/no-go checklist — Thursday week 5, 14:00

| # | Criterion | Owner | Evidence | Status |
|---|---|---|---|---|
| 1 | BAT signed off; no open blocker or major | PO | [BAT log](../09-acceptance/bat-log.md) | go |
| 2 | Known issues have workaround, owner and date | team lead | DEF-05, DEF-06 → R1.1 week 7 | go |
| 3 | Decision examples and regression tests green on the release build | tester | CI run | go |
| 4 | Pilot customers' contact addresses verified (DQ-2) | Head of CS | 5 of 5 checked, 1 corrected | go |
| 5 | Delivery window mandatory for pilot customers in order intake (EN-2) | TMS product owner | config in production | go |
| 6 | Feature toggle on for **0** customers in production; shadow mode running for 2 days | team | 2 days of shadow logs reviewed with planners | go |
| 7 | Monitoring and alert for "no webhook for 15 min" tested in production | application support | test alert received | go |
| 8 | Rollback rehearsed (toggle off + message templates disabled) | team | rehearsal in acceptance, 4 min | go |
| 9 | KB article published, support briefed (45 min) | application support lead | [support handover](support-handover.md) | go |
| 10 | Planners trained (2 × 30 min per shift) and quick guide available | road planning lead | attendance 16 of 18; 2 on leave get a 1:1 on Monday | **go with action** |
| 11 | Customers informed: pilot letter sent, AMs briefed | Head of CS | [communication plan](communication-plan.md) | go |
| 12 | Hypercare roster agreed for weeks 6–7 | Scrum Master | roster below | go |
| 13 | DPO review of message templates | DPO | approved with one wording change | go |

**Decision: GO** for pilot start Monday week 6, 07:00, toggle on for the five pilot customers one by one (07:00, 07:30, 08:00, 09:00, 10:00) so that a problem shows up with one customer, not five.

## Why not a Friday go-live

Planners work shifts; the weekend shift is thin. If something goes wrong on Friday evening, the people who know the feature are not there. Monday morning gives five working days of hypercare before the first weekend.

## Rollback

| Trigger | Action | Who | Time |
|---|---|---|---|
| Wrong or duplicate messages to customers (any) | toggle off for the affected customer; if not understood within 30 min, all customers | on-call developer, informs PO | < 5 min |
| Webhooks not processed > 30 min | toggle off; planners fall back to the disruption sheet (kept for 4 weeks) | application support | < 5 min |
| Planner workload unmanageable (shift lead's call) | toggle off for messages, keep the workbench | PO | same day |

Rollback never deletes exceptions or logs; they stay for the measurement and the analysis of what went wrong.

## Hypercare (weeks 6–7)

- **Daily 15-minute check-in** at 09:30: PO, BA, a developer, application support, shift lead. Agenda: messages sent yesterday, false alarms, escalations, tickets, K2/K6/K8 from the export.
- **Thresholds that trigger action:** more than 1 false alarm per day; more than 2 messages per exception on average; any escalation not picked up by the shift lead.
- **Second line:** the team (not the general support queue) handles tickets about the feature for two weeks.
- **Exit hypercare** when two consecutive weeks are within thresholds and R1.1 (DEF-05, DEF-06) is live.

---

[Documentation map](../00-documentation-map.md) · Next: [Communication plan →](communication-plan.md)

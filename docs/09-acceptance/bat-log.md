# BAT log and acceptance decision

> **What this is:** what happened in Business Acceptance Testing, the findings, how each was handled, and the sign-off. **For:** PO (go/no-go), team, application support. **Previous:** [BAT plan](bat-plan.md) · **Next:** [release readiness](../10-go-live/release-readiness.md).

*Simulated BAT for a fictional organisation; it shows the format and the decisions, not real results. Spreadsheet version: [`data/ba-workbook.xlsx`](../../data/ba-workbook.xlsx) (sheet "BAT log").*

## Execution

| ID | Scenario | Run 1 | Finding | Retest | Final |
|---|---|---|---|---|---|
| BAT-01 | Sailing with 20 orders delayed | pass | — | — | **pass** |
| BAT-02 | 8 situations from last month | pass | planner disagreed on 1 of 8 (see note) | — | **pass** |
| BAT-03 | Untouched critical escalates | pass | DEF-05 | — | **pass with known issue** |
| BAT-04 | Acknowledge, new window, resolve | fail | DEF-03 | pass | **pass** |
| BAT-05 | No status for 7 h | pass | — | — | **pass** |
| BAT-06 | Critical for key account | pass | DEF-06 | — | **pass with known issue** |
| BAT-07 | Customer reads the message | fail | DEF-01 | pass | **pass** |
| BAT-08 | Three sailing updates in 10 min | fail | **DEF-04** | pass | **pass** |
| BAT-09 | Order without a window | fail | DEF-02 | pass | **pass** |
| BAT-10 | Notified delay recovers | pass | — | — | **pass** |
| BAT-11 | Pilot export, shadow mode | pass | — | — | **pass** |
| BAT-12 | Bounced address | pass | — | — | **pass** |

**Note on BAT-02:** for a reefer 50 minutes late on a Friday afternoon the planner would have called it critical ("the consignee closes at 16:00 on Fridays"). The rules said major (ER-04: minor → major). Discussed with the PO: not a defect — the rule needs the consignee's opening hours, which we do not have. Added to the R2 backlog as "consignee closing time"; the planner can call the customer meanwhile (D-08).

## Findings

| ID | Severity | Finding | Cause | Decision | Status |
|---|---|---|---|---|---|
| DEF-01 | Major | E-mail shows the window in UTC ("06:00–08:00 UTC") while the customer expects local UK time | template used stored time instead of local time (Q10) | fix before go-live | fixed, retested Wed |
| DEF-02 | Major | Order without window: exception opens but "window assumed" is not shown in the list | flag stored, not displayed | fix before go-live | fixed, retested Wed |
| DEF-03 | Minor | Reason "other" accepted without a note | validation missing | fix before go-live (cheap) | fixed, retested Wed |
| **DEF-04** | **Major** | Pilot customer received **two** e-mails within 10 minutes for one order | throttling worked per **exception**; the sailing delay and the resulting road re-plan opened two exceptions on the same order. The refinement answer (Q6) was wrong | fix before go-live: throttle per order; new criterion in US-07; ER-12 wording updated | fixed, retested Thu 09:00 |
| DEF-05 | Minor | Workbench does not refresh by itself; a new exception appears only after reload | polling not in R1 scope | **known issue**: refresh button + shift lead escalation still works; auto-refresh in R1.1 (week 7) | open, owner: team |
| DEF-06 | Minor | Call-task e-mail to the CS queue has no direct link to the order | link template | **known issue**: agents search by order reference; fix in R1.1 | open, owner: team |

## Sign-off — Thursday week 5, 11:30

| | |
|---|---|
| Decision | **Accepted with two known issues** (DEF-05, DEF-06) |
| Signed by | senior road planner (key user planning) · senior CS agent (key user customer service) · Product Owner |
| Conditions | DEF-05 and DEF-06 fixed in R1.1, week 7; known issues in the KB article and the planner quick guide |
| Not signed by | pilot customer — customers do not sign BAT; their feedback is in BAT-07, BAT-08, BAT-10 |

## What BAT taught us

- Three of the four majors were found by **people reading real messages in their own context** (customer inbox, planner list). The team's tests had passed: the stories were satisfied, the need was not.
- DEF-04 came from an analysis decision, not a coding error. I answered a customer-facing question myself in refinement; it is now a retrospective action ([retro](../08-delivery/sprint-review.md#retrospective-sprint-2)).

---

[Documentation map](../00-documentation-map.md) · Next: [Release readiness →](../10-go-live/release-readiness.md)

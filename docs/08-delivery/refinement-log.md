# Refinement log

> **What this is:** the questions developers and the tester asked in refinement, and what we did with each answer. **For:** the team, and anyone who wants to know why a criterion exists. **Previous:** [sprint plan](sprint-plan.md) · **Next:** [sprint review and retrospective](sprint-review.md).

Rule of the team: an answer that changes behaviour becomes an acceptance criterion or a rule, the same day. Answers in chat do not count.

| # | Session | Question (who) | Answer (who decided) | Became |
|---|---|---|---|---|
| Q1 | R0 | "Late compared to what? The order has planned ETA, window start and window end." (dev) | Window **end** (PO, D-01) | ER-01, AC-01.1–01.2 |
| Q2 | R0 | "Exactly 120 minutes: major or minor?" (tester) | Major; boundaries belong to the higher level (PO) | AC-01.5–01.8 boundary pairs |
| Q3 | R0 | "What if a reefer is in customs?" (dev) | Customs owns it; time-critical still raises severity (customs desk lead) | ER-06 + ER-04, AC-09.2 |
| Q4 | R0 | "Does the webhook carry the window, or do we read the order?" (dev) | Read the order via API on each event; the webhook payload is minimal (spike) | sequence diagram step 4; NFR-03 |
| Q5 | R1 | "If the ETA moves three times in an hour, do we re-evaluate each time?" (dev) | Yes; throttling handles the customer side (PO) | ER-12, AC-07.x |
| Q6 | R1 | "Is throttling per exception or per order?" (tester) | *Per exception* in the first answer — **wrong**, found in BAT (DEF-04); now per order | US-07 extra criterion |
| Q7 | R1 | "Do we notify customers outside the pilot?" (dev) | No, but log everything: shadow mode (BA proposal, PO agreed) | AC-13.1 |
| Q8 | R1 | "What does the customer see if we have no reason category?" (dev) | "Operational delay — we are investigating"; never empty (PO with commercial) | message templates |
| Q9 | R1 | "Can a planner unhold a missing-status exception without contacting the haulier?" (tester) | No: two explicit choices, confirm on time or confirm delay (road planning lead) | US-08 criteria |
| Q10 | R2 | "Which time zone for the window? UK deliveries, Belgian planners." (dev) | Store in UTC, show in the consignee's local time in messages and in planner's local time in the workbench (PO) | NFR-07 note; template shows local time with zone |
| Q11 | R2 | "Key account call task — in our tool or theirs?" (dev) | R1: e-mail to the CS queue (exists); CS tool integration later (PO) | US-11 note |
| Q12 | R2 | "What happens when the PO changes a threshold?" (dev) | Configuration; examples updated by the BA; CI shows the impact (PO) | NFR-09 |

## Story splits made in refinement

| Original | Split into | Why |
|---|---|---|
| "Planner manages exceptions" (13 pts) | US-03 workbench · US-04 acknowledge/re-plan/resolve · US-08 missing status | Too big for one sprint; missing status had different rules and a different stakeholder |
| "Notify customers" (13 pts) | US-05 message · US-07 throttling · US-10 recovery · US-06 EDI (R2) | Throttling and recovery can be tested separately; EDI depends on each customer's message standard |

## A refinement that went wrong

In R1 I answered Q6 myself ("per exception") because it seemed obvious. It was not: one order can have two exceptions (sailing, then road). BAT found it (DEF-04). Since then, questions that change customer-facing behaviour go to the PO, even when the answer looks obvious.

---

[Documentation map](../00-documentation-map.md) · Next: [Sprint review and retrospective →](sprint-review.md)

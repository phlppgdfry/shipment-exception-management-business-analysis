# Prioritisation with the Product Owner

> **What this is:** how the PO and I ordered the backlog, the scores, and the trade-offs she made. **For:** PO, team and stakeholders who ask "why is my item not in release 1?". **Previous:** [user stories](user-stories.md) · **Next:** [definition of ready and done](definition-of-ready-done.md).

## Method

**WSJF** (weighted shortest job first): cost of delay ÷ job size. Cost of delay = business value + time criticality + risk reduction / opportunity enablement, each on a relative Fibonacci scale (1, 2, 3, 5, 8, 13). I prepared a first scoring; the PO, the Head of CS and the road planning lead challenged it in a 60-minute session; the PO decided. Job size came from the team's estimates in refinement.

Why WSJF and not MoSCoW alone: MoSCoW tells us what is in the release; it does not order the work inside it, and almost everything was called "Must" in the first round. WSJF made the small, high-value items (EN-2, US-07) visible.

## Scores

| Item | Business value | Time criticality | Risk reduction / enablement | Cost of delay | Size | **WSJF** | Release |
|---|---:|---:|---:|---:|---:|---:|---|
| EN-2 Window mandatory for pilot customers | 2 | 5 | 8 | 15 | 1 | **15.0** | R1 |
| US-07 No message storm | 5 | 5 | 8 | 18 | 2 | **9.0** | R1 |
| US-13 Pilot toggle + measurement | 3 | 8 | 13 | 24 | 3 | **8.0** | R1 |
| EN-1 Receive TMS changes reliably | 1 | 8 | 13 | 22 | 3 | **7.3** | R1 |
| US-02 Owner and response time | 5 | 3 | 5 | 13 | 2 | **6.5** | R1 |
| US-05 Proactive customer message | 13 | 8 | 8 | 29 | 5 | **5.8** | R1 |
| US-04 Acknowledge, re-plan, resolve | 5 | 3 | 8 | 16 | 3 | **5.3** | R1 |
| US-08 Missing status: confirm first | 5 | 3 | 8 | 16 | 3 | **5.3** | R1 |
| US-01 Classify a change | 8 | 5 | 13 | 26 | 5 | **5.2** | R1 |
| US-11 Call task for key accounts | 5 | 3 | 2 | 10 | 2 | **5.0** | R1 |
| US-10 Back on schedule | 3 | 2 | 3 | 8 | 2 | **4.0** | R1 |
| US-03 Workbench | 8 | 5 | 5 | 18 | 5 | **3.6** | R1 |
| US-09 Customs hold | 5 | 2 | 3 | 10 | 5 | **2.0** | R2 |
| US-06 EDI/API status messages | 8 | 3 | 3 | 14 | 8 | **1.8** | R2 |
| US-12 Preferences in the portal | 3 | 1 | 2 | 6 | 5 | **1.2** | R2 |
| US-14 Consignee notifications | 8 | 1 | 2 | 11 | 13 | **0.8** | R3 |

*Scores are relative judgements made in the session, not measurements. Spreadsheet with formulas: [`data/ba-workbook.xlsx`](../../data/ba-workbook.xlsx) (sheet "Backlog WSJF"), CSV: [`data/backlog.csv`](../../data/backlog.csv).*

Release 1 = 36 points; the team's average velocity is ±18–20 points per sprint → **two sprints**, as in the [business case](../01-opportunity/options-and-business-case.md).

## WSJF ranks; dependencies sequence

The score says what is worth most per point. It does not say what can be built first: US-07 (9.0) needs US-01 and US-05 to exist. The [sprint plan](../08-delivery/sprint-plan.md) therefore builds the thin path first (EN-1 → US-01 → US-02 → US-03) and uses the ranking to decide **what to drop** if the sprint runs short: the bottom of the R1 list (US-03's escalation part, US-10) goes first.

## Trade-offs the PO made

| Trade-off | Decision | Why |
|---|---|---|
| US-06 EDI status (asked by the largest forwarder) vs. US-08 missing status | US-08 in R1, US-06 in R2 | False alarms in week 1 would kill trust with all pilot customers; the forwarder gets portal + e-mail meanwhile and agreed |
| US-11 key-account call (low score) in R1? | Yes | Cheap (2 pts) and it wins over the account managers, whose support the pilot needs |
| US-03 workbench scores lowest in R1 | Kept, scope cut: list + escalation; filters and bulk actions to R2 | Without a list, planners keep the Excel sheet |
| "Live map" from the Head of CS | Not on the backlog | Discovery showed customers need the window consequence, not the position; recorded in the parking lot |

## How I prepare a prioritisation session

1. Every item has a one-line "so that" and a size before the session — no scoring of unrefined items.
2. I bring the scores as a **proposal** with my reasoning per cell, so the session is about disagreement, not about filling in a table.
3. Business value is scored by the business, time criticality by whoever knows the deadlines, size by the team — never by me alone.
4. The PO decides; the decision and the "why" go into the decision log or this page the same day.

---

[Documentation map](../00-documentation-map.md) · Next: [Definition of ready and done →](definition-of-ready-done.md)

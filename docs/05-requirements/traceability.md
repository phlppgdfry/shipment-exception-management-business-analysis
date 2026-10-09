# Traceability

> **What this is:** one line from each pain point to the requirement, rule, story, test and KPI that address it. **For:** PO and testers (nothing built without a reason, nothing promised without a test). **Previous:** [requirements](requirements.md) · **Next:** [story map](../06-backlog/story-map.md).

The spreadsheet version is in [`data/ba-workbook.xlsx`](../../data/ba-workbook.xlsx) (sheet "Traceability").

## One pain point, followed all the way

> **P5 — "The customer finds out at the delivery slot and calls."**
>
> → root cause: no rule for what matters and no owner for telling the customer ([problem statement](../01-opportunity/problem-statement.md))
> → **BR-1** customers hear about major/critical exceptions before the window starts
> → **FR-06** proactive message, **FR-10** throttling
> → **ER-02, ER-10, ER-12** severity, who is told, at most one message per 2 h
> → **US-05** proactive message, **US-07** no message storm
> → **AC-01.6** (120 min late → notified), **AC-07.1** (same severity within 2 h → suppressed), BAT-07, BAT-08
> → **K1** proactive rate 22% → ≥ 90%, **K3** WISMO −35%, **K8** ≤ 2 messages per exception

## Matrix

| Pain | BR | FR / NFR | Rules | Story | Tests | KPI |
|---|---|---|---|---|---|---|
| P1 ETAs not updated, nobody evaluates | BR-1 | FR-01, FR-03, NFR-01 | ER-01 | US-01 | AC-01.1–01.2, BAT-01 | K2 |
| P2 noticed by chance | BR-4 | FR-02, FR-04, FR-07 | ER-02–ER-05, ER-08, ER-09 | US-02, US-03 | AC-01.3–01.12, AC-02.1, BAT-02, BAT-03 | K6 |
| P3 Excel lookup | BR-4 | FR-04 | ER-08 | US-03 | BAT-03 | guardrail workload |
| P4 only key accounts whose AM knows | BR-1 | FR-06, FR-13 | ER-10, ER-11 | US-05, US-11 | AC-11.1–11.3, BAT-06 | K1 |
| P5 customer finds out at the slot | BR-1, BR-2 | FR-06, FR-10, FR-11 | ER-10, ER-12, ER-13 | US-05, US-07, US-10 | AC-07.1–07.5, AC-10.1–10.2, BAT-07, BAT-08, BAT-10 | K1, K3, K8 |
| (new) false alarms on missing status | BR-4 | FR-08 | ER-07 | US-08 | AC-08.1–08.4, BAT-05 | K7 |
| P6 nothing recorded | BR-5 | FR-05, FR-12 | — | US-04, US-13 | BAT-04, BAT-11 | reason completeness |
| missed slots | BR-3 | FR-05 | ER-03 | US-04 | AC-01.9, BAT-04 | K4, K5 |

Coverage check: every Must requirement has at least one story and one test; every rule ER-01 to ER-13 is exercised by at least one decision example (the CI run fails otherwise).

---

[Documentation map](../00-documentation-map.md) · Next: [Story map →](../06-backlog/story-map.md)

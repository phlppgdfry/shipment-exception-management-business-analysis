# Options and business case

> **What this is:** the options I put in front of the Product Owner and sponsor, how I compared them, and the business case for the recommended option. **For:** the PO, the sponsor (COO) and finance. **Previous:** [problem statement](problem-statement.md) · **Next:** [KPI tree](kpi-tree.md).

*All figures are illustrative assumptions — not real company data. The calculation is in [`data/ba-workbook.xlsx`](../../data/ba-workbook.xlsx) (sheet "Business case") and as plain text in [`data/business-case.csv`](../../data/business-case.csv).*

## Options

| | Option | What it means | Upfront | Yearly | Time to value |
|---|---|---|---:|---:|---|
| O1 | **Do nothing, add capacity** | One extra customer-service agent for the WISMO peak | — | €55k | immediate |
| O2 | **Switch on standard TMS e-mails** | The TMS can e-mail the customer on every status change | €10k | €4k | 2 weeks |
| O3 | **Exception management** (recommended) | Rules decide what is an exception, who owns it and who is told; planners work from one list; customers get one clear message | €195k | €34k | pilot in ±6 weeks |
| O4 | **External visibility platform** | Subscribe to a real-time tracking platform and integrate it with the TMS | €80k | €150–250k | 6–9 months |

## How they compare

Scored 1 (poor) to 5 (good) with the PO, the Head of Customer Service and the road planning lead in one session. Weights agreed before scoring.

| Criterion | Weight | O1 | O2 | O3 | O4 |
|---|---:|---:|---:|---:|---:|
| Fixes the root cause (rules, ownership) | 30% | 1 | 2 | 5 | 3 |
| Customer experience | 25% | 2 | 2 | 4 | 5 |
| Cost over 3 years | 20% | 3 | 5 | 3 | 1 |
| Delivery risk / dependency | 15% | 5 | 4 | 3 | 2 |
| Fit with the new TMS | 10% | 3 | 4 | 4 | 2 |
| **Weighted score** | | **2.45** | **3.10** | **3.95** | **2.85** |

**Why not O2?** I tested it on paper with one week of real status events for 20 orders: ±9 status changes per order, of which on average 0.3 mattered to the customer. Two pilot customers said they would create an e-mail rule to delete them. More messages is not better information.

**Why not O4?** Strong tracking, but it duplicates the TMS's status data and does not solve "who owns the exception". Worth re-assessing for consignee tracking (release 3).

## Business case for O3

| Benefits per year | Calculation | Value |
|---|---|---:|
| Customer-service time freed | 1,250 WISMO contacts × 6 min ÷ 60 × **35% fewer** × €42/h × 50 weeks | €91,875 |
| Fewer missed delivery slots | 55 per week × **30% fewer** × €140 × 50 weeks | €115,500 |
| **Total benefits** | | **€207,375** |

| Costs | Calculation | Value |
|---|---|---:|
| Delivery team | 4 sprints × €38k (one Scrum team of 8 for 2 weeks) | €152,000 |
| TMS supplier: webhook/API set-up and configuration | quote | €25,000 |
| Notification service set-up (e-mail templates, portal messages) | estimate | €8,000 |
| BAT, training, pilot support | 2 × €5k | €10,000 |
| **One-off** | | **€195,000** |
| TMS API module licence + 0.2 FTE application support | yearly | **€34,000** |

**Net benefit per year:** €207k − €34k = **€173k**. **Payback:** ±13.5 months.

*The time freed in customer service is capacity, not headcount: the Head of CS wants to use it for proactive key-account calls and onboarding portal users. I wrote it in euros so it can be compared, not because anyone will be let go.*

## Sensitivity — the riskiest assumption

The case stands or falls with **how many WISMO contacts disappear when customers are told first**. Nobody knows that number yet.

| Scenario | WISMO reduction | Missed-slot reduction | Benefits / year | Payback |
|---|---:|---:|---:|---:|
| Pessimistic | 20% | 15% | €110k | ±31 months |
| **Expected** | **35%** | **30%** | **€207k** | **±13.5 months** |
| Optimistic | 50% | 40% | €285k | ±9 months |

## Recommendation: buy the information first

Fund **release 1 as a pilot** (2 sprints + set-up, ±€114k) on one route cluster with five customers. Measure WISMO contacts and missed slots for the pilot customers against a comparable control group for 6 weeks. Fund release 2 (±€81k) only if the WISMO reduction is at least 20% — the pessimistic scenario still pays back within 3 years.

**Decision (sponsor + PO):** approved as recommended, with the go/no-go for release 2 on the agenda of the sprint review after week 6 of the pilot. See [D-07 in the decision log](../03-workshops/decision-log.md) and the [benefits review](../11-measure/benefits-review.md).

---

[Documentation map](../00-documentation-map.md) · Next: [KPI tree →](kpi-tree.md)

# Exception rules

> **What this is:** the business rules that decide whether a change is an exception, how severe it is, who owns it and whether the customer is told. **For:** PO (owns the parameters), developers, testers, support. **Previous:** [UML models](../04-process/uml.md) · **Next:** [requirements](requirements.md).

These rules are the heart of the release. They are deliberately **one module**: the [prototype](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/), the [rule explorer](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/rules/) and the [acceptance tests](../../tests/exception-rules.test.mjs) all use [`exception-rules.mjs`](../../site/assets/exception-rules.mjs). The 30 decision examples in [`exception-decision.feature`](../06-backlog/features/exception-decision.feature) run in CI.

*Parameters are illustrative assumptions agreed with the Product Owner — not real company data.*

## Inputs

| Input | Meaning | Source |
|---|---|---|
| cause | SAILING_DELAY, SAILING_CANCELLED, ROAD_DELAY, TERMINAL_DELAY, CUSTOMS_HOLD, STATUS_MISSING | TMS event type + sailing system |
| minutes late | expected delivery minus the **end** of the agreed delivery window (≤ 0 = inside) | TMS ETA and order window |
| next day | delivery moves to a later calendar day | TMS ETA |
| time-critical | reefer, or flagged time-critical on the order | TMS order |
| key account | customer has a commercial agreement | TMS customer profile |
| wants every update | customer opted in to minor changes too | customer profile (release 1: set by CS on request) |
| status confirmed | for missing status: the planner confirmed the situation with the haulier | workbench action |
| last notified severity, minutes since | what the customer was last told about this **order**, and when | exception component |

## Rules

| ID | Rule | Owner | Example |
|---|---|---|---|
| **ER-01** | An exception exists only when expected delivery is **after the end of the agreed window**, or the delivery moves to another day, or the cause is a cancellation, customs hold or missing status. | PO (D-01) | Window ends 10:00, ETA 09:40 → no exception, even if the plan was 07:00. |
| **ER-02** | Severity by lateness after the window: 1–119 min **minor**, 120–359 min **major**, ≥ 360 min **critical**. | PO (D-02) | 120 min → major; 359 → major; 360 → critical. |
| **ER-03** | Delivery moves to another day → **critical** (the slot is lost). | PO (D-02) | 22:00 window end, ETA 01:00 → critical, not major. |
| **ER-04** | Reefer or time-critical cargo goes **one level up** (max. critical). | PO with road planning lead | Reefer 60 min late → major. |
| **ER-05** | A cancelled sailing is always **critical**. | PO | — |
| **ER-06** | A customs hold is **major** (critical if time-critical), owned by the **customs desk**, and the customer is asked to act (**action required**, never throttled). *Release 2.* | Customs desk lead | Missing commodity code. |
| **ER-07** | Missing status is **major**, owned by road planning; the customer message is **held** until the planner confirms. Confirmed late → treated as a road delay; confirmed on time → closed silently. | Road planning lead (D-04) | No status for 7 h on a time-critical trailer → critical, held. |
| **ER-08** | Owner by cause: sailing, road and missing status → **road planning**; terminal → **terminal operations**; customs → **customs desk**. | PO | — |
| **ER-09** | Response time: critical **30 min**, major **2 h**, minor: monitored, no response time. Not acknowledged in time → escalated to the shift lead. | Road planning lead | — |
| **ER-10** | Major and critical are **notified** proactively; minor only if the customer wants every update. | PO (D-02) | 60 min late, standard customer → no message. |
| **ER-11** | Critical for a **key account** also creates a **call task** for customer service. | PO with account management | — |
| **ER-12** | **Throttling:** at most one message per **order** every 2 h, unless the severity is **higher** than the last message. | PO (D-02, refined after [DEF-04](../09-acceptance/bat-log.md)) | Told "major" 30 min ago, still major → no message; now critical → message. |
| **ER-13** | **Recovery:** back inside the window → exception closes as recovered; the customer gets a "back on schedule" message only if they were told before. | PO | Told "major", new window agreed → recovery message. |
| ER-14 | The message channel follows the customer profile: portal + e-mail in release 1; EDI/API status in release 2. Messages contain new ETA and reason category, never driver data (D-05). | PO, DPO | — |

## Decision table

Rows are evaluated top to bottom; the first matching row sets the severity. Row order is a design decision: the window check comes first, so that a delayed sailing does not alarm customers whose delivery is still on time.

| # | Cause | Minutes late | Next day | Severity | Then |
|---|---|---|---|---|---|
| 1 | not cancellation / customs / missing status | ≤ 0 | no | — (no exception) | recovery message if told before (ER-13) |
| 2 | SAILING_CANCELLED | any | any | critical | — |
| 3 | CUSTOMS_HOLD | any | any | major | action required, never throttled |
| 4 | STATUS_MISSING (unconfirmed) | any | any | major | hold |
| 5 | any other | any | yes | critical | — |
| 6 | any other | ≥ 360 | no | critical | — |
| 7 | any other | 120–359 | no | major | — |
| 8 | any other | 1–119 | no | minor | — |
| then | time-critical | | | **+1 level** (max. critical) | ER-04 |
| then | notification | | | minor → only if opted in; major/critical → notify; critical + key account → notify and call; throttle (ER-12) | |

## Why these thresholds

- **2 hours** for major: below that, pilot customers said they could absorb the delay without re-planning their dock ("we always plan an hour of slack").
- **6 hours** for critical: beyond that, a delivery usually moves out of the consignee's working shift.
- **One level up for reefer and time-critical cargo**: the cost of a late reefer is not linear (temperature, product shelf life).
- These are parameters, not code changes. When the PO changes one, the analyst updates the examples and the test run shows which examples change meaning. That conversation happened once already: the first proposal had 1 h for major; the planning lead showed that would have produced ±60% more exceptions without any customer asking for them.

## Rules that were considered and rejected

| Proposal | Why rejected |
|---|---|
| Notify on every change to key accounts | Account managers' real need was "nothing serious unannounced" (D-02) |
| Severity by delay against the planned ETA | Most ETA changes do not affect the promise (D-01) |
| Auto-escalate every critical exception to the account manager | AMs did not want to become a second planner; the call task goes to CS |

---

[Documentation map](../00-documentation-map.md) · Next: [Requirements →](requirements.md)

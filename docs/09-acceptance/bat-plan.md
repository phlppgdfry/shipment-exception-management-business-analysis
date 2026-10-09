# Business Acceptance Testing — plan

> **What this is:** how the business tests release 1 before the go/no-go: who, what, when, and what "accepted" means. **For:** key users, PO, tester, application support. **Previous:** [sprint review](../08-delivery/sprint-review.md) · **Next:** [BAT log and decision](bat-log.md).

## Why BAT and not only the team's testing

The tester checks that the software does what the stories say. BAT checks that **what the stories say is what the business needs**, with the people who will live with it, in situations they recognise. The decision examples already ran in CI; BAT tests the flow, the messages and the work, not the arithmetic.

## Scope

In: everything in release 1 ([story map](../06-backlog/story-map.md)). Out: R2 items, performance (covered by the team's load test against NFR-01), TMS standard functions.

## Key users

| Key user | Represents | Tests mainly |
|---|---|---|
| Senior road planner (UK delivery) | planners | workbench, acknowledge, re-plan, missing status |
| Road planning shift lead | escalation | escalation, assignment |
| 2 customer-service agents | CS | call tasks, bounce, what customers will ask |
| Key account manager | account management | key-account flow |
| Pilot customer A (food producer) | customers | messages in **their own inbox** and portal account |
| Application support analyst | support | observes, uses the KB draft to answer "why did this happen?" |

*Choosing the senior planner who said "I already call my customers myself" was deliberate: if she accepts it, the planners will.*

## Schedule (week 5, Monday–Thursday)

| Day | Morning | Afternoon |
|---|---|---|
| Mon | Kick-off (30 min): goal, how to log findings, severity definitions · BAT-01 to BAT-04 | BAT-05 to BAT-07 |
| Tue | BAT-08 to BAT-12 | Triage with PO and team: fix, accept or defer |
| Wed | Fixes deployed; retests | Free testing: "try to break it with a bad day you remember" |
| Thu | Final retests (09:00–11:00) | **Sign-off (11:30)** → go/no-go (14:00) |

## Scenarios

Written from the [acceptance criteria](../06-backlog/user-stories.md) and the [TO-BE exceptions table](../04-process/to-be.md#exceptions-to-the-happy-path), in the key users' language. Test data: a copy of last month's real orders for the pilot customers is **not** used (customer data in a test environment) — instead the team built a test set of 40 orders that mirrors the pilot customers' mix.

| ID | Scenario | Key user | Stories | Expected result |
|---|---|---|---|---|
| BAT-01 | A sailing with 20 orders is delayed 6 h | planner | US-01, US-03 | Only orders outside their window appear |
| BAT-02 | Walk through 8 situations from your own last month (reefer, next day, cancellation…) | planner, CS | US-01, US-02 | Severity and owner match what you would have decided — or the rule is wrong |
| BAT-03 | Leave a critical exception untouched for 30 min | shift lead | US-03 | Escalated; shift lead can assign |
| BAT-04 | Acknowledge, agree a new window, resolve | planner | US-04 | Reason mandatory; customer gets recovery message if told before |
| BAT-05 | Haulier without app, no status for 7 h | planner | US-08 | Held, no customer message; both confirmation paths work |
| BAT-06 | Critical delay for a key account | AM, CS | US-11 | Message + call task with the message attached |
| BAT-07 | Read the message as the customer | pilot customer | US-05 | Clear, correct local time, no driver data; arrives within 5 min |
| BAT-08 | The sailing is updated three times in 10 minutes | planner, pilot customer | US-07 | One message, unless it got worse |
| BAT-09 | An order without a delivery window | planner | US-01 (FR-03) | "Window assumed" visible |
| BAT-10 | A notified delay recovers | pilot customer | US-10 | "Back on schedule" message |
| BAT-11 | Export the day's pilot measurements; check a non-pilot customer | PO | US-13 | Export complete; shadow mode sends nothing |
| BAT-12 | Contact address bounces | CS | US-05 (FR-09) | "Message failed" + call task |

## Finding severity

| Severity | Meaning | Go-live impact |
|---|---|---|
| Blocker | Wrong message to a customer, data leak, or the planner cannot work | no go-live |
| Major | Wrong result, workaround is unreasonable | fix before go-live |
| Minor | Wrong or awkward, reasonable workaround exists | may go live as a known issue, with a date |
| Cosmetic | Text, layout | backlog |

## Entry and exit criteria

**Entry:** all R1 stories meet the DoD; decision examples green; test set loaded; key users have 2 half-days blocked by their managers; KB draft available.
**Exit (sign-off):** all scenarios executed; no open blocker or major; known issues have a workaround, an owner and a date; key users from planning **and** customer service sign.

---

[Documentation map](../00-documentation-map.md) · Next: [BAT log and decision →](bat-log.md)

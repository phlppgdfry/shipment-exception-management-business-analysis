# Release note — Exception management, release 1 (pilot)

> **What this is:** the functional release note for internal users and support. **For:** planners, customer service, account managers, application support. **Previous:** [support handover](support-handover.md) · **Next:** [benefits review](../11-measure/benefits-review.md).

**Release:** 1.0 (pilot) · **Live:** Monday week 6, 07:00 · **Customers:** 5 pilot customers on BE-UK East and BE-UK South · **Product Owner:** Customer Visibility

## New

- **Exceptions.** Every change on a door-to-door order is checked against the agreed delivery window. Only changes that put the window at risk become exceptions, with a severity (minor, major, critical), an owner and a response time.
- **Planner workbench.** One list of open exceptions per team, most urgent first. Acknowledge, re-plan, resolve with a reason. Overdue critical exceptions go to the shift lead.
- **Proactive customer messages.** Pilot customers get an e-mail and a portal message for major and critical exceptions, with the new ETA, the reason and the next step. At most one message per order every 2 hours unless it gets worse; a "back on schedule" message when it is solved.
- **Missing status.** Exceptions for missing haulier status are held until the planner confirms with the haulier — no false alarms to customers.
- **Key accounts.** Critical exceptions for key accounts create a call task for customer service.
- **Measurement.** Daily export for the pilot; customers outside the pilot are evaluated in shadow mode (no messages).

## Changed

- Delivery window is mandatory in order intake for pilot customers.

## Known issues

| ID | Issue | Workaround | Fixed in |
|---|---|---|---|
| DEF-05 | Workbench does not refresh automatically | refresh button | 1.1, week 7 |
| DEF-06 | Call-task e-mail has no link to the order | search by order reference | 1.1, week 7 |

## Not in this release

EDI/API status messages, customs holds, notification preferences in the portal (release 2, subject to the stage gate in week 12). Consignee messages (release 3, subject to DPO assessment).

## More information

[KB article and quick guide](support-handover.md) · [Exception rules](../05-requirements/exception-rules.md)

---

[Documentation map](../00-documentation-map.md) · Next: [Benefits review →](../11-measure/benefits-review.md)

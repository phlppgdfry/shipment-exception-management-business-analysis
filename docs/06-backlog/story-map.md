# Story map and release slices

> **What this is:** the backlog as a story map along the user's journey, cut into releases. **For:** PO, team and stakeholders, to see what comes when and why. **Previous:** [traceability](../05-requirements/traceability.md) · **Next:** [user stories](user-stories.md).

The backbone follows the TO-BE process from left to right. Each column holds stories, most valuable at the top. The horizontal cuts are the releases agreed with the Product Owner ([prioritisation](prioritisation.md)).

| | **Detect** | **Decide** | **Work it** | **Tell the customer** | **Learn** |
|---|---|---|---|---|---|
| **Release 1 — pilot** (2 sprints, 5 customers) | EN-1 Receive TMS webhooks reliably · EN-2 Window mandatory for pilot customers · US-01 Classify a change | US-02 Owner and response time | US-03 Workbench + escalation · US-04 Acknowledge, re-plan, resolve · US-08 Hold missing status until confirmed | US-05 Proactive message (portal + e-mail) · US-07 No message storm · US-10 Back on schedule · US-11 Call task for key accounts | US-13 Pilot toggle + measurement export |
| **Release 2 — all customers** (after the stage gate) | | US-09 Customs hold, action required | haulier app onboarding (from D-04) | US-06 EDI/API status messages · US-12 Notification preferences in the portal | benefits dashboard |
| **Release 3 — later** | ETA prediction (to assess) | | automatic re-planning suggestions (to assess) | US-14 Consignee notifications (after DPO assessment) | |

## How the cut was made

1. **Walking skeleton first.** Release 1 has one thin path through every column: without "tell the customer" there is no value; without "learn" there is no stage gate.
2. **Pilot-sized, not feature-complete.** Customs (US-09) is valuable but involves the customs desk and a different message type; it waits for release 2.
3. **Measure before scaling.** US-13 ranks high although no customer sees it: without it, the sponsor's go/no-go for release 2 ([D-07](../03-workshops/decision-log.md#d-07)) would be a matter of opinion.

---

[Documentation map](../00-documentation-map.md) · Next: [User stories →](user-stories.md)

# Glossary

> **What this is:** the shared language of this case. Every disagreement about a word in the event storming ended up here. **For:** developers, testers, support and new team members. **Previous:** [interview notes](interview-notes.md) · **Next:** [event storming plan](../03-workshops/event-storming-plan.md).

| Term | Meaning in this case |
|---|---|
| **Agreed delivery window** | The time window agreed with the customer for delivery at the consignee, for example Thu 06:00–10:00. **The reference for "late"** ([ER-01](../05-requirements/exception-rules.md)). |
| **Consignee** | The receiver of the goods. Often not our customer; out of scope for notifications until release 3. |
| **Door-to-door order** | One customer order covering collection, sea crossing and delivery, as opposed to a quay-to-quay booking (terminal to terminal). |
| **ETA** | Estimated time of arrival at the consignee, as calculated in the TMS. |
| **Exception** | A change on an order that puts the agreed delivery window at risk, or a cancellation, customs hold or missing status ([ER-01](../05-requirements/exception-rules.md)). Has a type, severity, owner and response time. |
| **Severity** | Minor, major or critical ([ER-02 to ER-07](../05-requirements/exception-rules.md)). |
| **Response time** | The time within which the owner must acknowledge an exception: 30 min for critical, 2 h for major. |
| **Hold** | A customer message that is deliberately not sent until a planner confirms the situation (missing status). |
| **Haulier** | Subcontracted road transport company doing collection or delivery. |
| **Key account** | A customer with a commercial agreement. Critical exceptions also create a call task for customer service. |
| **Missing status** | No status from the haulier or terminal for longer than expected. Usually a missing app update, sometimes a real problem. |
| **On-carriage / pre-carriage** | Road (or rail) leg after / before the sea crossing. |
| **Pilot cluster** | The two routes and five customers in release 1. |
| **Reefer** | Refrigerated unit; always treated as time-critical. |
| **Throttling** | Not sending a second message about the same order within 2 hours, unless the situation got worse ([ER-12](../05-requirements/exception-rules.md)). |
| **TMS** | Transport management system: orders, planning, statuses and customer portal. A SaaS product in this case. |
| **WISMO** | "Where is my order" — a customer contact asking for the status of a shipment. |
| **Workbench** | The planner's list of open exceptions, sorted by severity and response time. |

---

[Documentation map](../00-documentation-map.md) · Next: [Event storming plan →](../03-workshops/event-storming-plan.md)

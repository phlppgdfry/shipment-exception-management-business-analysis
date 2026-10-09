# Sprint review and retrospective

> **What this is:** the demo script for the sprint 2 review and the BA's part of the retrospective. **For:** the Scrum team and the stakeholders invited to the review. **Previous:** [refinement log](refinement-log.md) · **Next:** [BAT plan](../09-acceptance/bat-plan.md).

## Sprint 2 review — demo script (20 minutes)

**Audience:** PO, Head of CS, road planning lead, 2 account managers, one pilot customer (remote), application support lead.
**Demo by:** the developer who built US-05. **Script and data by:** BA. **Environment:** test, with the demo orders from the [prototype](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/).

| Min | Show | Say (in business terms) | Ask the audience |
|---|---|---|---|
| 0–2 | Sprint goal and what is done / not done | "The customer hears it first. Six stories done, one moved: none." | — |
| 2–6 | A sailing is delayed 6 h; 20 orders on it; workbench shows 3 exceptions | "Only the orders that miss their window. The other 17 just get a new ETA in the portal." | Planning lead: is this the list you would have made by hand? |
| 6–10 | The critical reefer for a key account: message, call task, planner note | "Within five minutes, without anyone picking up a phone." | Pilot customer: is this the message you need? |
| 10–13 | ETA moves again 20 minutes later: no second message | "One story, not three." | AMs: does this answer your concern from the event storming? |
| 13–16 | Missing status: held, planner confirms on time, closed silently | "No false alarm for the customer." | — |
| 16–20 | What is next: BAT next week, go/no-go Thursday, pilot Monday | — | Volunteers for BAT confirmed? |

**Feedback captured:** the pilot customer asked for the window in the e-mail subject line → added to the template before BAT. The Head of CS asked for a daily summary of call tasks → backlog, R2.

## Retrospective sprint 2

*The BA's contribution, as one team member among others.*

- **Went well:** decision examples as the spec — the tester wrote no separate test cases for the rules; developers said they checked the table before asking.
- **Went less well:** I answered a customer-facing question myself in refinement (Q6). It turned into DEF-04 in BAT.
- **Action (owner: BA):** questions that change what the customer sees go to the PO the same day, even when the answer looks obvious; marked with a "customer-facing" label in the refinement log.

---

[Documentation map](../00-documentation-map.md) · Next: [BAT plan →](../09-acceptance/bat-plan.md)

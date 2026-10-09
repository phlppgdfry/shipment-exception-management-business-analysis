# Support handover, KB article and planner quick guide

> **What this is:** what application support and end users get before go-live: a first-line KB article and a one-page quick guide for planners. Support owns and publishes the end-user documentation; the BA prepared the content with them. **For:** application support, planners, customer service. **Previous:** [communication plan](communication-plan.md) · **Next:** [release note](release-note.md).

## Handover session (45 minutes, week 5)

1. Demo of the flow with the prototype data (10 min)
2. The rules in plain language — how to answer "why did this customer get (or not get) a message?" (15 min)
3. Known issues and workarounds (5 min)
4. What first line answers, what goes to the team during hypercare (10 min)
5. Questions; support reviews the KB draft and owns it from here (5 min)

---

## KB article — "Proactive delivery updates (pilot)"

**Applies to:** door-to-door orders of the five pilot customers, from week 6. **Audience:** first-line support and customer service.

### What it does

When a door-to-door delivery is expected after the end of its agreed delivery window, the system opens an **exception** for the right team and, depending on how serious it is, sends the customer an e-mail and a portal message.

### Common questions

| The customer or user asks | Check | Answer / action |
|---|---|---|
| "Why did I get this message?" | Exception in the workbench → *rules applied* | Explain in plain words: e.g. "your delivery is now expected 2 h 20 after your window; for loads like yours we tell you from 2 hours". |
| "Why did I **not** get a message? My truck was an hour late." | Severity was minor (< 2 h after the window) | Expected behaviour (ER-10). The customer can ask their AM to receive every update. |
| "Why didn't I hear about it at 9 when the sailing was delayed?" | Was the order still inside the window at 9? | Expected: we only tell customers when their window is at risk (ER-01). If it was outside the window, escalate to the team. |
| "I got two messages in 10 minutes." | Severity of both messages | If the second was **more** severe: expected (ER-12). If not: **escalate to the team (possible defect).** |
| "The time in the message is wrong." | Time zone shown in the message | Messages show the consignee's local time with the zone. If wrong: escalate. |
| Planner: "Missing status won't send a message." | State "held" | Expected: the planner must confirm with the haulier first (ER-07). |
| Planner: "My list doesn't update." | — | Known issue DEF-05: use the refresh button. Fix in week 7. |
| CS: "The call task has no link to the order." | — | Known issue DEF-06: search by order reference. Fix in week 7. |

### Rule or bug?

It is probably **a rule** if the system did exactly what the table in [exception rules](../05-requirements/exception-rules.md) says, even if the user did not expect it. Explain, and log the question with tag `exceptions-rule-question` — the PO reviews these weekly; enough of them means the rule should change.

It is probably **a bug** if a message went to the wrong customer, contained wrong data, came twice without getting worse, or did not come for a major/critical exception of a pilot customer. **Escalate to the team immediately** (hypercare: the team's channel; after hypercare: second line).

### Never

- Tell a customer the driver's name, phone number or location.
- Switch the feature off yourself — that is the PO's decision ([rollback](release-readiness.md#rollback)).

---

## Planner quick guide (one page, printed at the planning desks)

**Your list:** critical (red) first, then major (amber), then minor (grey). Top = most urgent.

**Response time:** critical **30 min**, major **2 h**. Not acknowledged in time → your shift lead sees it.

**For each exception:**
1. **Acknowledge** — tells everyone you have it.
2. **Re-plan** — agree a new window with the consignee if needed and enter it. If the customer was told before, they get "back on schedule" automatically.
3. **Resolve** — pick a reason. "Other" needs a note.

**Held (missing status):** call the haulier, then choose *confirms on time* (closes, no customer message) or *confirms delay* (enter the new ETA).

**Critical:** you have 5 minutes to add a note to the customer message before it goes. You can still call the customer yourself; log the call on the exception.

**Not in the pilot:** customers outside the pilot get nothing new; keep using the disruption sheet for them until release 2.

---

[Documentation map](../00-documentation-map.md) · Next: [Release note →](release-note.md)

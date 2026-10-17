# Change impact, training and adoption

> **What this is:** what changes for each group of people, how they are prepared, and how we will know the new way of working is actually used — not just installed. **For:** PO, road planning lead, Head of Customer Service, account management, application support. **Previous:** [operations runbook](operations-runbook.md) · **Next:** [communication plan](communication-plan.md).

*Plan for a fictional organisation. Training sessions, champions and adoption figures are proposed, not held or measured.*

## Change impact per group

Impact: **high** = daily work changes; **medium** = some tasks change; **low** = informed only.

| Group | What changes for them | Impact | Main concern (from discovery) | How we address it |
|---|---|---|---|---|
| Road planners (±18) | Work from one exception list instead of the Excel sheet; acknowledge within 30 min / 2 h; reason code on close; confirm missing status before the customer hears | **high** | "More work, false alarms, two stories when I also call" | Designed with the senior planner; hold for missing status (D-04); optional note in critical messages (D-08); guardrail on workload |
| Shift leads | Receive escalations; assign; watch held exceptions past their time (D-09) | medium | "Another screen to watch" | Unassigned/escalated filter; escalation only when the clock runs out |
| Customer service (±22) | Fewer WISMO calls (target); call tasks for critical key accounts; answer "why this message?" from the audit | medium | "Customers will call about the messages" | KB article "rule or bug?"; call task contains the message sent |
| Account managers | Key accounts get a message plus a CS call for critical delays | low–medium | "Key accounts must hear everything" | D-02 explained in their team meeting; they review non-notified exceptions in sprint 1 review |
| Customs desk | Owner of customs holds (release 2) | low (R1) | — | Briefed; scope in release 2 |
| Pilot customers (5) | Proactive messages in portal and e-mail; one channel; UK time | medium | message fatigue | Templates tested with two customers; throttling; pilot letter |
| Application support | One more service; runbook, monitoring, on-call | medium | "Releases arrive without explanation" | In refinement from sprint 1; [runbook](operations-runbook.md) tabletop before handover |

## Readiness per group (a light ADKAR check)

Before go-live, the BA asks each group's lead five questions and records the answer as yes / partly / no. A "no" is an action with an owner before go-live, not a reason to delay automatically.

| Group | Aware why? | Want it? | Know how? | Able (practised)? | Reinforced (measured, followed up)? |
|---|---|---|---|---|---|
| Road planners | yes | partly — sceptic is key user | yes (2 × 30 min) | partly (16/18 trained) | daily check-in, K6, reason completeness |
| Customer service | yes | yes | yes | yes | WISMO tagging (K3) |
| Account managers | yes | partly | yes | n/a | non-notified review in sprint review |
| Application support | yes | yes | partly | partly — tabletop pending | hypercare exit criteria |

*Illustrative status at go/no-go.*

## Training plan

| Who | Format | Length | Content | When | Evidence |
|---|---|---|---|---|---|
| Planners (per shift) | hands-on in the acceptance environment, own test orders | 2 × 30 min | the list and its order; acknowledge; confirm missing status; re-plan; reason codes; what the customer sees | week 5 | attendance; one exception worked end to end |
| Shift leads | walkthrough + escalation drill | 30 min | escalations, assigning, held past time (D-09), workload guardrail | week 5 | escalation drill done |
| Customer service | briefing + KB article | 45 min | message content, call tasks, "rule or bug?", what not to promise | week 5 | KB quiz (5 questions) |
| Account managers | team meeting | 20 min | D-02, what key accounts get, the pilot letter | week 4 | pilot letter sent |
| Application support | handover session + runbook tabletop | 45 + 60 min | architecture, signals, RB-1 and RB-3 | weeks 5–7 | tabletop notes |
| Pilot customers | letter + optional call | — | what to expect, how to reach us | week 5 | letter sent; contact verified (DQ-2) |

**Champions:** the senior planner (the sceptic who became key user) and one senior CS agent answer colleagues' questions in the first two weeks and collect feedback for the daily check-in.

## Adoption measures — is it used, not just installed?

| Measure | Target (pilot) | Why it matters | Source |
|---|---|---|---|
| Exceptions acknowledged within response time (K6) | ≥ 95% | the list is really the work list | export |
| Disruption sheet still updated after week 3 | no | the old workaround is gone | planning lead |
| Exceptions closed with a valid reason code | ≥ 95% | the learning loop works (BR-5) | export |
| Planner notes added to critical messages | tracked, no target | the personal touch survives (D-08) | message log |
| CS questions answered with the KB, without a developer | ≥ 90% | support can own the service | ticket log |
| Opt-outs by pilot customers | < 2% | messages are wanted | portal |

If a measure misses its target two weeks in a row, it goes on the daily check-in agenda with an owner — the fix may be training, a rule change or a design change, decided by the PO.

## Resistance — what we expect and how we respond

| Signal | Likely meaning | Response |
|---|---|---|
| Planners keep the Excel sheet | they do not trust the list (yet) | ask which exception was missing or wrong; check against the rules; fix or explain within a day |
| Many "false alarm" reason codes | thresholds or data quality, not users | data-quality check (assumed windows, R-07); PO decides on thresholds |
| CS escalates every message question to IT | KB not used or not enough | add the case to the KB; second briefing |
| Account manager calls customers "anyway" | trust in the message is low | show the non-notified review; agree when a personal call adds value (D-08) |

---

[Documentation map](../00-documentation-map.md) · Next: [Communication plan →](communication-plan.md)

# 5-minute walkthrough

> A script for showing the case in an interview or a screen share. Open the [site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/) and the [prototype](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/) in two tabs. Press "Reset demo" before you start.

| Time | Show | Say |
|---|---|---|
| 0:00–0:30 | Site, "The challenge" | "A door-to-door operator went live on a new TMS. Customers see statuses but not whether their delivery window is at risk, so they call — 38% of all contacts. Three people asked for three different solutions." |
| 0:30–1:15 | [Business case](../../docs/01-opportunity/options-and-business-case.md), options table + sensitivity | "I started with the problem, not the tools. Four options. The cheap one — standard TMS e-mails — creates nine messages per order. The recommended one pays back in about a year **if** a third of the calls disappear. Nobody knew that, so we bought the information first: a six-week pilot with a control group." |
| 1:15–2:00 | [Event storming page](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/event-storming/), hotspot table | "Planners and account managers wanted opposite things. On the wall that became red hotspots. I prepared options; the owners decided. Severity was the concept that made both sides right." |
| 2:00–3:15 | Prototype, guided tour steps 1–5 | "A sailing is delayed six hours; twenty orders on board; the planner sees two. This reefer for a key account is critical — the rules say why. The message waits five minutes for a planner note. Here is what the customer sees. The planner agrees a new window — the customer automatically hears 'back on schedule'." |
| 3:15–3:45 | Prototype, step 6 (missing status) | "No status for seven hours usually means no app. The customer is not alarmed until the planner has called the haulier." |
| 3:45–4:30 | [BAT log](../../docs/09-acceptance/bat-log.md), DEF-04 | "BAT with key users found four majors. One — two e-mails in ten minutes — came from my own refinement answer. It is in the retro with an action." |
| 4:30–5:00 | [Release readiness](../../docs/10-go-live/release-readiness.md) | "Go/no-go with an owner per line, shadow mode, rollback rehearsed, customers switched on one by one on a Monday. And a stage gate after six weeks against a control group." |

## Likely follow-up questions (and where the answer is)

| Question | Answer in |
|---|---|
| Why WSJF and not just MoSCoW? | [prioritisation](../../docs/06-backlog/prioritisation.md#method) |
| What would you have done if the TMS supplier had an exception module? | [D-03](../../docs/03-workshops/decision-log.md#d-03) |
| How do you know the thresholds are right? | [exception rules — why these thresholds](../../docs/05-requirements/exception-rules.md#why-these-thresholds) |
| What if the pilot shows −10%? | [benefits review — decision rule](../../docs/11-measure/benefits-review.md#measurement-design) |
| Why not a live map? | [problem statement](../../docs/01-opportunity/problem-statement.md), [design decision 7](../../docs/07-design/design.md#design-decisions) |

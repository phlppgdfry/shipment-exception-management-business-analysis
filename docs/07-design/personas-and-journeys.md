# Personas and journey maps

> **What this is:** the four people the release is designed for, built from the (simulated) discovery, and how one disruption feels to them today and after release 1. **For:** designers, PO, team, key users. **Previous:** [definition of ready and done](../06-backlog/definition-of-ready-done.md) · **Next:** [UX specification](ux-specification.md).

*Personas are composites of the roles in the [interview notes](../02-discovery/interview-notes.md) of a fictional organisation, not real people. The names match the demo's users.*

## Personas

### Maren — senior road planner, UK delivery

| | |
|---|---|
| Works | Morning shift 05:00–13:30, two 24" screens: TMS planning board + e-mail/phone |
| Goal | Get every trailer delivered in its window; re-plan fast when something slips |
| Frustrations | "If I stop to answer every call, the trailer is even later." Copies affected orders into the disruption sheet by hand. |
| Fears about the change | More work; customers alarmed by things she would have fixed quietly; "two different stories" when she also calls |
| What she needs from the design | Only what matters, most urgent first; one click to see *why*; her own words in critical messages; no new screen she must keep open next to five others |
| Design answers | Workbench sorted by severity and time left (AC-03.1); rule IDs in plain language on the exception; optional note within 5 min (D-08); held missing status (ER-07) |

### Priya — road planning shift lead

| | |
|---|---|
| Goal | Nothing serious falls through between planners; balance the load |
| Frustrations | Learns about missed slots the next day |
| Needs | See what is overdue; assign in one action; know who owns what |
| Design answers | Escalation after the response time (ER-09); "Unassigned" filter; assign from the exception (AC-03.5) |

### Sara — customer service agent

| | |
|---|---|
| Goal | Answer the customer in one call |
| Frustrations | "I'm a switchboard between the customer and the planner." ±125 h a week on WISMO across the team |
| Needs | See what the customer was already told, and when; a clear task when she must call |
| Design answers | Messages listed on the exception with status (sent, throttled, held…); call tasks with the message attached (US-11); read access to all exceptions (NFR-06) |

### Daniel — transport manager at a food producer (pilot customer, key account)

| | |
|---|---|
| Goal | Plan dock doors and staff around deliveries |
| Frustrations | "We'd rather hear bad news at 10 than no news at 4." Hears about delays at the gate. |
| Needs | One clear message: is my window at risk, new time, why (briefly), what happens next. In UK time. Not ten updates. |
| Design answers | Portal card + e-mail with agreed window, new ETA, reason category, next step (US-05); throttling (ER-12); "back on schedule" (ER-13); local time (DEF-01) |

## Journey map — one serious delay (Daniel and Maren), AS-IS vs. TO-BE

The scenario: the sailing carrying Daniel's reefer is delayed 6 hours; the delivery window is Thu 06:00–08:00.

| Stage | AS-IS — Daniel | AS-IS — Maren | Feeling (AS-IS) | TO-BE — what happens | Feeling (TO-BE) |
|---|---|---|---|---|---|
| 1. Something changes (Wed 09:52) | — | Notices the sailing delay if she happens to look | 😐 / 😐 | Rules evaluate all 11 orders on the sailing in < 2 min; 4 become exceptions | — / 🙂 |
| 2. Is it a problem? | — | Opens the sheet, checks orders one by one | — / 😩 | Exception: critical, owner road planning, respond by 10:22, "why" in plain words | — / 🙂 |
| 3. Who acts? | — | Whoever picks up the phone | — / 😟 | Priya assigns it to Maren; clock stops | — / 🙂 |
| 4. Who is told? | Hears nothing | Calls Daniel herself *if* she has time — often not | 😐 / 😟 | Daniel gets one message at 09:52 with Maren's note; CS gets a call task | 😐 → 🙂 "at least I know" |
| 5. Re-plan | Arrives at the dock 06:00 Thu: no trailer; calls CS | Gets the call from CS mid-re-plan | 😡 / 😩 | Maren agrees 13:00–15:00 with the DC; Daniel gets "back on schedule" | 🙂 / 🙂 |
| 6. Close | Credit note weeks later | Nothing recorded | 😒 / 😐 | Resolved with reason "new window agreed"; counted in the KPIs | 🙂 / 🙂 |

**Moments that matter** (where the design must be right): stage 2 (Maren trusts the severity or she ignores the list), stage 4 (the message is clear and in the right time zone or Daniel calls anyway), stage 5 (the recovery message — without it Daniel keeps his re-plan longer than needed).

## Journey map — the false alarm that does not happen (missing status)

| Stage | AS-IS | TO-BE |
|---|---|---|
| Haulier without the app sends no status for 7 h | Either ignored (risk) or a panicked call to the customer (trust lost) | Exception **held**: Maren sees it, the customer does not (ER-07) |
| Maren calls the haulier | — | Two buttons: "on time" (closed, no message) or "delay, new ETA" (re-evaluated, customer told) |
| Result | 50/50 between a missed problem and a false alarm | Customers hear only confirmed delays (K7 < 5%) |

---

[Documentation map](../00-documentation-map.md) · Next: [UX specification →](ux-specification.md)

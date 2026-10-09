# Problem statement — customers hear about delays too late

> **What this is:** the business problem behind this case, framed before any solution was discussed. **For:** the Product Owner, sponsors and anyone new to the case. **Next:** [options and business case](options-and-business-case.md).

*Independent portfolio case study based on a fictional organisation. All figures are illustrative assumptions — not real company data.*

## In one sentence

Since the new transport management system (TMS) went live, order intake works better, but **customers still learn about delays when they call us**. Customer service spends a third of its time answering "where is my load?", and missed delivery slots cost money and goodwill.

## Where the request came from

The Head of Customer Service asked the Product Owner for "a tracking page like the parcel carriers have". The commercial director asked for "proactive communication to key accounts". The road planning lead asked for "nothing that creates more work for my team". Three requests, one underlying problem. My first job was to describe that problem without choosing one of the three solutions.

## The problem, measured

| Indicator | Baseline | Source |
|---|---:|---|
| Door-to-door orders per week | ±1,600 | TMS order report, last 8 weeks |
| Orders delivered outside the agreed window | ±12% (±190 / week) | TMS: actual delivery vs. window |
| …of which the customer was told **before** the window started | ±22% | sample of 60 orders, e-mail and call log |
| Median time from "delay known in a system" to "customer told" | 3 h 10 min | same sample |
| "Where is my load?" (WISMO) contacts per week | ±1,250 (±38% of all contacts) | contact-reason tagging, 2 weeks |
| Average handling time per WISMO contact | ±6 min | telephony report |
| Missed delivery slots at the consignee per week | ±55 | planner log + credit notes |
| Average cost per missed slot (waiting time, re-delivery, credit note) | ±€140 | finance, 3 months of credit notes |

*Illustrative assumptions — not real company data.* How I would collect each figure in reality is in [the KPI tree](kpi-tree.md#how-each-baseline-is-measured).

## Root causes (5 whys on "the customer hears it too late")

1. The customer calls because nobody told them. → **Why?**
2. Customer service did not know either. → **Why?**
3. The delay is visible in the sailing system or reported by a haulier, but nobody owns "telling the customer". → **Why?**
4. The TMS shows statuses per order, but not whether a change **matters** for the agreed delivery window. Every change looks the same, so people filter by gut feeling. → **Why?**
5. There is no shared definition of "late", no severity and no owner per type of disruption.

**Root cause:** not a missing screen, but **missing rules**: what counts as an exception, how bad it is, who acts, and who is told.

## Who feels it

| Who | Pain | Quote from discovery |
|---|---|---|
| Customer (shipper, forwarder) | Plans warehouse staff and docks around our window; hears about delays at the gate | "We'd rather hear bad news at 10 than no news at 4." |
| Customer service | ±125 hours a week answering the same question; has to chase planners | "I'm a switchboard between the customer and the planner." |
| Road planner | Interrupted by calls while re-planning; works from an Excel sheet | "If I stop to answer every call, the trailer is even later." |
| Account manager | Hears about problems from the customer, not from us | "Embarrassing, every time." |
| Finance | Credit notes without a recorded reason | "We pay, but we don't learn." |

Full notes: [interview notes](../02-discovery/interview-notes.md).

## Goal and non-goals

**Goal:** when a change puts the agreed delivery window at risk, the right planner owns it within minutes and the customer is told before they need to ask.

**Not the goal (yet):** predicting ETAs with machine learning, re-planning automatically, notifying consignees directly, replacing the TMS. Each was discussed and parked with a reason in the [decision log](../03-workshops/decision-log.md).

## What would change our mind

- If the call-reason sample shows that most WISMO calls are about **orders that are on time**, the fix is a status page, not exception management. (Checked: ±70% of sampled WISMO calls concerned orders that were late or at risk.)
- If the TMS supplier delivers an exception module within the next quarter that covers the rules in this case, we configure instead of build ([D-03](../03-workshops/decision-log.md)).

---

[Documentation map](../00-documentation-map.md) · Next: [Options and business case →](options-and-business-case.md)

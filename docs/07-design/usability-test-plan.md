# Usability test — plan and script (control tower)

> **What this is:** a ready-to-run, small usability test of the [control tower demo](../../demo/README.md) with one or two real people. **For:** the owner, who runs it; reviewers, who can see how the design would be validated. **Status:** prepared, **not yet conducted** — results go in the [report](usability-test-report.md). **Previous:** [UX specification](ux-specification.md) · **Next:** [design](design.md).

## Why so small

Five users find most usability problems; one or two already find the big ones. The goal here is not statistics but **one piece of real evidence** in a case where everything else is simulated: real people trying the screens, observed honestly.

## Goal and questions

| # | Research question | Linked to |
|---|---|---|
| Q1 | Does someone new understand **why** an exception is critical, from the screen alone? | UX-2, journey stage 2 ("trust the severity") |
| Q2 | Can they find and do the next action on the most urgent exception without help? | flow F1, AC-03.1 |
| Q3 | Is the customer card clear: is the window at risk, what's the new time, what happens next? | UX-4, US-05 |
| Q4 | Do read-only states and held exceptions make sense, or do they look broken? | UX-3, ER-07 |

## Participants

| | Ideal | Acceptable for this portfolio |
|---|---|---|
| Planner tasks (1–3, 5) | someone who plans transport or operations | anyone used to work lists (customer service, logistics student, operations colleague) |
| Customer task (4) | someone who receives deliveries at a warehouse | anyone — the customer card must be understandable without training |

Not: people who helped build or review the case. Record the profile (role, experience) without names in the report.

## Set-up

- Live demo: <https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/> — press **Reset demo** before each participant.
- Laptop or desktop, a 24" screen if possible (NFR-07). Screen recording only with consent.
- Moderator (the owner) and, if possible, a note-taker. 30 minutes per participant.
- Use the [observation sheet](#observation-sheet) for each task.

## Script

**Introduction (3 min) — read aloud**

> "Thanks for helping. I'm testing a design, not you — if something is hard, that's useful for me. This is a demo of a planning screen for a fictional transport company; all data is made up. Please think aloud: say what you're looking at, what you expect and what you're unsure about. I won't help during the tasks, but you can stop at any time. Is it OK if I take notes [and record the screen]?"

**Context (1 min)**

> "You are a road planner. It's Wednesday morning. Your job is to make sure trailers arrive within the time window agreed with the customer, and to sort out problems."

**Tasks** — give one at a time, on a card. Do not use words that appear on buttons.

| # | Task (say this) | Success = | Max time | Measures Q |
|---|---|---|---:|---|
| T1 | "A sailing has just been delayed. Find out which of your customers are affected and which one needs your attention first." *(before: moderator presses "Publish the sailing delay" in the guided scenario, then closes the panel)* | opens the exceptions list and names D2D-48213 / Northfield as most urgent | 3 min | Q2 |
| T2 | "Why does the system think this one is so urgent? Explain it to me in your own words." | mentions late after the window **and** reefer / time-critical (or key account) | 2 min | Q1 |
| T3 | "Take care of it: make clear you're handling it, and let the customer know you're on it." | acknowledges (or is told that the shift lead assigns) and sends the message with a note | 4 min | Q2 |
| T4 | *(switch role)* "You are now the customer, Northfield Foods. Look up order D2D-48213. What do you now know?" | states: delayed, new time, reason, that someone is working on a new slot | 2 min | Q3 |
| T5 | "There's an order where the truck hasn't reported anything for hours (D2D-48288). What would you do — and does the customer know?" | understands it is held, the customer has not been told, and finds the two confirm options | 3 min | Q4 |

**Debrief (5 min)**

1. "What was the hardest moment?"
2. "Was there anything you expected to see but didn't?"
3. "If you used this every morning, what would annoy you after a week?"
4. Rate: "How easy was it overall?" 1 (very hard) – 7 (very easy). "How confident were you that you did the right thing?" 1–7.

## Observation sheet

Copy per participant and task into the report.

| Field | Note |
|---|---|
| Completed? | yes / with hints (how many) / no |
| Time | mm:ss |
| Path taken | screens and clicks, in order |
| Hesitations / errors | where, what they said |
| Quotes | verbatim, short |
| Severity of each problem | **critical** (blocks the task) · **serious** (major delay or wrong action) · **minor** (annoyance) |

## Analysis (1 hour after the sessions)

1. List every problem once, with the tasks and participants where it occurred.
2. Rate severity (above) and how many participants hit it.
3. For each critical or serious problem: a design change, linked to a UX decision (UX-n) or a new one.
4. Write the [report](usability-test-report.md); add backlog items for the changes.

## Ethics and data

Consent before starting; no names, faces or personal details in the repository; recordings deleted after analysis; participants can withdraw at any time.

---

[Documentation map](../00-documentation-map.md) · Report: [usability test report →](usability-test-report.md)

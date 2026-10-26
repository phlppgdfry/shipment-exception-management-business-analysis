# Control Tower — design and validation handover

Updated 2026-10-17. Fictional case. The editable [vector handover](figma/control-tower-handover.svg) specifies four stages; current application screenshots accompany it. The original Figma release-1 screens remain historical design evidence, not an assertion that every original frame matches the current application.

[Native Figma handover page](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI?node-id=3-52) — imported SVG vectors, separate from the historical release-1 page. This is a static handover; interaction behaviour is verified in the working app.

## Native screens (editable layers, added 2026-10-23)

The current application is now rebuilt on the same Figma page as **native, editable layers** — auto-layout frames, live text and component instances, not screenshots. A designer can restyle, rename or extend them; a developer can read spacing and colour tokens off them.

| Frame | Figma node | Shows |
|---|---|---|
| Exceptions — critical (EX-1012) | [`10:53`](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI?node-id=10-53) | full 1440 px workbench: top bar, planner clock, filters, list, detail, rule explanation, actions |
| Held exception (EX-1008) | [`11:128`](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI?node-id=11-128) | the held state: no customer message until the haulier confirms (ER-07, D-04, D-09) |
| Customer tracking — delayed | [`11:176`](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI?node-id=11-176) | what the customer sees, in UK time, with the internal fields deliberately absent (NFR-05, D-05) |

**Foundation.** A variable collection *Control Tower tokens* (16 colour variables, one Light mode) mirrors the CSS custom properties in `demo/application/src/app/globals.css`, so a colour change in the design maps to one token in code. Five components carry the repetition: `Severity chip` (four variants: critical, major, minor, held), `Status pill`, `Exception card`, `Rule row` and `Fact`.

![Native Figma rebuild of the exception workbench, with the planner clock in Europe/Brussels](figma/native-workbench.png)

*Figma renders of the native frames: [workbench](figma/native-workbench.png) · [held](figma/native-held.png) · [customer](figma/native-customer.png). These PNGs are exports for readers without Figma access; the editable layers live in the file.*

**Limits.** Starter plan: one variable mode, so dark mode is in code only (`prefers-color-scheme` in `globals.css`), not as a second Figma mode. The frames are a design of the current build, not a prototype — interaction and state behaviour are verified by the browser tests, not here.

## Screen/state mapping

| Stage | App route | Stories | Required states |
|---|---|---|---|
| Triage | exceptions/ | US-03 | critical first, overdue, held, empty, loading, error/retry |
| Action/replan | exceptions/?id=EX-1005 | US-04, US-11 | authorised owner, read-only role, validation failure, new window, resolve |
| Status confirmation | exceptions/?id=EX-1008 | US-08 | HELD, escalated but held, on-time close, confirmed delay |
| Customer | track/?ref=D2D-48213 | US-05, US-10 | no update, sent delay, recovery; no internal fields |

## Time contract

All stored instants stay UTC. Planner persona is explicitly Europe/Brussels, including inputs, deadlines and audit. Customer messages, tracking and destination-date severity comparisons stay Europe/London. Show both zones when reading a customer message inside the planner workbench. Never infer the zone from the computer running the browser. Input helpers convert wall-clock to UTC and reject ambiguous/nonexistent DST times; the operator must confirm an unambiguous time. No customer delivery window silently shifts at a clock transition.

## Validation protocol ready for two real participants

Use the [existing test plan](usability-test-plan.md) and [report](usability-test-report.md). No invitations are sent and no human outcome is fabricated.

1. **P1 / P2 task A:** find the most urgent actionable exception and explain why it is first. Success: correct exception and deadline, without moderator help, within 90 seconds.
2. **Task B:** explain what the customer has actually been told. Success: distinguish sent message from draft/held state and identify UK time, within 90 seconds.
3. **Task C:** agree a new window and resolve. Success: use Brussels input correctly, supply reason, verify the customer recovery message, within 3 minutes.

For each participant record date, relevant experience, task completion, elapsed time, assistance, observed issue and exact quote (with permission). Do not store identifying personal data. Prioritise critical misinterpretation of confirmation/time over cosmetic requests. Each actual issue receives issue ID, before evidence, change, and repeat task result. Two participants are exploratory feedback, not representative research or operational BAT.

| Participant | A | B | C | Findings / retest |
|---|---|---|---|---|
| P1 | NOT EXECUTED | NOT EXECUTED | NOT EXECUTED | awaiting real participant |
| P2 | NOT EXECUTED | NOT EXECUTED | NOT EXECUTED | awaiting real participant |

## Three ownership exercises

Keep the AI provenance levels unchanged until the owner does the work. Save your actual work in `learning/my-work/` and link it from the tracker.

- **Rules:** predict the result at an agreed-window boundary, change one threshold, run tests and explain which example catches the change.
- **Data/interface:** trace a stale ETA event from arrival to rejection and explain why it must not overwrite newer information; make a small change and test it.
- **UX/time:** predict the same UTC instant in Brussels/London, enter a new window in summer, explain the DST gap refusal and demonstrate the resulting customer message.

Each evidence entry needs the owner's date, unaided explanation, concrete diff, command/output and a diagnosis of a failing case. Generated materials alone do not increase the level.

## Current rendered application captures

| Planner triage | Held status | Customer tracking |
|---|---|---|
| [Workbench](figma/control-tower-workbench.png) | [Held](figma/control-tower-held.png) | [Customer](figma/control-tower-customer.png) |

[Combined screen reference sheet](figma/control-tower-current-screens.svg) · [Native Figma app captures](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI?node-id=6-2), imported next to the vector handover on the Control Tower page.

Captured from the current production static export in Chromium, not mock Figma data. Re-capture after a screen change; the browser checks cover the mapped behaviours separately.

## P2 customer-status correction — 2026-10-22

The current customer card can show a neutral Awaiting confirmation state before any customer message is sent. A missing/held or stale status is not evidence of being on schedule. See [P1/P2 remediation](../13-quality/p1-p2-remediation.md) for the rule, tests and API compatibility. Earlier Figma screenshots predate this correction.

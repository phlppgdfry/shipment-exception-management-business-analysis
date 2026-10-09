# User stories

> **What this is:** the stories for release 1 (and the release 2–3 stories at headline level), with acceptance criteria. **For:** the Scrum team and the PO. **Previous:** [story map](story-map.md) · **Next:** [prioritisation](prioritisation.md).

Acceptance criteria are written as Given/When/Then. The decision examples (AC-01, 02, 07, 08, 09, 10, 11) are a table in [`exception-decision.feature`](features/exception-decision.feature) and **run as tests**. The workbench and message criteria are in [`workbench-and-messages.feature`](features/workbench-and-messages.feature) and are tested by the tester and in BAT.

Size in story points (team estimate in refinement). Rules: [ER-xx](../05-requirements/exception-rules.md). Requirements: [FR/NFR](../05-requirements/requirements.md).

---

## Release 1

### EN-1 Receive TMS changes reliably *(enabler · 3 pts)*

**So that** no change is missed, **the exception component** receives status, ETA, window and sailing changes from the TMS and processes each event once.

- Given the TMS sends a webhook for an order change, when it is received, then it is acknowledged and queued within 5 seconds.
- Given the same TMS event ID arrives twice, when it is processed, then the second one has no effect (NFR-03).
- Given no webhook arrived for 15 minutes during planning hours, then application support is alerted and changed orders are re-read through the API (NFR-04).

### EN-2 Delivery window mandatory for pilot customers *(enabler · 1 pt)*

**So that** "late" can be calculated, the delivery window is mandatory in order intake for pilot customers (TMS configuration, DQ-1).

- Given a pilot customer creates a door-to-door order without a window in the portal, then the order cannot be submitted and the field explains why.
- Given an order without a window still reaches the component (EDI, older orders), then FR-03 applies (window assumed, flagged).

### US-01 Classify a change *(5 pts)*

**As a** road planner **I want** every change on an order to be classified as no exception, minor, major or critical **so that** I only look at what puts the delivery window at risk.

- AC-01.1 – AC-01.12 in the [decision table](features/exception-decision.feature): window boundaries, the 120 / 360 min thresholds, next day, time-critical cargo, cancellations.
- Given an order has no delivery window, when it is evaluated, then the window end is assumed to be planned ETA + 2 h and the exception shows "window assumed" (FR-03).
- Given a change is evaluated, then the exception stores the rule IDs applied (NFR-08).

### US-02 Owner and response time *(2 pts)*

**As a** shift lead **I want** each exception to have one owner group and a response time **so that** nothing falls between planning, terminal and customs.

- AC-02.1 in the decision table (terminal delay → terminal operations).
- Given a critical exception, then the response time is 30 minutes; major: 2 hours; minor: no response time (ER-09).

### US-03 Workbench *(5 pts)*

**As a** road planner **I want** one list of open exceptions for my group, sorted by severity and time left **so that** I can stop using the disruption sheet.

- AC-03.1 Given open exceptions of different severities, when I open the workbench, then critical comes first, then major, then minor, and within a severity the earliest due time first.
- AC-03.2 Given an exception with "window assumed", then the list shows that flag.
- AC-03.3 Given a delayed sailing affects 20 orders of which 3 are outside their window, then only those 3 appear (ER-01).
- AC-03.4 Given a critical exception is not acknowledged within 30 minutes, then it is marked "escalated" and appears in the shift lead's view.
- AC-03.5 Given an escalated exception, when the shift lead assigns it to a planner, then it becomes "acknowledged" with the planner's name.

### US-04 Acknowledge, re-plan and resolve *(3 pts)*

**As a** road planner **I want** to acknowledge an exception, record a new agreed window and resolve it with a reason **so that** the customer and the next shift know what happened.

- AC-04.1 Given an open exception, when I acknowledge it, then my name and time are recorded and the due-time indicator stops.
- AC-04.2 Given I enter a new agreed window, then the order is re-evaluated (ER-13 may apply).
- AC-04.3 Given I resolve an exception, then a reason code is mandatory: *delivered in window · new window agreed · customer informed, no action · false alarm · other (note required)*.

### US-05 Proactive customer message *(5 pts)*

**As a** customer **I want** to be told when my delivery will miss the agreed window, with the new ETA and what happens next **so that** I can re-plan my dock and staff.

- AC-05.1 Given a major or critical exception, when it opens, then a message is sent within 5 minutes to the order's operational contact, by e-mail and in the portal (NFR-01).
- AC-05.2 Then the message contains order reference, agreed window, new ETA, reason category and next step — and no driver name, phone number or location (NFR-05).
- AC-05.3 Given the e-mail bounces, then the exception is flagged "message failed" and a call task is created for customer service (FR-09).
- AC-05.4 Given a critical exception, then the planner can add a short note to the message before it is sent; if she does nothing for 5 minutes, it is sent without a note (D-08).

### US-07 No message storm *(2 pts)*

**As a** customer **I want** at most one message about the same order every two hours, unless it got worse **so that** I trust the messages instead of filtering them out.

- AC-07.1 – AC-07.5 in the decision table.
- Given an order with **two** open exceptions (for example a sailing delay and then a road delay), then throttling applies **per order**, not per exception. *(Added after BAT defect [DEF-04](../09-acceptance/bat-log.md).)*

### US-08 Missing status: confirm before alarming *(3 pts)*

**As a** road planner **I want** missing-status exceptions to reach me before they reach the customer **so that** we do not alarm customers when a haulier just did not update the app.

- AC-08.1 – AC-08.4 in the decision table.
- Given a held exception, when I choose "haulier confirms on time", then it closes with reason "false alarm" and no message is sent.
- Given a held exception, when I choose "haulier confirms delay" and enter the new ETA, then it is re-evaluated as a road delay.

### US-10 Back on schedule *(2 pts)*

**As a** customer who was told about a delay **I want** to be told when it is solved **so that** I do not keep my re-plan longer than needed.

- AC-10.1 – AC-10.2 in the decision table.

### US-11 Call task for key accounts *(2 pts)*

**As a** key account manager **I want** customer service to call a key account when a delivery is critically late **so that** serious problems are never announced by e-mail only.

- AC-11.1 – AC-11.3 in the decision table.
- Given a call task, then it appears in the CS tool with order, new ETA and the message already sent; closing it requires a short outcome.

### US-13 Pilot toggle and measurement *(3 pts)*

**As a** Product Owner **I want** to switch the feature on per customer and export the pilot measurements **so that** the stage gate decision is based on data.

- AC-13.1 Given a customer is not in the pilot, then exceptions are still evaluated and logged ("shadow mode") but no message is sent.
- AC-13.2 Given a day has passed, then a CSV export contains per exception: order, customer, pilot yes/no, type, severity, timestamps (received, opened, acknowledged, message sent, resolved), reason code, number of messages.
- AC-13.3 The export is available to the PO and the Head of CS only.

*Shadow mode for non-pilot customers was the analyst's suggestion in refinement: it gives the control group's exception data for free.*

---

## Release 2 and later (headlines, not refined)

| ID | Story | Release | Why later |
|---|---|---|---|
| US-06 | As an EDI/API customer I receive a status message for major/critical exceptions | R2 | Different message standard per customer; one EDI customer in the pilot gets portal + e-mail meanwhile |
| US-09 | As the customs desk I want customs holds to ask the customer to act, with what is missing | R2 | Customs desk not in the pilot; message content needs legal review |
| US-12 | As a customer I manage my notification preferences in the portal | R2 | R1: CS sets "every update" on request (1 of 5 pilot customers asked) |
| US-14 | As a consignee I receive the new ETA | R3 | GDPR and contract questions (D-05) |

---

[Documentation map](../00-documentation-map.md) · Next: [Prioritisation →](prioritisation.md)

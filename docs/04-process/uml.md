# UML models

> **What this is:** three UML views of the same release — who uses it (use case), how the systems talk (sequence) and how an exception moves through its life (state). **For:** developers, testers and the PO. **Previous:** [TO-BE process](to-be.md) · **Next:** [exception rules](../05-requirements/exception-rules.md).

Diagrams are in Mermaid so they render on GitHub and stay editable in a pull request. Mermaid has no native use-case notation; the first diagram uses the UML conventions (actors outside, use cases as ovals inside the system boundary) with a flowchart.

## Use cases (UML use case diagram)

```mermaid
flowchart LR
  planner["«actor»<br/>Road planner"]
  cs["«actor»<br/>Customer service agent"]
  cust["«actor»<br/>Customer"]
  lead["«actor»<br/>Shift lead"]
  tms["«system actor»<br/>TMS"]
  subgraph SYS ["Exception management — release 1"]
    UC1(["UC-1 Detect and classify exception"])
    UC2(["UC-2 Work the exception list"])
    UC3(["UC-3 Confirm missing status"])
    UC4(["UC-4 Agree new delivery window"])
    UC5(["UC-5 Notify customer"])
    UC6(["UC-6 Call key account"])
    UC7(["UC-7 Escalate overdue exception"])
    UC8(["UC-8 Resolve with reason code"])
    UC9(["UC-9 See order status and new ETA"])
  end
  tms --- UC1
  planner --- UC2
  planner --- UC3
  planner --- UC4
  planner --- UC8
  cs --- UC6
  lead --- UC7
  cust --- UC9
  UC1 -.->|"«include»"| UC5
  UC4 -.->|"«extend» if notified before"| UC5
  UC2 -.->|"«include»"| UC8
```

| Use case | Primary actor | Stories |
|---|---|---|
| UC-1 Detect and classify | TMS (event) | US-01, US-02 |
| UC-2 Work the list | Road planner | US-03 |
| UC-3 Confirm missing status | Road planner | US-08 |
| UC-4 Agree new window | Road planner | US-04, US-10 |
| UC-5 Notify customer | system | US-05, US-07 |
| UC-6 Call key account | CS agent | US-11 |
| UC-7 Escalate | Shift lead | US-03 (AC-03.4) |
| UC-8 Resolve | Road planner | US-04 |
| UC-9 See status and ETA | Customer | US-05 |

## How the systems talk (UML sequence diagram)

Scenario: the sailing of a reefer for a key account is delayed by six hours.

```mermaid
sequenceDiagram
  autonumber
  participant SAIL as Sailing system
  participant TMS as TMS (SaaS)
  participant EXC as Exception component
  participant WB as Planner workbench
  participant NOTIF as Notification service
  actor P as Road planner
  actor C as Customer
  SAIL->>TMS: sailing delay +6 h
  TMS->>TMS: recalculates order ETAs
  TMS-)EXC: webhook: order D2D-48213 ETA changed
  EXC->>TMS: GET order (window, cargo, customer profile)
  TMS-->>EXC: window Thu 06:00–08:00, reefer, key account
  EXC->>EXC: evaluate rules → CRITICAL, ROAD_PLANNING, 30 min, NOTIFY_AND_CALL
  EXC->>WB: open exception (severity, owner, due 10:30)
  EXC->>NOTIF: customer message (new ETA, reason category)
  NOTIF-)C: portal message + e-mail
  EXC->>WB: call task for customer service
  EXC->>TMS: add order note "exception EX-1042 opened"
  P->>WB: acknowledge (within 30 min)
  P->>TMS: agree new window with consignee
  TMS-)EXC: webhook: window changed
  EXC->>EXC: re-evaluate → RECOVERED, notified before
  EXC->>NOTIF: "back on schedule, new window"
  NOTIF-)C: portal message + e-mail
  P->>WB: resolve, reason "new window agreed"
```

Failure paths agreed in refinement: if step 4 fails, the component retries 3 times with back-off and then raises an application-support alert; the webhook is idempotent on the TMS event ID, so a re-sent event does not open a second exception ([NFR-03](../05-requirements/requirements.md)).

## Exception lifecycle (UML state diagram)

```mermaid
stateDiagram-v2
  [*] --> Open: rules say exception
  Open --> Held: missing status (ER-07)
  Held --> Open: planner confirms delay
  Held --> Closed: planner confirms on time
  Open --> Acknowledged: owner acknowledges
  Open --> Escalated: response time passed
  Escalated --> Acknowledged: shift lead assigns
  Acknowledged --> Acknowledged: ETA changes (re-evaluated)
  Acknowledged --> Recovered: back inside the window (ER-13)
  Acknowledged --> Resolved: resolved with reason code
  Recovered --> Resolved
  Resolved --> Closed
  Closed --> [*]
```

Every arrow is at least one test case; the testers used this diagram to find two transitions the stories did not cover (Held → Closed, Escalated → Acknowledged). Both are now acceptance criteria in [US-08 and US-03](../06-backlog/user-stories.md).

---

[Documentation map](../00-documentation-map.md) · Next: [Exception rules →](../05-requirements/exception-rules.md)

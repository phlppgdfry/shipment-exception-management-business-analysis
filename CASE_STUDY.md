# Case study — Shipment exceptions, handled before the customer calls

> The whole story in one document, ±10 minutes. Details live in [`docs/`](docs/00-documentation-map.md).

*Independent portfolio case study based on a fictional organisation (Tidewell Logistics). It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data. Workshops, interviews and BAT are simulated.*

## 1. The situation

Tidewell Logistics is the door-to-door division of a fictional short-sea operator between the Continent, the UK and Ireland: ±1,600 orders a week, collected by subcontracted hauliers, shipped on Tidewell's own sailings and delivered in an **agreed delivery window** at the consignee.

Six months ago a SaaS transport management system (TMS) replaced the old planning tool. Order intake improved. But customer service still spends ±38% of its contacts on one question — *"where is my load?"* — and ±55 delivery slots a week are missed, often without the customer knowing in advance.

Three people came to the Product Owner with three solutions:

- the Head of Customer Service wanted "a tracking page like the parcel carriers";
- the commercial director wanted "proactive e-mails to key accounts";
- the road planning lead wanted "nothing that creates more work for my team".

## 2. Framing the problem before choosing a solution

I started with the question behind the three requests: *what goes wrong between "a delay is known" and "the customer knows"?* A five-whys session and a sample of 60 orders gave the answer: the information exists within minutes, but **nobody owns telling the customer, and nothing says which changes matter**. Every status change looks the same, so people filter by gut feeling. The root cause was missing **rules and ownership**, not a missing screen.

I put four options in front of the PO and the sponsor and scored them on criteria we agreed *before* scoring: do nothing and add an agent; switch on the TMS's standard e-mails; exception management; or an external visibility platform. The standard e-mails looked cheapest — until I replayed a week of status events for 20 orders: ±9 messages per order, 0.3 of which mattered. Two pilot customers said they would make a rule to delete them.

Exception management won (3.95 vs. 3.10). Its business case pays back in ±13.5 months — **if** a third of WISMO contacts disappear. Nobody knew that number. So I proposed to buy the information first: a **six-week pilot with five customers and a control group**, and a stage gate before release 2. The sponsor agreed. → [options and business case](docs/01-opportunity/options-and-business-case.md)

## 3. Discovery and event storming

Seven interviews and a morning shadowing the UK delivery planners produced facts and contradictions. The account manager wanted every delay communicated — until asked about 20 minutes inside the window. The senior planner already called her important customers herself and feared "two different stories". "No status" from a haulier usually meant "no app", not a problem.

I took the five contradictions to a three-hour **big-picture event storming** with planners, customer service, an account manager, the customs desk, the PO and a developer. On one timeline the disagreements became six red hotspots. I did not decide them; I prepared options with consequences and each owner decided within a week. The concept that unlocked most hotspots was **severity**: once "minor, major, critical" existed, "tell key accounts everything" and "no notification storm" were no longer opposites. → [event storming](docs/03-workshops/event-storming-board.md), [decision log](docs/03-workshops/decision-log.md)

## 4. Process and rules

The AS-IS BPMN shows six pain points between the sailing system and the customer's phone call. The TO-BE adds one thing: every change is evaluated by rules that decide whether it is an exception, how severe, who owns it, how fast they must respond and whether the customer is told. → [AS-IS / TO-BE](docs/04-process/to-be.md), [UML](docs/04-process/uml.md)

The 13 rules fit in one decision table. A few that came straight from the hotspots:

- **Late** means after the **end of the agreed window**, not after the planned ETA (D-01).
- Minor < 2 h, major 2–6 h, critical ≥ 6 h or next day; reefer and time-critical cargo one level up (D-02).
- Missing status: the planner confirms with the haulier **before** the customer is alarmed (D-04).
- At most **one message per order every two hours**, unless it got worse (ER-12).

The 30 decision examples in the acceptance criteria run as tests in CI against the same rule module that powers the [prototype](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/) and the [rule explorer](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/rules/). When the PO changes a threshold, the test run shows exactly which examples change meaning. → [exception rules](docs/05-requirements/exception-rules.md)

## 5. The backlog, with the Product Owner

I built a story map along the TO-BE and prepared a WSJF scoring as a **proposal**: the business scored value, the team scored size, the PO decided. The ranking surfaced small, high-value items — making the delivery window mandatory for pilot customers (28% of orders had none) scored 15.0 for one point of work.

The PO made trade-offs I documented with her reasons: missing-status handling before the EDI status messages the largest forwarder asked for ("false alarms in week one would kill trust"), and the cheap key-account call task in release 1 to win over the account managers. Release 1 became 36 points: two sprints. → [prioritisation](docs/06-backlog/prioritisation.md), [user stories](docs/06-backlog/user-stories.md)

## 6. Design

The planner workbench shows only exceptions, most urgent first, and every decision explains itself with the rules behind it. Critical customer messages wait five minutes for an optional planner note, then send anyway — the senior planner keeps her personal touch, the customer does not wait. The customer message is one fixed block (window, new ETA, reason, next step), tested with two pilot customers; they asked for the window in the subject line. → [design and Figma](docs/07-design/design.md)

## 7. Delivery

In refinement, every answer that changed behaviour became a criterion the same day. One did not: I answered "throttle per exception or per order?" myself, because it looked obvious. It was not — one order can have two exceptions. → [refinement log](docs/08-delivery/refinement-log.md)

## 8. Business Acceptance Testing

Key users tested in their own context: the sceptical senior planner, customer-service agents, an account manager, and a pilot customer reading real messages in their own inbox. Four major findings — three of them invisible to the team's tests because the stories were satisfied but the need was not (UTC instead of local time; a flag stored but not shown). The fourth, two e-mails in ten minutes, came from my refinement answer. All majors were fixed and retested; the business signed off with two known minor issues, each with a workaround, an owner and a date. → [BAT log](docs/09-acceptance/bat-log.md)

## 9. Ready for production — and understood

The go/no-go checklist had 13 lines, each with an owner and evidence: shadow mode for two days, rollback rehearsed in four minutes, contacts verified, support trained, customers informed by their account manager. Pilot customers were switched on one at a time on a **Monday morning**, not a Friday. Hypercare had explicit thresholds (false alarms per day, messages per exception). → [release readiness](docs/10-go-live/release-readiness.md), [communication plan](docs/10-go-live/communication-plan.md), [KB article](docs/10-go-live/support-handover.md)

## 10. Measuring, honestly

The stage gate compares pilot customers with a control group. In the illustrative readout WISMO contacts fell 26% relative to the control group: above the 20% gate, below the 35% plan. I recalculated the business case downwards (payback ±20 months instead of 13.5) and proposed release 2 with a scope adjusted to what the pilot showed. → [benefits review](docs/11-measure/benefits-review.md)

## What this case says about how I work

- I separate the **problem** from the three solutions people bring, and make the riskiest assumption explicit and testable.
- I make disagreements **visible** and let the right person decide; I document why.
- I write requirements precise enough to **test automatically**, and I keep the PO in charge of priority.
- I care about the part after "done": **acceptance, readiness, communication, support and measurement**.
- When I get something wrong, it goes in the retro — with an action.

Companion case on the same fictional operator, from the functional analyst's side: [late booking amendments](https://github.com/phlppgdfry/shortsea-booking-functional-analysis).

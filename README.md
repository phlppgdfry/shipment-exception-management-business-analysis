# Shipment exceptions, handled before the customer calls

**A business analysis case: from opportunity to production readiness**

> How a short-sea and door-to-door operator could tell customers about delays before they call — framed as a business case, worked out with the people involved, prioritised with the Product Owner, accepted by the business and brought live in a controlled pilot.

> *Independent portfolio case study based on a fictional organisation (Tidewell Logistics). It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data.*

**[Live site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/)** · **[Prototype (2-min tour)](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/?tour)** · **[Start here](START-HERE.md)** · **[Case study](CASE_STUDY.md)** · **[Evidence matrix](EVIDENCE.md)**

![Planner workbench designed in Figma](docs/07-design/figma/planner-workbench.png)

## The journey

```text
Frame the opportunity   problem, four options, business case, KPI tree
   ↓
Discover                interviews, shadowing, stakeholders, glossary
   ↓
Event storm             timeline, six hotspots, decisions by their owners
   ↓
Model                   BPMN 2.0 AS-IS / TO-BE, UML use case, sequence, state
   ↓
Define the rules        13 exception rules, decision table, 30 executable examples
   ↓
Prioritise with the PO  story map, WSJF, release slicing, DoR / DoD
   ↓
Specify & design        user stories + Gherkin, Figma screens, clickable prototype
   ↓
Deliver                 sprint plan, refinement log, review demo, retrospective
   ↓
Accept                  Business Acceptance Testing with key users, sign-off
   ↓
Go live & measure       go/no-go, rollback, hypercare, communication, support KB, stage gate
```

## The problem

Since its new transport management system went live, Tidewell's customers can see statuses in a portal — but not whether their **delivery window** is at risk. They find out at the gate and call. Customer service spends ±38% of its contacts on "where is my load?", planners notice delays by chance and copy them into an Excel sheet, and only key accounts whose account manager happens to know are warned. Three people asked for three different solutions.

## What I did

- **Framed the problem before the solution** — five whys, four options scored with the business, a business case with its riskiest assumption named and a six-week pilot as the way to test it — [options and business case](docs/01-opportunity/options-and-business-case.md)
- **Ran discovery and a big-picture event storming** — contradictions kept, six hotspots, each decided by its owner — [interview notes](docs/02-discovery/interview-notes.md), [event storming](docs/03-workshops/event-storming-board.md), [decision log](docs/03-workshops/decision-log.md)
- **Modelled the process** in BPMN 2.0 (valid `.bpmn` files) and the release in UML — [AS-IS](docs/04-process/as-is.md), [TO-BE](docs/04-process/to-be.md), [UML](docs/04-process/uml.md)
- **Wrote the exception rules** as one decision table; the 30 examples **run as tests in CI** — [rules](docs/05-requirements/exception-rules.md), [feature file](docs/06-backlog/features/exception-decision.feature)
- **Prepared the backlog with the PO** — story map, WSJF with the trade-offs she made, a two-sprint pilot — [prioritisation](docs/06-backlog/prioritisation.md), [user stories](docs/06-backlog/user-stories.md)
- **Designed the screens** in Figma and as a clickable prototype on the same rules — [design](docs/07-design/design.md), [prototype](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/)
- **Took it through delivery** — refinement, sprint review demo, a retro action on my own mistake — [refinement log](docs/08-delivery/refinement-log.md)
- **Organised BAT and production readiness** — key users, defect triage, sign-off with two known issues, go/no-go with an owner per line, staged switch-on, rollback, hypercare, communication plan, KB article — [BAT log](docs/09-acceptance/bat-log.md), [readiness](docs/10-go-live/release-readiness.md)

## What this demonstrates

| Typical IT business analyst responsibility | Evidence |
|---|---|
| Analyse business needs, challenges and opportunities | [problem](docs/01-opportunity/problem-statement.md) · [business case](docs/01-opportunity/options-and-business-case.md) · [KPI tree](docs/01-opportunity/kpi-tree.md) |
| Translate needs into user stories, flows and acceptance criteria | [BPMN](docs/04-process/to-be.md) · [stories](docs/06-backlog/user-stories.md) · [executable criteria](docs/06-backlog/features/exception-decision.feature) |
| Facilitate event storming and refinement; design in Figma | [event storming](docs/03-workshops/event-storming-plan.md) · [refinement](docs/08-delivery/refinement-log.md) · [design](docs/07-design/design.md) |
| Support the PO in defining and prioritising the backlog | [story map](docs/06-backlog/story-map.md) · [WSJF](docs/06-backlog/prioritisation.md) |
| Agile ceremonies, documentation and testing | [sprint plan](docs/08-delivery/sprint-plan.md) · [review & retro](docs/08-delivery/sprint-review.md) · [traceability](docs/05-requirements/traceability.md) |
| Business Acceptance Testing and end-user documentation | [BAT plan](docs/09-acceptance/bat-plan.md) · [BAT log](docs/09-acceptance/bat-log.md) · [KB article](docs/10-go-live/support-handover.md) |
| Ready for production, understood by all stakeholders | [go/no-go](docs/10-go-live/release-readiness.md) · [communication plan](docs/10-go-live/communication-plan.md) |

Full mapping, including what is *not* claimed: [EVIDENCE.md](EVIDENCE.md).

## Repository map

| Folder | Contents |
|---|---|
| [`docs/`](docs/00-documentation-map.md) | the analysis, numbered along the journey |
| `docs/04-process/bpmn/` | AS-IS and TO-BE as BPMN 2.0 XML (Camunda Modeler, bpmn.io) |
| `docs/06-backlog/features/` | acceptance criteria in Gherkin; the decision examples are executable |
| `docs/07-design/figma/` | exports of the Figma screens |
| [`data/`](data/) | Excel workbook with formulas (business case, sensitivity, options, WSJF, BAT log, traceability) and CSV mirrors |
| `site/` | GitHub Pages: landing page, prototype, rule explorer, process, event storming |
| `site/assets/exception-rules.mjs` | the rules as one module — used by the prototype, the rule explorer and the tests |
| `tests/` | runs every decision example against the rules (`node --test tests/*.test.mjs`) |
| `scripts/` | BPMN generator and link checker |
| [`application-kit/`](application-kit/) | one-page summary (EN + NL), 5-minute walkthrough, stakeholder deck |

Companion case on the same fictional operator, from the functional analyst's side: [late booking amendments](https://github.com/phlppgdfry/shortsea-booking-functional-analysis).

## Notes on realism and assumptions

The organisation, people, numbers, workshops and BAT are fictional; their shape is not. The case keeps the mess a real team meets: three stakeholders asking for three solutions, a SaaS supplier whose roadmap you cannot count on, hauliers who do not use the app, 28% of orders without a delivery window, an account manager and a planner who want opposite things, a GDPR question about consignees, and a BAT defect that came from my own refinement answer. The rule module exists to prove the rules are precise enough to build and test — not to suggest that the analyst writes production code.

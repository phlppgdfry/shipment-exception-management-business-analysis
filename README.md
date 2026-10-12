# Shipment exceptions, handled before the customer calls

**A business analysis case: from opportunity to production readiness**

> How a short-sea and door-to-door operator could tell customers about delays before they call — framed as a business case, worked out with the people involved, prioritised with the Product Owner, accepted by the business and brought live in a controlled pilot.

> *Independent portfolio case study based on a fictional organisation (Tidewell Logistics). It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data.*

**[Live site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/)** · **[5-minute tour](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/for/recruiters/)** · **[Control tower demo](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/)** · **[Learning Lab](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/learning/)** · **[Start here](START-HERE.md)** · **[Executive case study (PDF)](portfolio/case-study/case-study.pdf)** · **[Evidence matrix](EVIDENCE.md)**

[![CI](https://github.com/phlppgdfry/shipment-exception-management-business-analysis/actions/workflows/ci.yml/badge.svg)](https://github.com/phlppgdfry/shipment-exception-management-business-analysis/actions/workflows/ci.yml)

![65-second walkthrough of the control tower: a sailing delay is classified by the rules, assigned, told to the customer, resolved and audited](portfolio/walkthrough/walkthrough.gif)

*65-second walkthrough of the [control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/) (also as [MP4 on the site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/assets/walkthrough/walkthrough.mp4)). The earlier screens designed in Figma are in [design](docs/07-design/design.md).*

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

## Three ways in

| You are… | Start with | Time |
|---|---|---|
| **a recruiter or hiring manager** | the [5-minute tour](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/for/recruiters/), then the [control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/) guided scenario | 5–10 min |
| **an analyst, PO or developer** | [START-HERE](START-HERE.md) and the [documentation map](docs/00-documentation-map.md) | 30+ min |
| **learning the methods** (Dutch) | the [Learning Lab](learning/README.md) — 10 modules, quizzes, competency tasks, interview defence | ±60 h |

## The problem

Since its new transport management system went live, Tidewell's customers can see statuses in a portal — but not whether their **delivery window** is at risk. They find out at the gate and call. Customer service spends ±38% of its contacts on "where is my load?", planners notice delays by chance and copy them into an Excel sheet, and only key accounts whose account manager happens to know are warned. Three people asked for three different solutions.

## What I did

- **Framed the problem before the solution** — five whys, four options scored with the business, a business case with its riskiest assumption named and a six-week pilot as the way to test it — [options and business case](docs/01-opportunity/options-and-business-case.md)
- **Ran discovery and a big-picture event storming** — contradictions kept, six hotspots, each decided by its owner — [interview notes](docs/02-discovery/interview-notes.md), [event storming](docs/03-workshops/event-storming-board.md), [decision log](docs/03-workshops/decision-log.md)
- **Modelled the process** in BPMN 2.0 (valid `.bpmn` files) and the release in UML — [AS-IS](docs/04-process/as-is.md), [TO-BE](docs/04-process/to-be.md), [UML](docs/04-process/uml.md)
- **Wrote the exception rules** as one decision table — also as **DMN 1.3** — and the 30 examples **run as tests in CI**; a second test checks that the DMN and the code agree on 912 combinations — [rules](docs/05-requirements/exception-rules.md), [feature file](docs/06-backlog/features/exception-decision.feature), [DMN](docs/05-requirements/dmn/exception-decisions.dmn)
- **Prepared the backlog with the PO** — story map, WSJF with the trade-offs she made, a two-sprint pilot — [prioritisation](docs/06-backlog/prioritisation.md), [user stories](docs/06-backlog/user-stories.md); and a **second iteration**: release 2 (EDI/API status messages) refined into slices with criteria and open questions — [release 2](docs/06-backlog/release-2-edi-status.md)
- **Designed the screens** in Figma and as a clickable prototype on the same rules — [design](docs/07-design/design.md), [prototype](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/prototype/)
- **Took it through delivery** — refinement, sprint review demo, a retro action on my own mistake — [refinement log](docs/08-delivery/refinement-log.md)
- **Specified the solution for the team** — conceptual architecture (proposed vs. implemented), OpenAPI contract, idempotency and failure handling, data model and state machines, security and privacy — [architecture](docs/12-architecture/README.md)
- **Built a working demo on the same rules** — the [Logistics Control Tower](demo/README.md) runs the release end to end with a guided scenario; building it exposed five open questions and a privacy leak in the first customer API
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
| [`demo/`](demo/README.md) | the control tower (Next.js, TypeScript), deterministic mock data, the OpenAPI contract and examples |
| [`learning/`](learning/README.md) | Dutch learning lab: 10 modules, quizzes with separate answer keys, competency tasks, interview preparation, AI provenance |
| [`portfolio/`](portfolio/README.md) | executive case study (PDF), interview deck, screenshots, CV text |
| `scripts/` | BPMN generator, link checker, repository quality gate (`validate_repo.py`), learning-page builder, deck builder, test-results recorder |
| [`PROJECT-ROADMAP.md`](PROJECT-ROADMAP.md) | charter, acceptance criteria for this repository, status and remaining gaps |
| [`application-kit/`](application-kit/) | one-page summary (EN + NL), 5-minute walkthrough, stakeholder deck |

Companion case on the same fictional operator, from the functional analyst's side: [late booking amendments](https://github.com/phlppgdfry/shortsea-booking-functional-analysis).

## How this repository was made

The case and the materials were built with AI assistance (Claude). What the owner has reviewed, changed and can do independently is tracked openly in [`learning/ai-provenance.md`](learning/ai-provenance.md) — and starts at zero, because files existing proves nothing. Automated checks are real and run in CI; the [test results](docs/09-acceptance/test-results.md) page records what was actually executed.

## Notes on realism and assumptions

The organisation, people, numbers, workshops and BAT are fictional; their shape is not. The case keeps the mess a real team meets: three stakeholders asking for three solutions, a SaaS supplier whose roadmap you cannot count on, hauliers who do not use the app, 28% of orders without a delivery window, an account manager and a planner who want opposite things, a GDPR question about consignees, and a BAT defect that came from my own refinement answer. The rule module exists to prove the rules are precise enough to build and test — not to suggest that the analyst writes production code.

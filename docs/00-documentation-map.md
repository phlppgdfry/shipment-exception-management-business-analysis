# Documentation map

> **What this is:** every document in the case, in the order of the journey. **For:** anyone who wants to read more than the [start page](../START-HERE.md).

| # | Step | Document | Answers |
|---|---|---|---|
| 01 | Frame the opportunity | [Problem statement](01-opportunity/problem-statement.md) | What is the real problem, and how big? |
| | | [Options and business case](01-opportunity/options-and-business-case.md) | Which option, is it worth it, what is the riskiest assumption? |
| | | [KPI tree](01-opportunity/kpi-tree.md) | How do we know it worked? |
| | | [Strategic analysis](01-opportunity/strategic-analysis.md) | Which capabilities are weak? SWOT? |
| | | [Registers](01-opportunity/registers.md) | Assumptions, constraints, risks, dependencies |
| 02 | Discover | [Context](02-discovery/context.md) | Who is the organisation, which systems, what is in scope? |
| | | [Stakeholders](02-discovery/stakeholders.md) | Who wants what, who decides (RACI)? |
| | | [Interview notes](02-discovery/interview-notes.md) | What did people say — and where do they contradict each other? |
| | | [Glossary](02-discovery/glossary.md) | What do our words mean? |
| | | [Research register](02-discovery/sources.md) | Which statements rest on public sources, which are assumptions? |
| 03 | Event storm | [Facilitation plan](03-workshops/event-storming-plan.md) | How was the workshop run, and why? |
| | | [Board](03-workshops/event-storming-board.md) | What does the domain look like on one timeline? |
| | | [Facilitating a disagreement](03-workshops/workshop-dialogue.md) | How do you get from two positions to one decision owner? |
| | | [Decision log](03-workshops/decision-log.md) | What was decided, by whom, why? |
| 04 | Model | [AS-IS](04-process/as-is.md) · [TO-BE](04-process/to-be.md) · [gap analysis](04-process/gap-analysis.md) · [UML](04-process/uml.md) | How does it work today and tomorrow, and what exactly changes? |
| 05 | Define the rules | [Exception rules](05-requirements/exception-rules.md) | When is something an exception, how bad, who acts, who is told? |
| | | [Requirements](05-requirements/requirements.md) | BR / FR / NFR / data quality |
| | | [Traceability](05-requirements/traceability.md) | Does every pain point reach a test and a KPI? |
| 06 | Prioritise and specify | [Product vision & roadmap](06-backlog/product-vision-and-roadmap.md) · [Release 2 refined: EDI/API status](06-backlog/release-2-edi-status.md) · [Story map](06-backlog/story-map.md) · [User stories](06-backlog/user-stories.md) · [Prioritisation](06-backlog/prioritisation.md) · [DoR / DoD](06-backlog/definition-of-ready-done.md) | What do we build first, and when is it ready / done? |
| | | [Decision examples](06-backlog/features/exception-decision.feature) · [Workbench and messages](06-backlog/features/workbench-and-messages.feature) · [Release 2 EDI/API](06-backlog/features/release-2-edi-status.feature) · [DMN](05-requirements/dmn/exception-decisions.dmn) | Acceptance criteria in Gherkin; decisions in DMN |
| 07 | Design | [Personas & journeys](07-design/personas-and-journeys.md) · [UX specification](07-design/ux-specification.md) · [Usability test plan](07-design/usability-test-plan.md) (not yet run) · [Design](07-design/design.md) | For whom, which flows and states, and why each decision? |
| 08 | Deliver | [Roles](08-delivery/roles-and-responsibilities.md) · [Sprint plan](08-delivery/sprint-plan.md) · [Refinement log](08-delivery/refinement-log.md) · [Review & retro](08-delivery/sprint-review.md) | How was it delivered? |
| 09 | Test & accept | [Test strategy](09-acceptance/test-strategy.md) · [Test cases](09-acceptance/test-cases.md) · [Test results](09-acceptance/test-results.md) · [BAT plan](09-acceptance/bat-plan.md) · [BAT log](09-acceptance/bat-log.md) | Does it work, and does the business accept it? |
| 10 | Go live | [Release readiness](10-go-live/release-readiness.md) · [Communication plan](10-go-live/communication-plan.md) · [Support handover](10-go-live/support-handover.md) · [Release note](10-go-live/release-note.md) | Is it ready for production and understood by everyone? |
| 11 | Measure | [Benefits review](11-measure/benefits-review.md) | Did it work — and do we fund release 2? |
| 12 | Architecture | [Overview](12-architecture/README.md) · [Integration & API](12-architecture/integration-and-api.md) · [Data & states](12-architecture/data-model-and-states.md) · [Security, privacy, observability](12-architecture/security-privacy-observability.md) | How is it built (proposed) and what does the demo implement? |
| 13 | Quality | [Three reviews](13-quality/reviews.md) | What did a senior BA, a hiring manager and an instructor find? |

**IDs used across documents:** P = pain point · A / C / R / DEP = assumption, constraint, risk, dependency · S / RQ = source, research question · OQ = open question · TA = TMS assumption · EF = exception flow · UX = UX decision · TC = test case · BR / FR / NFR / DQ = requirements · ER = exception rule · D = decision · H = hotspot · US / EN = story / enabler · AC = acceptance criterion · BAT = acceptance scenario · DEF = finding · K = KPI.

Outside `docs/`: the [control tower demo](../demo/README.md), the [learning lab](../learning/README.md) (Dutch) and the [portfolio material](../portfolio/README.md).

**Data:** [`data/ba-workbook.xlsx`](../data/ba-workbook.xlsx) — business case, sensitivity, option scoring, WSJF, BAT log and traceability with formulas; CSV mirrors in the same folder.

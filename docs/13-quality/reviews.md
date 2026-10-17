# Three independent reviews

> **What this is:** three critical reviews of the whole repository, each from a different perspective, with what was found and what was changed. **For:** the owner, and reviewers who want to see the repository judged by its own standards. **Previous:** [benefits review](../11-measure/benefits-review.md) · **Back to:** [documentation map](../00-documentation-map.md).

*Method: each review read the repository as its persona would — the senior BA from the documents, the hiring manager from the site and the PDF, the instructor from the learning lab — and listed findings before any fix. "Fixed" means a change is in the repository; "open" means it is recorded here and not resolved. The reviews were carried out with AI assistance; the owner has not yet reviewed them (see [AI provenance](../../learning/ai-provenance.md)).*

---

## Review A — senior business analyst

**Question:** would this convince me that the author understands practical business analysis?

**Overall:** yes, on method — the problem is framed before solutions, decisions sit with owners, rules are testable, and the case shows its own mistakes. The risk is volume: a reviewer may suspect the artefacts were generated rather than worked through. The defence is the [learning lab](../../learning/README.md) and honest provenance, not more documents.

| # | Finding | Severity | Action | Status |
|---|---|---|---|---|
| A1 | Benefits review said "week-6 readout" while the heading and the pilot plan put the stage gate in week 12 | minor (inconsistency) | wording aligned to week 12 | **fixed** |
| A2 | Context said the TMS spike was in sprint 1; registers and sprint plan say sprint 0 | minor | duplicated assumptions table in context replaced by a pointer to the register | **fixed** |
| A3 | IT architect and security appeared in D-03 but not in the stakeholder analysis | moderate | added to the stakeholder matrix | **fixed** |
| A4 | The demo shows UK time in the workbench, while refinement Q10 decided the planner's local time there | moderate | Implemented 2026-10-17: planner Europe/Brussels, customer Europe/London; DST-safe inputs and regression tests | **fixed** (implemented) |
| A5 | The lifecycle had gaps (recover before acknowledge; late again after recovery; pending message when recovering) | significant | found by building the demo; OQ-01, OQ-03, OQ-04 answered as proposals; state diagram updated | **fixed** (proposal) |
| A6 | Held (missing-status) exceptions have a response time but no escalation path | moderate | decided in D-09 (escalate, stay held); timer boundary event in the TO-BE; tested (TC-33) | **fixed** |
| A7 | Customer tracking API first exposed internal severity and message status | significant (privacy) | public message projection + unit and contract tests | **fixed** |
| A8 | Benefits counted as euros for freed customer-service time could be read as headcount savings | minor | already stated as capacity, not headcount, in the business case | no change |
| A9 | KPI targets labelled "week 6" mean "after the pilot"; ambiguous | minor | column renamed "Target (after 6 pilot weeks)" | **fixed** |
| A12 | The TO-BE modelled the response time as a gateway; a clock running during a task is a timer boundary event | moderate (notation) | interrupting timer on "Acknowledge", non-interrupting timer on "Hold"; shift lead got its own lane | **fixed** |
| A13 | Out-of-order events were only proposed | moderate (technical depth) | implemented in the demo with tests (TC-34) | **fixed** |
| A10 | The business case has no discounting or NPV | minor | stated as a limitation in [defend your case](../../learning/interview-preparation/defend-your-case.md) | **open** (by design) |
| A11 | No real stakeholder validation of any artefact | inherent | every artefact lists what to validate; [EVIDENCE.md](../../EVIDENCE.md) says what is not claimed | **open** (inherent to a portfolio case) |

---

## Review B — hiring manager for an IT business analyst role in logistics

**Question:** read against a typical IT business analyst vacancy in an Agile logistics IT team, what does the portfolio prove, how well, and what is left?

*This review uses the generic requirements of such vacancies. A version against a specific vacancy is kept outside the public repository.*

| Vacancy requirement | Supporting artefact | Evidence quality | Remaining gap |
|---|---|---|---|
| Analyse business needs, challenges and opportunities | [problem statement](../01-opportunity/problem-statement.md), [options & business case](../01-opportunity/options-and-business-case.md), [capability map & SWOT](../01-opportunity/strategic-analysis.md) | **strong** — reasoning visible, alternatives rejected with reasons | real data and a real sponsor |
| Translate needs into user stories, flows and acceptance criteria | [stories](../06-backlog/user-stories.md), [BPMN](../04-process/to-be.md), [feature file](../06-backlog/features/exception-decision.feature) | **strong** — criteria executable in CI | stories never challenged by a real team |
| Facilitate workshops (event storming, refinement) | [plan](../03-workshops/event-storming-plan.md), [dialogue](../03-workshops/workshop-dialogue.md), [refinement log](../08-delivery/refinement-log.md) | **medium** — technique sound, practice simulated | facilitating a real group |
| Designs and mock-ups in Figma / FigJam | Figma file, [UX specification](../07-design/ux-specification.md), [control tower](../../demo/README.md) | **strong** for design reasoning; medium for Figma depth | usability test with real users; control tower not in Figma |
| Support PO, SM and team on the backlog | [WSJF](../06-backlog/prioritisation.md), [roadmap](../06-backlog/product-vision-and-roadmap.md), [roles](../08-delivery/roles-and-responsibilities.md) | **medium–strong** | experience in a professional Scrum team |
| Agile ceremonies, documentation, testing | [sprint plan](../08-delivery/sprint-plan.md), [test strategy](../09-acceptance/test-strategy.md), [test results](../09-acceptance/test-results.md) | **strong** on documentation and testing; simulated on ceremonies | — |
| Guide application support; Business Acceptance Testing | [BAT plan/log](../09-acceptance/bat-log.md), [support handover](../10-go-live/support-handover.md) | **medium** — format and decisions, simulated | running a real BAT |
| Production readiness, understood by all stakeholders | [go/no-go](../10-go-live/release-readiness.md), [communication plan](../10-go-live/communication-plan.md) | **medium–strong** | a real go-live |
| Logistics sector experience (plus) | [context](../02-discovery/context.md), [sources](../02-discovery/sources.md), learning module 8 | **weak–medium** — domain understanding from public sources | work experience in the sector |
| Tools: UML, Figma, FigJam, Excel, PowerPoint, Visio/Visual Paradigm | `.bpmn`, UML in Mermaid, Figma/FigJam, Excel workbook, decks | **medium** — Visio/Visual Paradigm not used | the specific modelling tool of the team |
| Higher education degree (e.g. bachelor) | — | **not addressed** — a portfolio is not equivalent to formal education | depends on the candidate; must be answered honestly in the CV |
| Several years as an IT business analyst | — | **not addressed** — the case is not professional experience | must be answered honestly; see the [transfer story](../../learning/interview-preparation/transfer-story.md) |
| Fluent Dutch and English | English deliverables, Dutch learning lab | indirect | the interview |

**Hiring manager's summary:** a convincing demonstration of *how* the candidate would work, with unusually honest labelling. It does not replace formal education or years of team experience, and it should not be presented as if it does. It earns a conversation; the interview has to test ownership.

---

## Review C — learning instructor

**Question:** can the owner genuinely learn the concepts and defend the deliverables independently?

| # | Finding | Action | Status |
|---|---|---|---|
| C1 | Without a schedule, ten modules invite skimming | six-week schedule with daily retrieval practice added to the [learning README](../../learning/README.md) | **fixed** |
| C2 | Model answers next to exercises would be read first | answer keys and reference solutions in separate folders; quizzes contain no answers (checked in CI) | **fixed** |
| C3 | Several answer-key entries gave a letter without reasoning | reasoning added for every answer | **fixed** |
| C4 | A progress tracker filled in by the generator would be meaningless | tracker and AI-provenance table start at "not started" / level 0; levels require own work as evidence | **fixed** (by design) |
| C5 | Module 6 assumes basic web knowledge | plain-language REST section; tutorial with 8 review questions; Swagger Editor exercise | partly — no video or external course linked |
| C6 | Figma exercises need an account | FigJam/paper alternative given | **fixed** |
| C7 | Event storming can only be learned by doing | module 1 and T2 require a role-played conversation; the honest gap is stated | **open** (needs a real group) |
| C8 | The learner may never be assessed by someone else | competence defined as "assessed by someone else or after a day's distance" | **open** — depends on the owner |
| C9 | No check that the owner can run the tests and tools | module 3 and 7 tutorials require running the tests; module 2 requires editing the `.bpmn` | **fixed** |

**Instructor's summary:** the materials are sufficient to learn and defend the case **if the owner does the exercises**. The single biggest risk is reading instead of practising. The ownership levels in [AI provenance](../../learning/ai-provenance.md) are the honest measure; today they are all 0.

---

[Documentation map](../00-documentation-map.md)

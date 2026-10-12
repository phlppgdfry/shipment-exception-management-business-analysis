# Roles and responsibilities — who does what, and who decides

> **What this is:** the division of work between the IT business analyst and everyone else in and around the Scrum team, with the moments where the line is easy to cross. **For:** the team, stakeholders, and anyone who asks "isn't that the PO's job?". **Previous:** [sprint plan](sprint-plan.md) · **Next:** [refinement log](refinement-log.md).

*The Scrum Guide (S-12 in the [research register](../02-discovery/sources.md)) names three accountabilities: Product Owner, Scrum Master and Developers. It has no "business analyst". In this case the BA works **in the team as one of the Developers** in the Scrum sense, with an analysis specialism, and supports the PO — without taking over the PO's decisions.*

## One table

| Role | Owns (accountable for) | Does (responsible for) | Does **not** do |
|---|---|---|---|
| **IT business analyst** | the quality of the analysis: problem framing, rules, stories, acceptance criteria, traceability | discovery and workshops; process and rule modelling; prepares options with consequences; writes stories and criteria with the team; designs screens; organises BAT; prepares go/no-go and handover | decide priority or scope; accept stories on the PO's behalf; promise dates; answer customer-facing questions alone (the DEF-04 lesson) |
| **Product Owner** | the product backlog and its order; value; scope; release decision | decides trade-offs (D-02, D-07, WSJF), accepts increments, owns the rule **parameters** | write every story herself; facilitate the workshops |
| **Scrum Master** | the team's effectiveness and the Scrum events | runs ceremonies, removes impediments, protects the sprint, hypercare roster | decide content or priority |
| **Developers** (incl. tester) | the increment and its technical quality | estimate, design and build; test; refine with the BA; demo | decide what the business needs |
| **QA / tester** | evidence that the software does what the stories say | test design (incl. negative and boundary cases), regression, system test; BAT support | sign off on business acceptance |
| **Application support** | supportability after go-live; end-user documentation | first/second line; KB article; monitoring | write the analysis |
| **Business stakeholders / key users** | that the solution fits their work | supply knowledge; test in BAT; sign off | design the solution |
| **Sponsor (COO)** | funding and the stage gate | decides on release 2 with the PO | day-to-day priority |

## Where the lines blur — and how this case handles it

| Situation | Temptation | What the BA does instead | Evidence |
|---|---|---|---|
| Three stakeholders ask for three solutions | Pick the most reasonable one | Reframe as one problem; put options with consequences in front of the PO | [problem statement](../01-opportunity/problem-statement.md), [options](../01-opportunity/options-and-business-case.md) |
| A hotspot in the event storming | Decide it on the spot as facilitator | Name an owner and a date; prepare options; the owner decides | [decision log](../03-workshops/decision-log.md) |
| A developer asks a customer-facing question in refinement | Answer from your own understanding | Mark it as a PO / customer question; answer within a day | [retro sprint 2](sprint-review.md#retrospective-sprint-2) (DEF-04 came from skipping this) |
| A stakeholder asks "can you just add…" | Add it to the sprint | Add to the backlog with a "so that"; the PO orders it | [prioritisation](../06-backlog/prioritisation.md) |
| BAT finds a major issue on Thursday | Decide go-live yourself | Triage with the PO; prepare the go/no-go evidence; the PO decides | [BAT log](../09-acceptance/bat-log.md), [release readiness](../10-go-live/release-readiness.md) |
| Thresholds need to change after the pilot | Edit the rule table | The PO changes the parameter; the BA updates the examples; CI shows what changed meaning | [exception rules](../05-requirements/exception-rules.md#why-these-thresholds) |

## The BA in each Scrum event

| Event | BA's contribution | Output |
|---|---|---|
| **Backlog refinement** (weekly, 60 min) | Brings stories that meet the Definition of Ready draft; walks the rules and examples; captures questions with an owner | refined stories, [refinement log](refinement-log.md) |
| **Sprint planning** | Explains the sprint goal in business terms; confirms dependencies are ready | sprint backlog |
| **Daily scrum** | Picks up domain questions the same day | unblocked developers |
| **Sprint review** | Prepares the demo script with the developer who demos; invites the stakeholders who asked | feedback → backlog ([review](sprint-review.md)) |
| **Retrospective** | Takes part as a team member; brings one improvement on the analysis side | retro action |

## Dependencies and blockers in release 1

From the [dependency register](../01-opportunity/registers.md#dependencies). The BA tracks them; the Scrum Master escalates impediments; the PO decides when a dependency changes scope.

| Blocker | Hit | Handled by | How |
|---|---|---|---|
| TMS webhook behaviour unknown | sprint 0 | team + supplier | time-boxed 2-day spike (A-01 confirmed) |
| Delivery window missing on 28% of orders | sprint 0 | PO + TMS PO | EN-2 + FR-03 default ([D-06](../03-workshops/decision-log.md#d-06)) |
| CS tool has no task API | sprint 2 | PO | R1 workaround: e-mail to the CS queue (DEF-06 known issue) |
| Key users' time for BAT | week 3 | Scrum Master | blocked in calendars by their managers (R-08) |

---

[Documentation map](../00-documentation-map.md) · Next: [Refinement log →](refinement-log.md)

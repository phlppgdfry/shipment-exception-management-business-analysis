# Start here

> Independent portfolio case — fictional organisation. Pick the path that fits your time and your reason for being here.

## 1. Reviewing the portfolio

**2 minutes**
1. [5-minute tour for recruiters](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/for/recruiters/) — or the [live site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/)
2. [One-page summary](application-kit/executive/one-page-summary.md) ([Nederlands](application-kit/executive/samenvatting-nl.md))

**10 minutes**
3. [Control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/) — follow the guided scenario on the right (±3 min)
4. [Executive case study (PDF, 5 pages)](portfolio/case-study/case-study.pdf)
5. [Evidence matrix](EVIDENCE.md) — what is shown and what is **not** claimed
6. [Test results](docs/09-acceptance/test-results.md) — what was actually executed

**30 minutes**
7. [Options and business case](docs/01-opportunity/options-and-business-case.md) — including the riskiest assumption
8. [Event storming](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/event-storming/) → [facilitating a disagreement](docs/03-workshops/workshop-dialogue.md) → [decision log](docs/03-workshops/decision-log.md)
9. [AS-IS and TO-BE in BPMN](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/process/) → [gap analysis](docs/04-process/gap-analysis.md)
10. [Exception rules](docs/05-requirements/exception-rules.md) → [executable examples](docs/06-backlog/features/exception-decision.feature)
11. [Architecture: proposed vs. implemented](docs/12-architecture/README.md)
12. [BAT log](docs/09-acceptance/bat-log.md) → [go/no-go](docs/10-go-live/release-readiness.md)
13. [Three independent reviews](docs/13-quality/reviews.md) and [repository status](PROJECT-ROADMAP.md)

## 2. Running the demo locally

Requires Node.js 22+.

```bash
git clone https://github.com/phlppgdfry/shipment-exception-management-business-analysis.git
cd shipment-exception-management-business-analysis/demo/application
npm ci
npm run dev            # http://localhost:3000
```

Tests and checks (from the repository root unless noted):

```bash
node --test tests/*.test.mjs                 # 30 acceptance examples against the rule module
python3 scripts/validate_repo.py             # deliverables, IDs, traceability, BPMN, learning lab
python3 scripts/check-links.py               # documentation links
cd demo/application
npm run lint && npm run typecheck && npm test
BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
npx playwright install chromium && npm run test:e2e
```

Everything about the demo: [demo/README.md](demo/README.md).

## 3. Exploring the case

| Journey step | Best documents |
|---|---|
| Frame the opportunity | [problem](docs/01-opportunity/problem-statement.md), [strategic analysis](docs/01-opportunity/strategic-analysis.md), [options and business case](docs/01-opportunity/options-and-business-case.md), [KPI tree](docs/01-opportunity/kpi-tree.md), [registers](docs/01-opportunity/registers.md) |
| Discover | [context](docs/02-discovery/context.md), [sources](docs/02-discovery/sources.md), [stakeholders](docs/02-discovery/stakeholders.md), [interview notes](docs/02-discovery/interview-notes.md), [glossary](docs/02-discovery/glossary.md) |
| Event storm | [plan](docs/03-workshops/event-storming-plan.md), [board](docs/03-workshops/event-storming-board.md), [dialogue](docs/03-workshops/workshop-dialogue.md), [decision log](docs/03-workshops/decision-log.md) |
| Model | [AS-IS](docs/04-process/as-is.md), [TO-BE](docs/04-process/to-be.md), [gap analysis](docs/04-process/gap-analysis.md), [UML](docs/04-process/uml.md) |
| Define the rules | [exception rules](docs/05-requirements/exception-rules.md), [requirements](docs/05-requirements/requirements.md), [traceability](docs/05-requirements/traceability.md) |
| Prioritise | [vision & roadmap](docs/06-backlog/product-vision-and-roadmap.md), [story map](docs/06-backlog/story-map.md), [prioritisation](docs/06-backlog/prioritisation.md), [DoR / DoD](docs/06-backlog/definition-of-ready-done.md) |
| Specify & design | [user stories](docs/06-backlog/user-stories.md), [features](docs/06-backlog/features/exception-decision.feature), [personas & journeys](docs/07-design/personas-and-journeys.md), [UX specification](docs/07-design/ux-specification.md), [design](docs/07-design/design.md) |
| Architecture | [overview](docs/12-architecture/README.md), [integration & API](docs/12-architecture/integration-and-api.md), [data & states](docs/12-architecture/data-model-and-states.md), [security & privacy](docs/12-architecture/security-privacy-observability.md), [OpenAPI](demo/mock-apis/openapi.yaml) |
| Deliver | [roles](docs/08-delivery/roles-and-responsibilities.md), [sprint plan](docs/08-delivery/sprint-plan.md), [refinement log](docs/08-delivery/refinement-log.md), [review & retro](docs/08-delivery/sprint-review.md) |
| Test & accept | [test strategy](docs/09-acceptance/test-strategy.md), [test cases](docs/09-acceptance/test-cases.md), [test results](docs/09-acceptance/test-results.md), [BAT plan](docs/09-acceptance/bat-plan.md), [BAT log](docs/09-acceptance/bat-log.md) |
| Go live & measure | [readiness](docs/10-go-live/release-readiness.md), [communication](docs/10-go-live/communication-plan.md), [support handover](docs/10-go-live/support-handover.md), [release note](docs/10-go-live/release-note.md), [benefits review](docs/11-measure/benefits-review.md) |

Everything is indexed in the [documentation map](docs/00-documentation-map.md).

## 4. Starting the learning curriculum (Dutch)

1. Read the [Learning Lab README](learning/README.md) — curriculum, six-week schedule, how competence is earned.
2. Start with [module 1](learning/modules/01-ba-fundamentals/README.md); put your own answers in [`learning/my-work/`](learning/my-work/README.md).
3. Quiz yourself on the [interactive page](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/learning/).
4. Track your level in the [progress tracker](learning/progress-tracker.md) and the [AI provenance table](learning/ai-provenance.md).
5. Finish with the [competency tasks](learning/assessment/README.md) — reference solutions are kept separate.

## 5. Preparing for interviews

- [45 questions](learning/interview-preparation/questions.md) with strong and weak answers and follow-ups
- [Defend your case](learning/interview-preparation/defend-your-case.md) — 12 artefacts × 8 questions
- [Simulations](learning/interview-preparation/simulations.md) and the [transfer story](learning/interview-preparation/transfer-story.md)
- [Interview deck (10 slides)](portfolio/presentation/interview-deck.pptx) with a [talk track](portfolio/presentation/README.md)
- [CV project description](portfolio/cv-description.md) — use only claims that match your ownership level

## 6. Publishing

The repository is public and published with GitHub Pages: every push to `main` runs [CI](.github/workflows/ci.yml) and [deploys the site](.github/workflows/pages.yml), including the control tower (built from `demo/application`) and the learning page. Before sharing a link, check that both workflows are green. To change the published site, edit `site/`, the demo or the learning Markdown and run `python3 scripts/build_learning.py` (CI fails if the learning data is stale).

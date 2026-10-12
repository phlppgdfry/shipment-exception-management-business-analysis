# Test strategy

> **What this is:** how release 1 is tested — which levels, who tests what, which evidence counts — and how this repository's own automated tests relate to the (simulated) team testing and BAT. **For:** tester, team, PO, application support. **Previous:** [sprint review](../08-delivery/sprint-review.md) · **Next:** [test cases](test-cases.md).

## Two kinds of evidence — kept apart on purpose

| | What it is | Where | Status |
|---|---|---|---|
| **Executed in this repository** | Automated tests that run in CI on every push: rule examples, engine and contract tests, browser tests of the demo including accessibility | [test results](test-results.md) | **real** — produced by running the tests; never marked passed by hand |
| **Simulated delivery evidence** | The fictional team's system test, BAT with key users, findings and sign-off | [BAT plan](bat-plan.md), [BAT log](bat-log.md) | **illustrative** — shows the format and the decisions, not real results |

A test is only called "passed" in this repository when a tool ran it and reported it. The demo's BA workspace shows the result of the acceptance-example run **of that build**, with timestamp and commit.

## Test levels

| Level | Question | Who (in the case) | How (in this repo) | Entry / exit |
|---|---|---|---|---|
| **Rule examples** | Are the rules precise and do they do what the PO decided? | BA writes, tester reviews, CI runs | 30 Gherkin examples executed against the rule module (`node --test`) | every change to a rule or example / all green |
| **Unit and lifecycle** | Does the component handle states, timing, permissions and errors? | developers | Vitest: scenario, lifecycle, permissions, idempotency | every push / all green |
| **Contract** | Do responses match the agreed API? | developers + tester | Vitest contract test against `openapi.yaml`; Redocly lint | every push / all green |
| **System / end-to-end** | Does a user get through the workflow? | tester | Playwright: the 10-step scenario, workbench behaviours, routes | every push / all green |
| **Accessibility** | Can everyone use the workbench and the portal card? | tester + designer | axe-core (WCAG 2.2 A/AA) on every route, desktop and mobile | no serious or critical violations |
| **Non-functional** | Fast enough, idempotent, recoverable? | team | proposed: replayed events, load test against NFR-01, webhook outage (NFR-04) — **demo covers idempotency and the outage path only** | NFR table |
| **BAT** | Is what the stories say what the business needs? | key users, organised by the BA | simulated ([BAT log](bat-log.md)) | [entry/exit](bat-plan.md#entry-and-exit-criteria) |
| **Pilot measurement** | Did it work? | PO, Head of CS | export (US-13); [benefits review](../11-measure/benefits-review.md) | stage gate |

## Techniques used

| Technique | Where it shows up |
|---|---|
| **Boundary value analysis** | 0 / 1 / 119 / 120 / 359 / 360 minutes (AC-01.2 – AC-01.8); exactly 2 h since the last message (AC-07.3); response time 29 vs. 30 min (lifecycle test) |
| **Decision table testing** | the [decision table](../05-requirements/exception-rules.md#decision-table) row by row; a CI check that every rule is exercised by at least one example |
| **State transition testing** | every arrow of the [exception state machine](../12-architecture/data-model-and-states.md#exception-state-machine), plus "invalid" transitions (resolve before acknowledge → 409) |
| **Negative testing** | permissions (403), validation (422), invalid transitions (409), duplicate events, retried commands, TMS outage |
| **Scenario / use-case testing** | the guided scenario; BAT scenarios in the key users' words |
| **Property-style check** | severity never decreases when the delay grows (monotonic thresholds), checked for every minute from −60 to 600 |
| **Exploratory** | BAT Wednesday afternoon: "try to break it with a bad day you remember" |

## Defects

Severity definitions for findings are in the [BAT plan](bat-plan.md#finding-severity) (blocker / major / minor / cosmetic). Life cycle: *new → triaged (PO decides: fix, accept as known issue with a date, or defer) → fixed → retested → closed*. A known issue needs a workaround, an owner and a date before go-live.

## Regression

The rule examples, unit, contract and browser tests are the regression suite. They run on every push to `main` and on pull requests ([CI workflow](../../.github/workflows/ci.yml)). When the PO changes a threshold, the analyst updates the examples first; the failing examples show exactly which decisions change meaning — that list goes to the PO before the change is merged.

## What is not tested here (and why)

| Not tested | Why | Mitigation in the proposed release |
|---|---|---|
| Real TMS webhooks, real e-mail delivery | no real systems | spike (A-01), BAT environment with the supplier |
| Performance under load | the demo runs in a browser | load test against NFR-01 in the BAT environment |
| Bounces (FR-09) | not implemented in the demo | BAT-12 (simulated) |
| Screen-reader walkthrough by a real user | no access to users | axe covers automatable checks only; manual check proposed |

---

[Documentation map](../00-documentation-map.md) · Next: [Test cases →](test-cases.md)

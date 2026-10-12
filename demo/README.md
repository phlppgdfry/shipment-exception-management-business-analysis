# Logistics Control Tower — shipment exception management (demo)

> **What this is:** a working, tested demo of release 1 of the case: exceptions detected by the rules, owned by a planner, told to the customer, resolved and audited. **For:** reviewers who want to see the analysis *behave*, and developers who want to see what "precise enough to build" means. **Back to:** [README](../README.md) · [architecture](../docs/12-architecture/README.md).

**Live:** <https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/> (deployed by the Pages workflow on every push to `main`).

*Fictional organisation and data. The demo runs entirely in the browser on a mock API; nothing is connected to a real TMS.*

## What it shows

| Screen | Route | What to look at | Stories / rules |
|---|---|---|---|
| Operations overview | `/` | Active, on-schedule and delayed shipments, critical and unassigned exceptions, live pilot KPIs, the **guided scenario** | K1, K2, K6, K8 |
| Shipment explorer | `/shipments/` | Search, filter, sort; detail with route legs, milestones and events | ER-01, FR-03 |
| Exception management | `/exceptions/` | Work list most urgent first; acknowledge, assign, register actions, confirm held status, re-plan, resolve with reason; evaluation history and audit trail | US-02, US-03, US-04, US-08, US-11 |
| Customer view | `/track/` | The portal card built only from messages that were sent — no internal data | US-05, US-07, US-10, NFR-05 |
| BA workspace | `/analysis/` | Goals, BPMN, rules, requirements, stories, **executable examples with the actual test result of this build**, traceability, decisions | all |
| Delivery workspace | `/delivery/` | WSJF backlog, sprints, BAT, findings, go/no-go, pilot export (CSV) | US-13 |

## The guided scenario (10 steps, ±3 minutes)

Open the overview and follow the panel on the right. Every button calls the same API as the screens.

1. **D2D-48213** (Northfield Foods, key account, reefer) is on schedule: window Thu 06:00–08:00.
2. The sailing system publishes: **E-312 departs 6 h late**.
3. All 11 orders on E-312 are evaluated; only the 4 now expected **after the end of their window** become exceptions (ER-01). Sending the same event again changes nothing (NFR-03).
4. D2D-48213: 280 min late → major → reefer one level up → **critical**; key account → message **and** a call task (ER-02, ER-04, ER-11).
5. The shift lead **assigns** it to the senior planner.
6. The planner **registers a response action** and sends the customer message with a short note (D-08).
7. The **customer view** shows the delay, the new ETA, the reason and the next step.
8. A new window is agreed → **recovered** → "back on schedule" message (ER-13) → **resolved** with reason "new window agreed".
9. The **audit trail** shows every event, decision and change, with who and when.
10. The **acceptance examples** behind these rules, with the result of the test run in this build.

Also try: switch **Acting as** to the terminal coordinator (read-only on road planning, NFR-06); press **+30 min** to see escalation (ER-09); confirm the **held** missing-status exception EX-1008 as "on time" (no customer message, ER-07); tick **Simulate TMS outage** to see the error and retry states.

## How it is built

| Part | Where | Notes |
|---|---|---|
| Rules | [`site/assets/exception-rules.mjs`](../site/assets/exception-rules.mjs) | **The same module** as the prototype, the rule explorer and the CI acceptance examples. The demo never re-implements a rule. |
| Engine | [`application/src/domain/engine.ts`](application/src/domain/engine.ts) | What the rules do not decide: lifecycle (the UML state diagram), timing, idempotency, permissions, messages, audit |
| Mock API | [`application/src/api/mock-api.ts`](application/src/api/mock-api.ts) | Implements the [OpenAPI contract](mock-apis/openapi.yaml) in the browser: latency, RFC 9457 errors, `Idempotency-Key`, a fault switch |
| Contract | [`mock-apis/openapi.yaml`](mock-apis/openapi.yaml) · [`mock-apis/examples/`](mock-apis/examples/) | Proposed REST API; examples generated from the engine; a contract test checks both |
| Data | [`mock-data/generate.mjs`](mock-data/generate.mjs) | Deterministic (seeded) generator: 10 customers (5 pilot, 5 control), 6 sailings, 35 orders, the morning's events. The app replays the events at start-up, so every exception on screen was produced by the rules |
| Case data | [`application/scripts/build-case-data.mjs`](application/scripts/build-case-data.mjs) | Reads requirements, stories, examples, backlog, BAT and readiness **from the docs** at build time, and runs the acceptance examples to record their real result |
| UI | Next.js 16 (static export), React 19, TypeScript, Tailwind CSS 4 | No component library, no paid services, no secrets |

Proposed (enterprise) architecture vs. this demo: [docs/12-architecture](../docs/12-architecture/README.md).

## Run it locally

Requirements: Node 22 or later.

```bash
cd demo/application
npm ci
npm run dev                # http://localhost:3000 (regenerates case data first)
npm test                   # unit + contract tests (Vitest)
npm run lint && npm run typecheck
BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
npx playwright install chromium
npm run test:e2e           # scenario, workbench, routes, accessibility (axe) on desktop and mobile
```

Regenerate the mock data after changing the generator: `node demo/mock-data/generate.mjs` (CI fails if the JSON is out of date).

## Known limitations (honest list)

- **One active exception per order.** A new cause on the same order updates the active exception instead of opening a second one. The proposed service may need both (see [DEF-04](../docs/09-acceptance/bat-log.md)); throttling is per order either way.
- **No delivery simulation.** Advancing the clock escalates and sends pending messages, but shipments do not move to "delivered", so resolved exceptions do not reach *closed*.
- **Held exceptions do not escalate.** The UML diagram has no Held → Escalated transition; the demo shows "respond by" but leaves it to the planner. Recorded as open question OQ-02 in the [architecture](../docs/12-architecture/README.md#open-questions-found-while-building-the-demo).
- **No bounce handling (FR-09)** and no EDI/API status messages (US-06, release 2).
- **State lives in your browser tab** (sessionStorage). "Reset demo" starts the day again.
- **Time zones:** everything is shown in UK local time. That is right for customer messages, but refinement Q10 decided the workbench shows the *planner's* local time — a planner in Belgium would see +1 h. Window inputs are UK time (in the demo week, February, UK time equals UTC).

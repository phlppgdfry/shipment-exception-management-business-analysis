# Test results — what was actually executed

> **What this is:** the result of running every automated check in this repository, written by `scripts/record-test-results.mjs`. **For:** reviewers who want evidence, not claims. **Previous:** [BAT log](bat-log.md) · **Next:** [release readiness](../10-go-live/release-readiness.md).

| | |
|---|---|
| Run | 2026-10-12 01:15 UTC |
| Commit | `a7a1610` |
| Environment | Node v24.21.0, darwin 24.6.0 |
| Automated tests | **100 of 100 passed** |

This page contains only **executed** results. The fictional team's system test and the Business Acceptance Testing with key users are **simulated** and live in the [BAT log](bat-log.md) — they are not test results of this repository. The same checks run in [CI](../../.github/workflows/ci.yml) on every push; the CI run of a commit is the authoritative result for that commit.

## Summary

| Suite | Tool | Tests | Passed | Result | Time |
|---|---|---:|---:|---|---:|
| Acceptance examples against the rule module | node --test | 34 | 34 | ✅ pass | 0.1 s |
| Engine, lifecycle and API contract | Vitest | 41 | 41 | ✅ pass | 0.7 s |
| Browser: scenario, workbench, routes, accessibility (axe, WCAG 2.2 A/AA) | Playwright + axe-core | 25 | 25 | ✅ pass | 12.9 s |

| Check | Command | Result |
|---|---|---|
| ESLint | `cd demo/application && npm run lint` | ✅ pass |
| TypeScript | `cd demo/application && npm run typecheck` | ✅ pass |
| Production build (static export) | `npm run build` | ✅ pass |
| Mock data up to date | `node demo/mock-data/generate.mjs --check` | ✅ pass |
| OpenAPI lint (Redocly) | `npx @redocly/cli lint demo/mock-apis/openapi.yaml` | ✅ pass |
| Documentation links | `python3 scripts/check-links.py` | ✅ pass |
| Repository quality gate (deliverables, IDs, traceability, test names, BPMN, learning lab) | `python3 scripts/validate_repo.py` | ✅ pass |



## Every test

<details><summary><b>Acceptance examples against the rule module</b> — 34/34</summary>

| Test | Result |
|---|---|
| at least one executable feature file exists | passed |
| AC-01.1 Later than planned but inside the window | passed |
| AC-01.2 Exactly at the end of the window is still on time | passed |
| AC-01.3 One minute late: minor, monitored, not notified | passed |
| AC-01.4 Minor, customer asked for every update | passed |
| AC-01.5 119 minutes late is still minor | passed |
| AC-01.6 120 minutes late is major | passed |
| AC-01.7 359 minutes late is still major | passed |
| AC-01.8 360 minutes late is critical | passed |
| AC-01.9 Delivery moves to the next day: slot lost | passed |
| AC-01.10 Reefer one hour late goes up one level | passed |
| AC-01.11 Reefer three hours late becomes critical | passed |
| AC-01.12 Cancelled sailing is critical even if ETA is fine | passed |
| AC-02.1 Terminal delay is owned by terminal operations | passed |
| AC-09.1 Customs hold: customs desk, customer must act | passed |
| AC-09.2 Customs hold on a reefer is critical | passed |
| AC-09.3 Customs request is never throttled | passed |
| AC-08.1 Missing status: planner acts, customer not yet | passed |
| AC-08.2 Missing status on a reefer is critical, still held | passed |
| AC-08.3 Planner confirms a real delay: normal road delay | passed |
| AC-08.4 Planner confirms the truck is on time: no alarm | passed |
| AC-11.1 Critical for a key account adds a call task | passed |
| AC-11.2 Major for a key account: message, no call | passed |
| AC-11.3 Cancelled sailing for a key account | passed |
| AC-07.1 Same severity within 2 h: no second message | passed |
| AC-07.2 It got worse within 2 h: notify again | passed |
| AC-07.3 Exactly 2 h after the last message: notify again | passed |
| AC-07.4 Better than last time within 2 h: no message | passed |
| AC-07.5 Key account, still critical within 2 h: no 2nd call | passed |
| AC-10.1 Back inside the window after a message | passed |
| AC-10.2 Back inside the window, customer never told | passed |
| every rule the module can fire has a plain-language explanation | passed |
| severity never decreases when the delay grows (monotonic thresholds) | passed |
| prototype seed data uses only known causes and evaluates without errors | passed |

</details>

<details><summary><b>Engine, lifecycle and API contract</b> — 41/41</summary>

| Test | Result |
|---|---|
| contract.test.ts › mock API responses conform to openapi.yaml › event outcome, shipments, exceptions, messages, tracking | passed |
| contract.test.ts › mock API responses conform to openapi.yaml › a duplicate event returns 200 and changes nothing (NFR-03) | passed |
| contract.test.ts › mock API responses conform to openapi.yaml › a refused command returns RFC 9457 problem details with the documented status codes | passed |
| contract.test.ts › mock API responses conform to openapi.yaml › a retried command with the same Idempotency-Key is applied once | passed |
| contract.test.ts › mock API responses conform to openapi.yaml › a TMS outage returns 503 problem details for reads | passed |
| contract.test.ts › example payloads › are generated from the engine when UPDATE_EXAMPLES=1 | passed |
| contract.test.ts › example payloads › tms-event-sailing-delayed.json conforms to TransportEvent | passed |
| contract.test.ts › example payloads › event-outcome-processed.json conforms to EventOutcome | passed |
| contract.test.ts › example payloads › exception-critical.json conforms to Exception | passed |
| contract.test.ts › example payloads › tracking-delayed.json conforms to Tracking | passed |
| contract.test.ts › example payloads › problem-409.json conforms to Problem | passed |
| lifecycle.test.ts › idempotency (NFR-03) › a replayed event opens no second exception and sends no second message | passed |
| lifecycle.test.ts › escalation (ER-09, AC-03.4) › a critical exception not acknowledged within 30 minutes is escalated; the shift lead assigns it (AC-03.5) | passed |
| lifecycle.test.ts › escalation (ER-09, AC-03.4) › a minor exception has no response time and never escalates | passed |
| lifecycle.test.ts › permissions (NFR-06) › a terminal coordinator cannot acknowledge a road-planning exception | passed |
| lifecycle.test.ts › permissions (NFR-06) › only the shift lead assigns | passed |
| lifecycle.test.ts › permissions (NFR-06) › an exception cannot be assigned to someone outside its owner group | passed |
| lifecycle.test.ts › resolution (AC-04.3) › an open exception must be acknowledged before it is resolved | passed |
| lifecycle.test.ts › resolution (AC-04.3) › reason 'other' requires a note (DEF-03) | passed |
| lifecycle.test.ts › resolution (AC-04.3) › a response action needs text | passed |
| lifecycle.test.ts › resolution (AC-04.3) › a re-planned window must end after it starts | passed |
| lifecycle.test.ts › missing status (US-08, ER-07) › held: no customer message; confirmed on time → closed as false alarm, still no message | passed |
| lifecycle.test.ts › missing status (US-08, ER-07) › held: confirmed delay → re-evaluated as a road delay and the customer is told | passed |
| lifecycle.test.ts › missing status (US-08, ER-07) › a held exception cannot be acknowledged before it is confirmed | passed |
| lifecycle.test.ts › recovery before the customer was told › a pending critical message is withdrawn and no recovery message is sent | passed |
| lifecycle.test.ts › call tasks (US-11) › closing a call task requires an outcome; only customer service closes it | passed |
| lifecycle.test.ts › lifecycle table › terminal states have no way out, and every state is reachable from OPEN or HELD | passed |
| lifecycle.test.ts › measurement (US-13) › the pilot export has the AC-13.2 columns and one row per exception | passed |
| lifecycle.test.ts › measurement (US-13) › overview counts are consistent | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 1. the shipment starts on schedule | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 2–3. the sailing delay reaches every order on E-312; only orders outside their window become exceptions (ER-01) | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 4. classification: 280 min late → major, reefer → critical, key account → message + call task | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 5. the shift lead assigns the exception to the senior planner | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 6. the planner registers a response action and sends the message with a note | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 7. the customer view now shows the delay, new ETA and next step — and no driver data (NFR-05) | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 8. a new window is agreed: the order recovers, the customer hears it (ER-13), the planner resolves | passed |
| scenario.test.ts › guided scenario: D2D-48213, reefer for a key account, sailing delayed 6 h › 9. the audit trail tells the story in order | passed |
| scenario.test.ts › the morning replay › starts at 09:50 with the morning's exceptions, all produced by the rules | passed |
| scenario.test.ts › the morning replay › Oakridge was told 'major' at 09:15; the 09:45 update with the same severity is throttled (ER-12) | passed |
| scenario.test.ts › the morning replay › the control group is in shadow mode: exceptions logged, nothing sent (AC-13.1) | passed |
| scenario.test.ts › the morning replay › the cancelled sailing's critical message went out without a note after 5 minutes (D-08) | passed |

</details>

<details><summary><b>Browser: scenario, workbench, routes, accessibility (axe, WCAG 2.2 A/AA)</b> — 25/25</summary>

| Test | Result |
|---|---|
| desktop › route / renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /shipments/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /shipments/D2D-48213/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /exceptions/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /exceptions/?id=EX-1005 renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /track/?ref=D2D-48302 renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /analysis/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › route /delivery/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| desktop › every internal link on the overview resolves | passed |
| mobile › route / renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /shipments/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /shipments/D2D-48213/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /exceptions/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /exceptions/?id=EX-1005 renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /track/?ref=D2D-48302 renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /analysis/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › route /delivery/ renders and passes axe (WCAG 2.2 A/AA) | passed |
| mobile › every internal link on the overview resolves | passed |
| desktop › guided scenario: from on schedule to resolved, with audit trail and test results | passed |
| desktop › a terminal coordinator can read but not change a road-planning exception (NFR-06) | passed |
| desktop › resolving with reason 'other' and no note is refused (AC-04.3) | passed |
| desktop › missing status is held; 'haulier confirms on time' closes it without a customer message (US-08) | passed |
| desktop › an unacknowledged critical exception escalates after 30 minutes (ER-09) | passed |
| desktop › a TMS outage shows an error with retry, and recovers (NFR-04) | passed |
| desktop › shipment explorer: search, filter and open a detail page | passed |

</details>

## Not covered by automated tests

See [test strategy — what is not tested here](test-strategy.md#what-is-not-tested-here-and-why): real TMS webhooks and e-mail, load (NFR-01), out-of-order events, bounces (FR-09), and a screen-reader walkthrough by a real user.

---

[Documentation map](../00-documentation-map.md) · Next: [Release readiness →](../10-go-live/release-readiness.md)

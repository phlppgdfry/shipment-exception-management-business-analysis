# Test cases and requirements-to-tests traceability

> **What this is:** the test cases for release 1 — positive, negative, boundary and exception cases — each linked to the requirement it proves and to the automated test that runs it (if any). **For:** tester, BA, PO. **Previous:** [test strategy](test-strategy.md) · **Next:** [BAT plan](bat-plan.md).

**Automated** = runs in CI in this repository; the name is the test's name, so you can find it in the [test results](test-results.md). **Manual** = designed for the (simulated) team or BAT; no automated run here.

## Rule decisions (boundary and decision-table cases)

The 30 decision examples **are** test cases; they live in [`exception-decision.feature`](../06-backlog/features/exception-decision.feature) and are not repeated here. Coverage per rule:

| Rule | Examples | Kind |
|---|---|---|
| ER-01 window, not plan | AC-01.1, AC-01.2, AC-10.2 | boundary (−30, 0) |
| ER-02 thresholds | AC-01.3 – AC-01.8 | boundary (1, 119, 120, 359, 360) |
| ER-03 next day | AC-01.9 | positive |
| ER-04 time-critical +1 | AC-01.10, AC-01.11, AC-08.2, AC-09.2 | positive |
| ER-05 cancellation | AC-01.12, AC-11.3 | positive, "even if ETA is fine" |
| ER-06 customs | AC-09.1 – AC-09.3 | positive, never throttled |
| ER-07 missing status | AC-08.1 – AC-08.4 | held, confirmed late, confirmed on time |
| ER-08 owner | AC-02.1 + all | positive |
| ER-09 response time | all with `sla` column | positive |
| ER-10 who is told | AC-01.3, AC-01.4 | minor not told unless opted in |
| ER-11 key account call | AC-11.1 – AC-11.3, AC-07.5 | positive, no second call |
| ER-12 throttling | AC-07.1 – AC-07.5 | boundary (exactly 2 h), worse, better |
| ER-13 recovery | AC-10.1, AC-10.2 | told before / never told |

## Workflow, lifecycle and integration

| ID | Type | Given / when / then (short) | Proves | Automated test |
|---|---|---|---|---|
| TC-01 | positive | A sailing with 11 orders is delayed 6 h → only the 4 outside their window open exceptions | ER-01, AC-03.3, BAT-01 | `2–3. the sailing delay reaches every order on E-312…` |
| TC-02 | positive | Reefer for a key account 280 min late → critical, message + call task, respond in 30 min | ER-02, ER-04, ER-11, ER-09 | `4. classification: 280 min late → major, reefer → critical…` |
| TC-03 | positive | Shift lead assigns → acknowledged, assignee recorded | AC-03.5 | `5. the shift lead assigns…` |
| TC-04 | positive | Planner adds a note to a pending critical message → sent with note | AC-05.4, D-08 | `6. the planner registers a response action…` |
| TC-05 | positive | Customer view shows delay, ETA, reason, next step | US-05, AC-05.2 | `7. the customer view now shows…` |
| TC-06 | positive | New window agreed → recovered → recovery message → resolved | ER-13, AC-04.2, AC-04.3 | `8. a new window is agreed…` |
| TC-07 | positive | Audit trail in order, with rule IDs | NFR-08 | `9. the audit trail tells the story in order` |
| TC-08 | negative | Same event ID again → nothing changes, 200 | NFR-03 | `a replayed event opens no second exception…`, `a duplicate event returns 200…` |
| TC-09 | negative | Same command with same Idempotency-Key twice → applied once | API contract | `a retried command with the same Idempotency-Key is applied once` |
| TC-10 | boundary | Critical not acknowledged at 29 min → open; at 30 min → escalated | ER-09, AC-03.4 | `a critical exception not acknowledged within 30 minutes is escalated…` |
| TC-11 | positive | Minor has no response time and never escalates | ER-09 | `a minor exception has no response time and never escalates` |
| TC-12 | negative | Terminal coordinator tries to acknowledge a road-planning exception → refused | NFR-06 | `a terminal coordinator cannot acknowledge…` (unit + e2e) |
| TC-13 | negative | Planner tries to assign → refused; assignee outside owner group → refused | NFR-06, AC-03.5 | `only the shift lead assigns`, `…cannot be assigned to someone outside its owner group` |
| TC-14 | negative | Resolve an open (unacknowledged) exception → 409 | lifecycle | `an open exception must be acknowledged before it is resolved` |
| TC-15 | negative | Resolve with "other" and no note → 422; with note → resolved | AC-04.3, DEF-03 | `reason 'other' requires a note (DEF-03)` (unit + e2e) |
| TC-16 | negative | Empty response action → refused | validation | `a response action needs text` |
| TC-17 | negative | Re-planned window that ends before it starts → refused | validation | `a re-planned window must end after it starts` |
| TC-18 | exception | Missing status: held, no message; confirmed on time → closed as false alarm, still no message | ER-07, US-08 | `held: no customer message; confirmed on time…` (unit + e2e) |
| TC-19 | exception | Missing status confirmed late with new ETA → road delay, customer told | ER-07, AC-08.3 | `held: confirmed delay → re-evaluated as a road delay…` |
| TC-20 | negative | Held exception cannot be acknowledged before confirmation | lifecycle | `a held exception cannot be acknowledged before it is confirmed` |
| TC-21 | exception | Order recovers while the critical message waits for a note → withdrawn, no recovery message | OQ-03 | `a pending critical message is withdrawn…` |
| TC-22 | positive / negative | Call task: only CS completes it; outcome required | US-11 | `closing a call task requires an outcome…` |
| TC-23 | positive | Control-group customers: exceptions logged, nothing sent | AC-13.1 | `the control group is in shadow mode…` |
| TC-24 | positive | Same severity within 2 h on the same order → throttled | ER-12 | `Oakridge was told 'major' at 09:15…` |
| TC-25 | positive | Pilot export has the AC-13.2 columns, one row per exception | AC-13.2 | `the pilot export has the AC-13.2 columns…` |
| TC-26 | exception | TMS unavailable → 503 problem, error state with retry, recovers | NFR-04 (read path) | `a TMS outage returns 503…` (contract), `a TMS outage shows an error with retry…` (e2e) |
| TC-27 | privacy | Customer view and tracking API contain no driver data and no internal fields | NFR-05 | `7. the customer view now shows…` (unit), scenario e2e |
| TC-28 | contract | Every response and example conforms to `openapi.yaml` | API | `event outcome, shipments, exceptions, messages, tracking`, `… conforms to …` |
| TC-29 | accessibility | Every route: no serious/critical axe violations, one h1, no horizontal scroll on mobile | NFR-07, WCAG 2.2 | `route /… renders and passes axe` (desktop + mobile) |
| TC-30 | routes | Every internal link on the overview resolves | navigation | `every internal link on the overview resolves` |
| TC-31 | property | Severity never decreases as the delay grows | ER-02 | `severity never decreases when the delay grows` |
| TC-33 | exception | Held exception past its response time → escalated to the shift lead once, still held, no message; shift lead can give it to a planner | ER-09, D-09 | `are escalated to the shift lead but stay held…`, `the shift lead can give a held exception to a planner…`, `escalation happens once` (unit), `a held exception past its response time is escalated but stays held (D-09)` (e2e) |
| TC-34 | negative | An ETA update older than the last applied one → logged, not applied, no message (HTTP 200) | TA-4, NFR-03 | `an ETA update that happened before the last applied one…`, `an out-of-order event returns 200…` |
| TC-35 | negative | Scenario step 6 is one command: refused completely for a user outside the owner group, applied completely otherwise | API atomicity | `scenario step 6 is one atomic command…` |
| TC-36 | consistency | The DMN decision tables and the rule module agree on severity and notification for all 912 input combinations | ER-01 – ER-11, DMN | `DMN and the rule module give the same severity and notification…` |
| TC-37 | exception | Planner enters a window in Brussels time; a wall-clock time that does not exist (spring DST gap) is refused instead of silently shifted; the customer sees UK time | A4, refinement Q10 | `planner inputs use Brussels and reject a missing DST wall clock` (e2e); unit tests for both DST changes in tests/unit/time.test.ts |
| TC-38 | accessibility | Every page of the case site (landing, recruiter tour, evidence navigator, learning lab, prototype, rule explorer, process, event storming): no serious/critical axe violations, one h1, no horizontal scroll, no console errors — desktop and mobile | portfolio quality, WCAG 2.2 | `site /… renders and passes axe` (desktop + mobile) |
| TC-39 | consistency | The landing page shows exactly the evidence, status tiers and workstreams in the content manifest | single source of truth | `landing: evidence register and status tiers come from the manifest` |
| TC-40 | positive | Evidence navigator: free-text search, area and kind filters combine, and the URL keeps the state | findability | `evidence navigator: search, area and kind filters, URL state` |
| TC-41 | positive | A learning-lab quiz can be answered and is scored in the browser | learning lab | `learning lab: a quiz can be answered and scored` |
| TC-32 | coverage | Every documented rule is exercised by an example | traceability | `every rule the module can fire has a plain-language explanation` |

## Manual (designed, not automated here)

| ID | Type | Case | Proves | Why manual |
|---|---|---|---|---|
| TC-M1 | exception | Webhooks stop for 15 min → alert; re-read via API | NFR-04 | needs the real integration |
| TC-M2 | performance | 95% of events evaluated within 2 min at 5× normal volume | NFR-01 | load environment |
| TC-M3 | exception | E-mail bounces → "message failed" + call task | FR-09 | not in the demo |
| TC-M4 | usability | Customer reads the message in their own inbox, local time correct | AC-05.2, DEF-01 | real reader (BAT-07) |
| TC-M6 | accessibility | Screen-reader walkthrough of the workbench | NFR-07 | needs a person |

## Requirements → tests (summary)

| Requirement | Tests |
|---|---|
| FR-01 evaluate every change | rule examples, TC-01 |
| FR-02 store exception with rules applied | TC-02, TC-07 |
| FR-03 assumed window | unit data (D2D-48199 in the scenario), BAT-09 |
| FR-04 list by severity and time left | e2e routes, AC-03.1 (manual feature) |
| FR-05 acknowledge, re-plan, resolve | TC-03, TC-06, TC-14, TC-15, TC-17 |
| FR-06 proactive message | TC-04, TC-05 |
| FR-07 escalate | TC-10 |
| FR-08 hold missing status | TC-18 – TC-20 |
| FR-09 bounce | TC-M3 |
| FR-10 throttle | AC-07.x, TC-24 |
| FR-11 recovery message | AC-10.x, TC-06 |
| FR-12 timestamps / export | TC-25 |
| FR-13 call task | AC-11.x, TC-22 |
| FR-14 per-customer toggle | TC-23 |
| NFR-01 timeliness | TC-M2 (load test, proposed); demo: evaluation is synchronous |
| NFR-02 availability | not testable here — monitoring in production ([observability](../12-architecture/security-privacy-observability.md#observability)) |
| NFR-03 idempotency | TC-08, TC-09, TC-34 |
| NFR-04 recovery | TC-26 (read path), TC-M1 |
| NFR-05 privacy | TC-27 |
| NFR-06 access | TC-12, TC-13 |
| NFR-07 accessibility | TC-29, TC-38, TC-M6 |
| NFR-08 auditability | TC-07 |
| NFR-09 changeability | rule examples run in CI on every change |

---

[Documentation map](../00-documentation-map.md) · Next: [BAT plan →](bat-plan.md)

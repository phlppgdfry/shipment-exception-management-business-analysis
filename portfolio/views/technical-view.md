# Technical view

**For an architect, lead developer or tester.** What the analyst specified, what the demo implements, and where the boundaries are. Proposed design is labelled as such; the demo is a browser simulation.

| Topic | Where | What to look at |
|---|---|---|
| Boundaries and ownership | [architecture](../../docs/12-architecture/README.md), [ADR-001](../../docs/12-architecture/adr/ADR-001-small-component-next-to-tms.md) | TMS stays system of record; the component owns exceptions, messages and audit |
| Integration | [integration and API](../../docs/12-architecture/integration-and-api.md), [ADR-003](../../docs/12-architecture/adr/ADR-003-webhooks-with-queue-table.md) | signed webhooks, queue table, idempotency on event ID, out-of-order ETAs ignored, retries and dead letters |
| Contract | [OpenAPI 3.1](../../demo/mock-apis/openapi.yaml), [examples](../../demo/mock-apis/examples/) | RFC 9457 errors, `Idempotency-Key`, a customer projection without internal fields |
| Rules | [rule module](../../site/assets/exception-rules.mjs), [DMN](../../docs/05-requirements/dmn/exception-decisions.dmn), [ADR-002](../../docs/12-architecture/adr/ADR-002-rules-as-one-portable-module.md) | one pure module; examples as spec; DMN proven equivalent on 912 cases |
| State | [data model and states](../../docs/12-architecture/data-model-and-states.md) | transition table with guards and tests; per-order state ([ADR-004](../../docs/12-architecture/adr/ADR-004-throttle-and-state-per-order.md)) |
| Security and privacy | [security, privacy, observability](../../docs/12-architecture/security-privacy-observability.md) | OIDC roles, permission matrix enforced in the engine, data minimisation, audit |
| Operations | [runbook](../../docs/10-go-live/operations-runbook.md) | signals, severities, six playbooks, hypercare exit |
| Quality | [test strategy](../../docs/09-acceptance/test-strategy.md), [results](../../docs/09-acceptance/test-results.md), [CI](../../.github/workflows/ci.yml) | unit, contract, browser, accessibility; generators checked for drift |

**Implemented vs. proposed.** Behaviour — rules, lifecycle, permissions, idempotency, out-of-order handling, throttling, time zones — is implemented and tested in [`demo/application`](../../demo/README.md). Transport, persistence, identity and e-mail are simulated ([ADR-005](../../docs/12-architecture/adr/ADR-005-browser-demo-on-mock-api.md)).

**Known gaps:** no load test (NFR-01), no bounce handling (FR-09), no real webhook signature verification, no screen-reader session.

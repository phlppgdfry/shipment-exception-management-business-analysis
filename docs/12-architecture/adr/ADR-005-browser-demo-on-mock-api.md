# ADR-005 — The public demo runs in the browser on a mock API

**Status:** accepted (portfolio only — not a production decision) · **Deciders:** owner

## Context

The demo must be inspectable by a reviewer without installing anything, on GitHub Pages (static hosting, no server), without paid services or credentials.

## Options

| Option | For | Against |
|---|---|---|
| Local server + database (run with npm) | closest to production | reviewers will not install it |
| Hosted backend | realistic | cost, secrets, maintenance |
| **Static Next.js export, engine + mock API in the browser** | zero install; deterministic; testable | not a real integration; state per browser tab |

## Decision

Static export. The mock API implements the [OpenAPI contract](../../../demo/mock-apis/openapi.yaml) method by method, with latency, RFC 9457 errors, idempotency keys and a fault switch; a contract test checks it against the schemas. Data comes from a seeded generator, and the morning's events are replayed through the engine at start-up.

## Consequences

- Behaviour (rules, lifecycle, permissions, idempotency, out-of-order handling) is real and tested; transport, persistence and identity are simulated — stated in the [architecture overview](../README.md#proposed-vs-implemented-in-the-demo).
- Swapping the mock for `fetch` calls to a real service needs no change in the screens.

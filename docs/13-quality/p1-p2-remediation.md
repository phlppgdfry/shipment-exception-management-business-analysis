# P1/P2 remediation — 2026-10-22

Scope: verified functional defects from the senior review. Fictional reference application; no live customer data.

| Finding | Decision and implemented behaviour | Regression evidence |
|---|---|---|
| P1: next-day classification crosses a month/year | Destination calendar keys are assembled as YYYY-MM-DD using Europe/London parts. ER-03 remains independent of the planner zone. | Jan/Feb, Dec/Jan, leap day and summer local midnight → CRITICAL for standard cargo; tests/unit/p1p2.test.ts |
| P2: no sent message appeared on schedule | A held/missing or more than 120-minute-old status gets neutral “Status awaiting confirmation”, its last reported ETA and a checking action. No internal rule, severity, exception ID or unconfirmed delay is exposed. A fresh haulier ON_TIME confirmation restores On schedule without sending a false alarm. | Unit privacy/freshness check and workbench browser test before/after haulier confirmation |
| P2: reused Idempotency-Key silently ignored different commands | Receipt binds operation, target, actor and canonical payload; exact replay returns the stored original result. A conflict returns RFC 9457 409 without mutation. Failed commands do not reserve a key. | Payload, target, operation and actor conflicts; exact replay; persisted state reload; tests/unit/p1p2.test.ts and contract.test.ts |

## Compatibility and handover

Existing session snapshots retain processedCommandKeys. New successful commands also store commandReceipts. A legacy key without a fingerprint cannot be verified and fails explicitly with 409; use a new key for a new operation. This avoids blindly replaying an unrelated action. Canonical object property order is immaterial; array order is retained. Browser session persistence is a demo mechanism, not a durable production idempotency store. Production must atomically store command, fingerprint and response, scope keys to the authenticated client, and specify retention.

The 120-minute freshness boundary is an explicit proposed customer-view assumption. Held status always overrides freshness. Sent customer notifications remain the source for published delay/recovery content. This patch adds neutral confidence information when there is no sent message, without publishing an internal alert. The OpenAPI Tracking tone now includes unknown. The Figma captures dated 2026-10-17 remain historical references; the running application is authoritative for this correction.

## Validation

Run application npm test, npm run typecheck, npm run lint; build with the published base path; run npm run test:e2e against the static export. The regression tests supplement the existing scenario and contract suites.

Executed on 2026-10-22: 60 application unit/contract tests, 36 root rules/DMN tests and 27 browser tests passed. Lint, type checking, BPMN/DMN meta-model checks, repository validation, local links and production static export passed. The export was built with webpack under the published base path. Additional desktop/mobile checks of the neutral customer status passed with no JavaScript errors or axe WCAG A/AA violations. No production deployment or real customer validation is claimed.

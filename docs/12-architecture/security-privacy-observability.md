# Security, privacy, observability and data quality

> **What this is:** the non-functional side of the exception component — who may do what, which personal data is involved, how support sees that it works, and what data quality it depends on. **For:** IT security, the data protection officer (DPO), application support, PO. **Previous:** [data model and state machines](data-model-and-states.md) · **Back to:** [architecture overview](README.md).

*Proposed controls for a fictional organisation. They have not been reviewed by a real security team or DPO.*

## Authentication

| Caller | Mechanism (proposed) | Demo |
|---|---|---|
| TMS webhook | HMAC-SHA256 signature over the body with a shared secret (`X-Webhook-Signature`), rotated yearly; requests over TLS only | not applicable (no network) |
| Staff (workbench) | OIDC sign-in via the company identity provider; roles carried in the token | "Acting as" switch |
| Customers (portal tracking) | Portal sign-in; token carries `customerId`; a customer can read only their own orders | not applicable |
| Component → TMS API | OAuth 2.0 client credentials, least-privilege scope (read orders, write order notes) | not applicable |

Secrets live in the platform's secret store, never in the repository. The repository contains none (the demo needs none).

## Authorisation model (NFR-06)

| Action | Road planner | Shift lead | Terminal ops | Customs desk | CS agent | PO | Customer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Read exceptions | own group | all | own group | own group | all | all | — |
| Acknowledge | own group | ✓ | own group | own group | — | — | — |
| Assign to a person | — | ✓ | — | — | — | — | — |
| Register action, re-plan, resolve | own group | ✓ | own group | own group | — | — | — |
| Confirm missing status | own group | ✓ | — | — | — | — | — |
| Send pending message with note | own group | ✓ | — | — | — | — | — |
| Complete call task | — | ✓ | — | — | ✓ | — | — |
| Pilot export | — | — | — | — | Head of CS | ✓ | — |
| Tracking card of an order | — | — | — | — | — | — | own orders |

The demo enforces the workbench rows in the engine (`requireWorker`, `assign`, `completeCallTask`) and tests them (unit "permissions", e2e "terminal coordinator can read but not change").

## Privacy (GDPR)

| Topic | Decision | Source |
|---|---|---|
| Purpose | Customer contact data is used only to inform the customer about their order | D-05, NFR-05 |
| Minimisation | Messages contain order reference, window, new ETA, reason **category** and next step — never driver name, phone or location | NFR-05, C-02; contract: `PublicMessage` has no such fields |
| Internal data stays internal | Severity, owner, rule IDs and held or throttled messages are not exposed to customers | `GET /orders/{ref}/tracking` returns only sent messages; unit test asserts no internal fields |
| Consignees | Not notified in R1–R2: they are not our customer; legal basis differs per contract | D-05 |
| Free text | Planner notes and response actions are free text → guidance in the quick guide: no personal data about drivers or consignee staff | support handover |
| Retention (proposed) | Exceptions and audit: 24 months (complaints, credit notes); messages: 12 months; to confirm with the DPO | open — DPO |
| Test data | No customer data in test environments; synthetic orders only | C-06 |

## Auditability (NFR-08)

Every change is an audit entry: when, who (user or `SYSTEM`), what (`EXCEPTION_OPENED`, `MESSAGE_SENT`, `STATUS_CHANGED`, …), on which order and exception, and a human-readable detail that includes the **rule IDs**. That is what lets first-line support answer "why did this customer get this message?" without a developer ([KB article](../10-go-live/support-handover.md)). Audit entries are append-only; rollback never deletes them ([release readiness](../10-go-live/release-readiness.md#rollback)).

## Observability

| Signal | Threshold / alert | Owner | Requirement |
|---|---|---|---|
| Webhook heartbeat | no event for 15 min during 05:00–23:00 → alert + API re-read | Application support | NFR-04 |
| Evaluation latency (event received → evaluated) | p95 > 2 min for 15 min → warning | Application support | NFR-01 |
| Message latency (opened → sent) | p95 > 5 min (excluding the planner-note window) | Application support | NFR-01 |
| Failed events | any → alert with event ID and input | Application support | — |
| Duplicates ignored | trend only (a jump means the TMS retries more) | Team | NFR-03 |
| Business KPIs K1, K2, K6, K7, K8 | daily export; hypercare thresholds | PO, Head of CS | US-13 |

Logs are structured (JSON) with `eventId`, `orderRef`, `exceptionId` as correlation keys, and contain no message bodies or contact data.

## Data quality

The rules are only as good as their inputs. Checked before the pilot ([requirements, DQ-1 to DQ-3](../05-requirements/requirements.md#data-quality-rules-checked-before-the-pilot)) and monitored after:

| Check | Why | Response |
|---|---|---|
| Share of orders with **assumed** windows | ER-01/ER-02 judge less precisely | > 5% for pilot customers → TMS PO (R-07) |
| Reefer flagged as reefer | ER-04 depends on it | default from unit type |
| Valid operational contact per pilot customer | messages must arrive | DQ-2 before go-live; bounces → call task |
| Event `occurredAt` in the future or > 24 h old | clock or replay problem at the source | event rejected with `422`, alert |
| Missing status per haulier | which hauliers need app onboarding (R2, D-04) | monthly report to road planning |

---

[Documentation map](../00-documentation-map.md) · Back to: [Architecture overview](README.md)

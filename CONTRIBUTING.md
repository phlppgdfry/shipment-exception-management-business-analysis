# Contributing

This is a personal portfolio and learning repository. It is public so reviewers can read it; it is not looking for outside contributions. The notes below are for the owner (and for anyone curious about how changes are kept consistent).

## The one rule

**The documents are the source of truth.** The rule module, the demo and the tests follow the documents — never the other way round.

| If you change… | Also change… | Checked by |
|---|---|---|
| a threshold or rule in [`exception-rules.md`](docs/05-requirements/exception-rules.md) | the module [`site/assets/exception-rules.mjs`](site/assets/exception-rules.mjs) and the examples in [`exception-decision.feature`](docs/06-backlog/features/exception-decision.feature) | `node --test tests/*.test.mjs` |
| a requirement, story or ID | every document that references it | `python3 scripts/validate_repo.py` |
| the demo data generator | regenerate: `node demo/mock-data/generate.mjs` | `--check` in CI |
| the engine or API behaviour | the [OpenAPI contract](demo/mock-apis/openapi.yaml); regenerate examples with `UPDATE_EXAMPLES=1 npm test` | contract test |
| anything | the test results page after a full run: `node scripts/record-test-results.mjs` | review |

## Before you push

```bash
node --test tests/*.test.mjs
python3 scripts/check-links.py
python3 scripts/validate_repo.py
cd demo/application && npm run lint && npm run typecheck && npm test
BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build && npm run test:e2e
```

## Writing style

- Professional deliverables in **English**; the learning lab in **Dutch**, keeping common English BA/IT terms.
- Every document opens with *What this is · For · Previous/Next*.
- Label evidence honestly: *illustrative assumption*, *simulated*, *proposed*, or *executed* (see the [research register](docs/02-discovery/sources.md#how-statements-in-this-repository-are-labelled)).
- Never name a real employer or imply access to internal information.

## Commits

Small, descriptive commits on `main`; CI must be green. No AI co-author trailers in this repository.

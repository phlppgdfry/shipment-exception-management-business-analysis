# Definition of Ready and Definition of Done

> **What this is:** the team's agreement on when a story can enter a sprint and when it is finished. **For:** the Scrum team, PO and BA. **Previous:** [prioritisation](prioritisation.md) · **Next:** [design](../07-design/design.md).

## Definition of Ready (story level)

A story enters sprint planning when:

- [ ] it has a user, a need and a "so that" that someone outside IT understands;
- [ ] it is linked to a requirement and, where relevant, to rule IDs (ER-xx);
- [ ] acceptance criteria are written, including at least one failure or boundary case;
- [ ] decision logic is in the executable examples table, not in prose;
- [ ] screens or messages it changes have a design or an agreed sketch;
- [ ] open questions are answered or explicitly parked with an owner;
- [ ] the team has estimated it and it fits in half a sprint;
- [ ] dependencies (TMS configuration, supplier, other team) are known and planned;
- [ ] the tester has read it and knows how to test it.

## Definition of Done (story level)

- [ ] code reviewed and merged; automated tests green, including the decision examples;
- [ ] tested by the tester against the acceptance criteria in the test environment;
- [ ] shown in the sprint review to the people who asked for it;
- [ ] functional documentation updated (rules page, glossary, traceability) — by the BA;
- [ ] support impact noted for the KB article — by the BA with application support;
- [ ] no open defects of severity blocker or major.

## Definition of Done (release level) — "ready for production"

In addition to the story DoD, a release is done when the [release readiness checklist](../10-go-live/release-readiness.md) is green: BAT signed off, support trained and the KB article published, communication sent, monitoring and rollback tested, go/no-go taken by the PO.

*Why a separate release-level DoD: in the AS-IS, features were "done" when merged, and support heard about them from the first ticket ([interview #8](../02-discovery/interview-notes.md)).*

---

[Documentation map](../00-documentation-map.md) · Next: [Design →](../07-design/design.md)

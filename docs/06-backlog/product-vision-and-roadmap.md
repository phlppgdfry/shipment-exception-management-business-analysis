# Product vision and roadmap

> **What this is:** where the "Customer Visibility" product is heading, in one page, and the release roadmap that the backlog serves. **For:** PO, sponsor, team and stakeholders who ask "and after the pilot?". **Previous:** [traceability](../05-requirements/traceability.md) · **Next:** [story map](story-map.md).

## Vision (elevator pitch format)

> **For** door-to-door customers and the planners who serve them,
> **who** today learn about delivery problems too late or by chance,
> **the** exception management capability
> **is a** small rule-based layer on top of the TMS
> **that** decides which changes matter, gives each one an owner and tells the customer first.
> **Unlike** standard TMS notifications on every status change or a parcel-style tracking map,
> **our product** sends one clear message only when the delivery window is at risk, and makes someone responsible for fixing it.

**North-star measure:** share of major/critical delays the customer hears about from us before the window starts (K1: 22% → ≥ 90%).
**Guardrails:** false alarms < 5% (K7), no more planner workload than today's manual checks.

## Roadmap (outcome-based, not dated features)

| Horizon | Outcome | Main items | Condition to start |
|---|---|---|---|
| **Now — R1 pilot** (weeks 1–11) | Five customers on two routes hear about serious delays first; planners work from one list | EN-1, EN-2, US-01 – US-05, US-07, US-08, US-10, US-11, US-13 | funded (D-07) |
| **Next — R2** (after the stage gate, ±1 quarter) | All door-to-door customers; EDI/API customers in their own channel; customs holds handled with the customer | US-06 EDI/API status, US-09 customs holds, US-12 preferences in the portal, consignee opening hours (BAT-02 note), haulier app onboarding (D-04), R1.1 fixes | WISMO −20% vs. control (stage gate) |
| **Later — R3** | Consignees informed directly; fewer exceptions in the first place | US-14 consignee notifications (after GDPR/contract work, D-05), ETA prediction (parking lot), re-assess an external visibility platform (O4) | R2 benefits confirmed; DPO approval |

**What is deliberately not on the roadmap:** automatic re-planning (planners re-plan; the system tells), a live map of trailers (customers need the window consequence, not the position — [prioritisation](prioritisation.md#trade-offs-the-po-made)), replacing the TMS.

## Release plan

| Release | Content | Size | Sprints | Exit |
|---|---|---:|---:|---|
| R1 | see story map | 36 pts | 2 | BAT signed, go/no-go ([readiness](../10-go-live/release-readiness.md)) |
| R1.1 | DEF-05 auto-refresh, DEF-06 link in call task | ±3 pts | part of sprint 3 | hypercare exit |
| R2 | US-06 ([refined](release-2-edi-status.md): 06a/06b/06c, 10 pts), US-09, US-12 + consignee hours + onboarding | 20 pts estimated (+ unrefined items) | ±2–3 | stage gate passed |

Velocity ±18–20 points per sprint. R2 estimates cover US-06/09/12 only (US-06 re-estimated at 10 after splitting, + 5 + 5); the other R2 items are not refined yet, so the R2 range is a forecast, not a promise.

## Sprint goals (examples)

| Sprint | Goal | Why this goal |
|---|---|---|
| 1 | "A planner sees the right exceptions" | The rules and the list are the foundation; no customer message before the rules are trusted |
| 2 | "The customer hears it first" | The value; only after sprint 1's review showed planners agree with the severities |
| 3 (R1.1 + R2 start) | "Nothing falls through during hypercare" | Known issues first, then the stage-gate preparation |

---

[Documentation map](../00-documentation-map.md) · Next: [Story map →](story-map.md)

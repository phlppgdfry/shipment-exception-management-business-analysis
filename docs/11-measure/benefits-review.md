# Benefits review and stage gate

> **What this is:** how the pilot is measured and how the sponsor decides on release 2, with an illustrative week-6 readout in the format the sponsor receives. **For:** sponsor, PO, Head of CS, road planning lead. **Previous:** [release note](../10-go-live/release-note.md) · **Back to:** [documentation map](../00-documentation-map.md).

## Measurement design

| | |
|---|---|
| Pilot group | 5 customers, BE-UK East and BE-UK South, feature on |
| Control group | 5 comparable customers on the same routes, shadow mode (exceptions logged, no messages) |
| Period | 6 weeks (weeks 6–11) + 4-week baseline before go-live for both groups |
| Data | daily export (US-13), CS contact tags, credit notes, planner log |
| Comparison | change in the pilot group **minus** change in the control group (so a calm month at sea does not look like success) |
| Decision rule (D-07) | fund release 2 if WISMO contacts for pilot customers fall by **≥ 20%** relative to the control group, **and** no guardrail is breached |

## Illustrative readout — week 12 stage gate

*Fictional data, to show the format and the reasoning — not results of a real pilot.*

| KPI | Target | Pilot | Control | Verdict |
|---|---:|---:|---:|---|
| K1 Proactive notification rate (major/critical) | ≥ 90% | 94% | — (shadow) | met |
| K2 Time to inform (median) | ≤ 30 min | 6 min | — | met |
| K3 WISMO contacts vs. baseline | ≤ 65 (index) | 71 | 97 | **−26% relative to control** → above the 20% gate, below the 35% plan |
| K4 Missed slots vs. baseline | ≤ 70 (index) | 78 | 99 | −21% relative, below the 30% plan |
| K5 New window agreed before original window | ≥ 60% | 58% | — | almost |
| K6 Acknowledged within response time | ≥ 95% | 97% | — | met (after R1.1 auto-refresh) |
| K7 False alarm rate | < 5% | 3.1% | — | met |
| K8 Messages per notified exception | ≤ 2.0 | 1.3 | — | met |
| Guardrail: exceptions per planner per shift | ≤ today's manual checks | 6.2 vs. ±9 manual lookups | — | met |
| Guardrail: opt-outs | < 2% | 0 of 5 customers | — | met |

### What the numbers say

- **Gate passed:** WISMO −26% relative to control (gate: 20%). Release 2 recommended.
- **Business case adjusted, not inflated:** at −26% WISMO and −21% missed slots, yearly benefits are ±€150k instead of €207k; payback ±20 months instead of 13.5. Still positive within 3 years.
- **Where the gap is:** K5 — planners agree new windows late when the consignee is closed. That is the same root cause as the BAT-02 note (consignee opening hours). Proposed for release 2: consignee closing time as an input to ER-04.

### Recommendation to the sponsor

Fund release 2 (±€81k) with the scope: all customers, EDI/API status messages (US-06), notification preferences in the portal (US-12), consignee opening hours. Move customs holds (US-09) behind consignee hours based on the pilot data (customs holds were 4% of exceptions).

---

[Documentation map](../00-documentation-map.md)

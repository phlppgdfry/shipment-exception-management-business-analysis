# One-page summary — Shipment exceptions, handled before the customer calls

*Independent portfolio case · fictional organisation · Philippe Godfroy · all figures illustrative.*

**The problem.** A short-sea and door-to-door operator went live on a new TMS. Customers see statuses but not whether their delivery window is at risk, so they call: ±38% of customer-service contacts are "where is my load?", ±55 delivery slots a week are missed, and only 22% of late deliveries are announced in advance.

**What I did, as business analyst next to the Product Owner:**

| Step | Result |
|---|---|
| Framed the opportunity | Three requested solutions reframed as one root cause (no rules, no owner); four options scored; business case pays back in ±13.5 months if WISMO drops 35% — tested first in a 6-week pilot with a control group |
| Discovery + event storming | Seven interviews, shadowing, a 3-hour event storming; six hotspots decided by their owners (decision log D-01 … D-08) |
| Process and rules | BPMN 2.0 AS-IS/TO-BE; 13 exception rules in one decision table; 30 examples running as tests in CI |
| Backlog with the PO | Story map; WSJF scored with the business; two-sprint pilot of 36 points; documented trade-offs |
| Design | Figma workbench and customer message, validated with planners and two pilot customers; clickable prototype |
| Acceptance and go-live | BAT with key users (4 majors found and fixed, signed off with 2 known issues); 13-point go/no-go; staged switch-on; rollback; hypercare; communication plan; KB article |
| Measure | Stage gate against a control group; business case recalculated with pilot data |

**Pilot targets.** Proactive notification 22% → ≥ 90% · time to inform 3 h → ≤ 30 min · WISMO −35% · false alarms < 5%.

**Links.** Site: phlppgdfry.github.io/shipment-exception-management-business-analysis · Prototype tour: …/prototype/?tour · Repository: github.com/phlppgdfry/shipment-exception-management-business-analysis

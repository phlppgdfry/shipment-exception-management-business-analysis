# Decision log

> **What this is:** the decisions that shaped the release, with the options I prepared, who decided and why. **For:** PO, team and anyone asking "why does it work like this?" six months later. **Previous:** [event storming board](event-storming-board.md) · **Next:** [AS-IS process](../04-process/as-is.md).

Format: context → options → decision → consequences. The BA prepares; the owner decides.

## D-01

**What counts as "late"** · Owner: PO with Head of CS and road planning lead · Hotspot H-01

- **Options:** (a) after the planned ETA; (b) after the end of the agreed delivery window; (c) after the slot booked at the consignee.
- **Decision:** (b). Late = expected delivery after the **end of the agreed delivery window**.
- **Why:** (a) creates noise — most ETA changes do not affect the customer. (c) is not in our systems for most orders. The window is what we promised.
- **Consequences:** the window must be filled in (A-02 showed 72%) → [D-06](#d-06). A delay inside the window is not an exception ([ER-01](../05-requirements/exception-rules.md)).

## D-02

**Who is told what** · Owner: PO · Hotspot H-02

- **Options:** (a) every change to every customer; (b) every change to key accounts only; (c) by severity, with an opt-in for customers who want everything, and a personal call for critical key-account cases.
- **Decision:** (c). Thresholds: minor < 2 h, major 2–6 h, critical ≥ 6 h or next day; reefer and time-critical one level up.
- **Why:** account managers' real need was "never let a key account be surprised by something serious", not "every 20 minutes". Planners' need was "no storm". Severity serves both.
- **Consequences:** thresholds are parameters the PO can change; the acceptance examples show exactly what changes ([ER-02, ER-04, ER-10, ER-11](../05-requirements/exception-rules.md)).

## D-03

**Build a small exception component or wait for the TMS supplier** · Owner: PO with IT architect · Hotspot from the developer

- **Options:** (a) wait for the supplier's exception module (on their roadmap, date not committed); (b) configure standard TMS e-mails (option O2, rejected in the business case); (c) a small in-house component that listens to TMS webhooks, applies our rules and writes back a status and a task.
- **Decision:** (c), deliberately small: rules, work list, messages. No copy of the order data beyond what the rules need.
- **Why:** the supplier date is uncertain; the rules are ours whatever tool runs them. Keeping them in one module (with executable examples) makes moving them later cheap.
- **Consequences:** one more component for application support; reviewed every quarter against the supplier roadmap.

## D-04

**Missing status: alarm or noise?** · Owner: road planning lead · Hotspot H-03

- **Options:** (a) notify the customer after 6 h without status; (b) ignore missing status; (c) open an exception for the planner, but **hold** the customer message until the planner confirms with the haulier.
- **Decision:** (c), response time 2 h (30 min for time-critical cargo).
- **Why:** about half the hauliers do not use the app, so silence is usually just silence. A false alarm costs more trust than a late one.
- **Consequences:** [ER-07](../05-requirements/exception-rules.md); haulier app onboarding added to the backlog for release 2 (reduces false holds).

## D-05

**Consignee notifications** · Owner: data protection officer with commercial · Hotspot from the parking lot

- **Decision:** not in releases 1 and 2. The consignee is not our customer; contact data and the legal basis differ per contract.
- **Also decided:** customer messages contain the new ETA and a reason category, **never the driver's name, phone number or location**.

## D-06

**Orders without a delivery window** · Owner: PO

- **Context:** 28% of door-to-door orders have no window in the TMS (A-02).
- **Options:** (a) skip them; (b) assume window end = planned ETA + 2 h and mark the exception "window assumed"; (c) block the pilot until order intake is fixed.
- **Decision:** (b) for the pilot **and** a story to make the window mandatory for pilot customers in order intake (TMS configuration).
- **Consequences:** [FR-03](../05-requirements/requirements.md); "window assumed" visible in the workbench so planners know.

## D-07

**Pilot scope and stage gate** · Owner: sponsor (COO) with PO

- **Decision:** release 1 as a pilot on routes BE-UK East and BE-UK South, five customers, feature toggle per customer, six weeks. Release 2 is funded only if WISMO contacts for pilot customers drop by at least 20% against the control group.
- **Why:** the riskiest assumption in the [business case](../01-opportunity/options-and-business-case.md#sensitivity--the-riskiest-assumption) is measurable within six weeks.

## D-08

**The planner's own call** · Owner: PO with road planning lead · Hotspot H-04

- **Context:** the senior planner calls important customers herself and feared "two different stories".
- **Decision:** the system message always goes out (one story), and the planner can add a free-text note to it before sending for critical exceptions. Personal calls stay possible and are logged on the exception.
- **Why:** keeps what works (personal contact) and removes what does not (customers who are never called).

---

[Documentation map](../00-documentation-map.md) · Next: [AS-IS process →](../04-process/as-is.md)

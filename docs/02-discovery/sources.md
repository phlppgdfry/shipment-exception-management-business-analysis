# Research register — sources

> **What this is:** the public sources behind the domain context of this case, what each one supports, and what is still unverified. **For:** reviewers who want to know which statements rest on evidence and which are assumptions. **Previous:** [context](context.md) · **Next:** [stakeholders](stakeholders.md).

This case is about a **fictional** operator (Tidewell). This register records the public industry context it borrows from. It does not use or imply any internal information from a real company. Retrieval date for all entries: **2026-10-11**.

## How statements in this repository are labelled

| Label | Meaning | Example |
|---|---|---|
| **Verified public fact** | Stated in a source below, checked on the retrieval date | Short-sea shipping is the majority of EU main-port sea transport by weight (S-02) |
| **Industry practice** | How the domain generally works; widely documented, not tied to one company | Hauliers are often subcontracted; status quality depends on their app use |
| **Case assumption** | Invented for the fictional organisation, labelled "illustrative" where it appears | ±1,600 door-to-door orders a week, 38% WISMO share |
| **Proposal** | The future state this case recommends | Exception component listening to TMS webhooks (D-03) |

## Register

| ID | Source | Published | Supports | Evidence note | Status |
|---|---|---|---|---|---|
| S-01 | Eurostat, *Maritime transport statistics — short sea shipping of goods* (Statistics Explained) — <https://ec.europa.eu/eurostat/statistics-explained/index.php/maritime_transport_statistics_-_short_sea_shipping_of_goods> | updated yearly; latest edition read covers 2023 | Short-sea shipping as the backbone of intra-European sea freight | 2023: ±1.6 billion tonnes of short-sea goods, 56.6% of total sea transport to and from main EU ports | verified |
| S-02 | Eurostat, *Maritime ports freight and passenger statistics* (Statistics Explained), 2024 data | 2025 | Ro-Ro units as a cargo type; Ireland's high reliance on Ro-Ro | 2024: Ro-Ro mobile units 12.4% of goods handled in main EU ports; Ireland 32.1% of its port tonnage on Ro-Ro units | verified via search summary; open the table before quoting |
| S-03 | Eurostat dataset `mar_sg_am_pwr` — short sea shipping, Ro-Ro units, top 5 ports | data to 2023 | That Ro-Ro short-sea volume is measured per port and unit type | No 2024 release found on the retrieval date | verified (dataset exists) |
| S-04 | Port of Antwerp-Bruges, news: *offers new opportunities through shortsea connections* — <https://www.portofantwerpbruges.com/en/news/port-antwerp-bruges-offers-new-opportunities-through-shortsea-connections> | 2025 | Belgian ports as short-sea hubs to the UK and Ireland | General context only | verified (page exists) |
| S-05 | DCSA, *Track & Trace Interface Standard 2.2* — <https://dcsa.org/newsroom/dcsa-releases-track-trace-interface-standard-version-2-2> | 2021 | Event-based visibility: shipment, transport and equipment events; subscription callbacks with signed notifications | Basis for the event-driven integration concept and webhook signature in [integration and API](../12-architecture/integration-and-api.md) | verified |
| S-06 | DCSA, *Track & Trace 3.0.0* (press coverage, e.g. AJOT) — <https://www.ajot.com/news/dcsa-publishes-track-trace-3.0.0-expanding-standard-to-cover-iot-and-reefer-visibility> | Oct 2026 | Corrected and withdrawn events; reefer events | Supports the design choice that events can be corrected or arrive twice (idempotency, re-evaluation). Coverage dates conflict; check DCSA directly | partly verified |
| S-07 | European Commission, *eFTI Regulation* — <https://transport.ec.europa.eu/transport-themes/logistics-and-multimodal-transport/efti-regulation_en> | ongoing | Regulation (EU) 2020/1056: authorities accept freight information electronically | Full application stated as 9 July 2027; earlier milestones differ between sources. **Not used for any requirement in release 1** — listed as a future dependency in the [registers](../01-opportunity/registers.md) | verified (dates to re-check) |
| S-08 | UK Government, *The Border Target Operating Model* — <https://www.gov.uk/government/publications/the-border-target-operating-model> | 2023, updated since | Why customs holds on EU→UK flows exist and are owned by a customs function | Phased checks since 2024; several delays reported. Current status not verified on the retrieval date | to validate |
| S-09 | Regulation (EU) 2016/679 (GDPR), Art. 5 and Art. 6 — <https://eur-lex.europa.eu/eli/reg/2016/679/oj> | 2016 | Data minimisation and purpose limitation for customer messages; legal basis for consignee contact | Basis for NFR-05 and decision D-05 | verified |
| S-10 | OMG, *BPMN 2.0.2* specification — <https://www.omg.org/spec/BPMN/2.0.2/> | 2014 | Notation of the `.bpmn` files | — | verified |
| S-11 | OMG, *UML 2.5.1* specification — <https://www.omg.org/spec/UML/2.5.1/> | 2017 | Use case, sequence, state and activity diagrams | — | verified |
| S-12 | Schwaber & Sutherland, *The Scrum Guide* (2020) — <https://scrumguides.org/scrum-guide.html> | 2020 | Roles, events and artefacts used in the delivery documents | The Scrum Guide has no "business analyst" role; the BA works as a Developer or alongside the team — explained in [roles and responsibilities](../08-delivery/roles-and-responsibilities.md) | verified |
| S-13 | IIBA, *BABOK Guide v3* — <https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/> | 2015 | Knowledge areas used to structure the learning lab | — | verified (page exists) |
| S-14 | IETF, *RFC 9457 Problem Details for HTTP APIs* — <https://www.rfc-editor.org/rfc/rfc9457> | 2023 | Error format in the API contract | — | verified |
| S-15 | W3C, *WCAG 2.2* — <https://www.w3.org/TR/WCAG22/> | 2023 | Accessibility targets for the control tower demo | — | verified |
| S-16 | Vendor articles on WISMO (e.g. ShippyPro, *WISMO: what it means*) — <https://www.shippypro.com/blog/en/wismo-what-it-means> | n.d. | That "where is my order" is a recognised, large contact category | Vendor claims (40–60% of e-commerce contacts, ±40% reduction through proactive messages) have **no published method**. Not used as evidence for the business case; the case's 35% reduction is an explicit assumption tested by the pilot | **weak — not relied on** |

## What the sources do and do not support

- **Supported:** the domain shape (short-sea Ro-Ro, door-to-door with road legs, customs on UK flows, event-based visibility standards, GDPR limits on messages).
- **Not supported by any public source:** every Tidewell number (volumes, WISMO share, cost per missed slot, the 35% reduction). They are **case assumptions**, labelled as illustrative where they appear, and the business case treats the WISMO reduction as the [riskiest assumption](../01-opportunity/options-and-business-case.md#sensitivity--the-riskiest-assumption).

## Open research questions (to validate before relying on them)

| ID | Question | Why it matters | How to validate |
|---|---|---|---|
| RQ-01 | What share of carrier or forwarder contacts is WISMO in B2B freight (not e-commerce)? | The business case uses 38% | Industry benchmarks from a customer-service research firm, or a 2-week tagging exercise (as in the KPI tree) |
| RQ-02 | Which events does a typical SaaS TMS publish as webhooks, and how fast? | Assumption A-01 (2 minutes) | Supplier documentation; time-boxed spike (done in the case's sprint 0) |
| RQ-03 | Current status of UK import checks on EU goods | Volume of customs holds in release 2 | gov.uk BTOM page; customs broker |
| RQ-04 | eFTI milestone dates as they apply to road legs | Future data-exchange requirement | Commission eFTI page; national authority |

---

[Documentation map](../00-documentation-map.md) · Next: [Stakeholders →](stakeholders.md)

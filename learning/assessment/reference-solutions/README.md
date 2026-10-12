# Referentieoplossingen — competentietaken

> **Open dit pas als je eigen antwoord in `learning/my-work/task-NN.md` staat.** Een referentie is één goede uitwerking, niet de enige. Vergelijk de **redenering**, niet de woorden. Scoor daarna met de rubric in de [opdrachten](../README.md).

---

## T1 — sms bij elke vertraging

- **Behoefte:** de klant moet een ernstige vertraging *zeker opmerken*, ook als hij de mail niet leest.
- **Raakt:** A-03 (pilotklanten aanvaarden mail + portaal, geen sms nodig — bevestigd), A-06 (klanten lezen het operationele mailadres), ER-10 (alleen major/critical), ER-12 (throttling), NFR-05 (privacy: telefoonnummers zijn persoonsgegevens; doelbinding), C-05.
- **Opties:** (a) niets veranderen — data toont of mails gelezen worden; (b) sms alleen bij *critical* en alleen voor klanten die het kiezen (opt-in, US-12 in R2); (c) sms bij elke vertraging — tegen D-02 en de berichtmoeheid uit de O2-test.
- **Data eerst:** openingsratio's van de pilotmails; WISMO-contacten ná een verstuurde mail (las de klant hem niet?); hoeveel klanten een mobiel nummer voor operationele berichten hebben (DQ).
- **Aanbeveling:** "Eerst meten of mails niet gelezen worden (2 weken pilotdata). Als dat zo is: sms als opt-in kanaal voor critical, samen met US-12 in release 2, na DPO-review. Beslissing: PO."

## T2 — discoverygesprek terminal operations

Voorbeeldvragen: "Vertel over de laatste keer dat een trailer niet op tijd van de terminal kon. Wat gebeurde er eerst?" · "Hoe weten planners vandaag dat er congestie is?" · "Wie verwittigt wie?" · "Wanneer is een terminalvertraging jouw probleem en wanneer van road planning?" · "Wat zou je níét willen dat klanten te horen krijgen?" · "Hoe vaak verandert de verwachte gate-out?" · "Welke data heb je in het TOS die road planning niet ziet?"

Mogelijke tegenstrijdigheid: de case maakt terminal operations eigenaar van TERMINAL_DELAY (ER-08), maar de coordinator vindt dat de *planner* de klant moet bellen omdat die de levering herplant. → Hotspot voor de PO met de road planning lead; niet zelf beslissen.

## T3 — BPMN missing status

```text
Lanes: Exception component | Road planner | Haulier | Customer
(start: timer "no status for N h") → [service] Evaluate rules → exception HELD (major / critical if time-critical)
 → [user, planner] Contact haulier   ⏱ timer boundary: response time passed → [user, shift lead] Escalate (OQ-02)
 → [haulier] Confirms position / ETA
 → <XOR> "Delivery inside window?"
     yes → [service] Close as false alarm → (end: no customer message)
     no  → [service] Re-evaluate as road delay → [send] Customer message → (end)
```

Let op: de klant-lane krijgt pas iets in het "no"-pad. De timer is een *voorstel* (OQ-02 is open) — zeg dat.

## T4 — stories voor meldingsvoorkeuren

1. *As a* customer transport manager *I want* to choose to receive minor delays as well *so that* I can plan tight docks without calling. (ER-10, `prefersAllUpdates`)
2. *As a* customer *I want* to choose which contact receives operational messages per site *so that* the right dock team hears it. (A-06, DQ-2)
3. *As a* customer *I want* to pause messages for orders I am already handling with my planner *so that* I am not told what I already know. (ER-12; vraag aan PO: mag een klant critical uitzetten? — waarschijnlijk niet)

Niet splitsen in "frontend" en "backend"; story 3 bevat een beleidsvraag die eerst naar de PO moet.

## T5 — criteria (voor story 1)

```gherkin
Scenario: Opted-in customer receives a minor delay
  Given customer "Pellow Medical Supplies" has opted in to every update
  When an order becomes 60 minutes late (minor)
  Then a message is sent                                   # ER-10, AC-01.4

Scenario: Boundary — 1 minute late, opted in
  Given the customer has opted in
  When an order becomes 1 minute late
  Then a message is sent

Scenario: Boundary — exactly at the end of the window
  Given the customer has opted in
  When the expected delivery equals the end of the window
  Then no message is sent                                   # ER-01, AC-01.2

Scenario: Throttling still applies to minor
  Given the customer was told "minor" 30 minutes ago
  When the same order is re-evaluated as minor
  Then no message is sent                                   # ER-12

Scenario: Preference saved by someone without rights
  Given I am signed in as a user of another customer
  When I try to change Pellow's preference
  Then it is refused

Scenario: Opt-out of minor does not stop major
  Given the customer has not opted in
  When an order becomes 150 minutes late
  Then a message is sent                                    # ER-10
```

## T6 — dubbelzinnigheden

*tijdig* (vóór het venster? binnen 5 min?) · *belangrijke vertragingen* (welke drempel?) · *kleine dingen* (minor? binnen het venster?) · *altijd voorrang* (in de lijst? een telefoontje? elke wijziging?) · *duidelijk* (welke inhoud?) · *niet te vaak* (hoeveel, per wat — order of exception?) · *snel reageren* (binnen hoeveel tijd, en wat dan?) · *werken voor EDI* (welk bericht, welk formaat?) · *indien mogelijk* (wie beslist?). Herschrijving: verwijs naar ER-01/02 (laat, severity), ER-10 (wie wordt verwittigd), ER-11 (key account + critical = belopdracht), AC-05.2 (inhoud), ER-12 (max. 1 per order per 2 u), ER-07/ER-09 (missing status, 2 u / 30 min), US-06 (EDI = release 2, PO-beslissing).

## T7 — input (ook zonder oplossing te gebruiken)

| Item | Indicatie size |
|---|---:|
| A. US-06 EDI/API-statusberichten | 8 |
| B. US-09 Customs hold, action required | 5 |
| C. US-12 Voorkeuren in portaal | 5 |
| D. Consignee-openingsuren als regelinput | 5 |
| E. Haulier-app onboarding (top 20) | 3 |
| F. Uitrol naar alle klanten (toggle + communicatie) | 3 |
| G. Ochtendrapport voor de COO | 2 |

**Referentie:** F en E bovenaan (lage size, hoge waarde/risk reduction; F is de reden van release 2), dan A (grootste klant, stage gate), D (lost K5-gat op; afhankelijk van data — DEP-07 — dus eerst een spike), B (4% van de exceptions; juridische review van de tekst eerst), G (klein maar eerst behoefte valideren), C (1 van 5 klanten vroeg erom). Slice ±36: F + E + A + D-spike + B ≈ 3 + 3 + 8 + 2 + 5 + buffer. Business scoort value, wie de deadlines kent scoort time criticality, team scoort size, PO beslist.

## T8 — API-review

Mogelijke punten: `send` — wie mag het (owner group / shift lead) staat in de beschrijving maar niet als 403 in de responses; wat als de 5 minuten al voorbij zijn (409 — staat er)? maximumlengte notitie (280) — moet het UI dat tonen? mag de notitie persoonsgegevens bevatten (privacyrichtlijn in quick guide)? `tracking` — hoe wordt "eigen order" afgedwongen (token met customerId)? caching: hoe snel ziet de klant een nieuw bericht? tijd in UK-tijd als tekst — wat met klanten in Ierland (andere zone in de zomer)? Idempotency-Key is optioneel — zou die voor `send` niet verplicht moeten zijn (dubbel bericht = vertrouwensverlies)?

## T9 — BAT-scenario's EDI-statusberichten

Bv.: "Mijn grootste order loopt 3 uur vertraging op — komt het statusbericht in ons systeem aan, in de juiste tijdzone?" (EDI-klant) · "Dezelfde afvaart wordt drie keer bijgewerkt — krijgen we één bericht?" · "Een order die wij niet kennen (verkeerde referentie) — wat gebeurt er?" · "De vertraging herstelt zich — krijgen we 'back on schedule'?" · "Support: een klant vraagt waarom hij een bericht kreeg — kun je het uitleggen met de audit trail?" · "Mapping: komt de redencategorie correct over in hun code?" Entry: EDI-testverbinding met 2 klanten, mapping gereviewd, testset zonder echte data. Exit: alle scenario's uitgevoerd, geen open major, beide klanten bevestigen ontvangst en interpretatie.

## T10 — trade-off

Eigen component verder: regels en data al in productie, pilotbewijs, controle over planning; maar blijvend beheer voor support. Leveranciersmodule: minder eigen beheer, past in de SaaS-roadmap; maar datum al eens onzeker, dekking van de regels onbekend (throttling per order? hold bij missing status?). Omdat de regels in één module met 30 voorbeelden zitten, kun je die voorbeelden als **acceptatietest van de leveranciersmodule** gebruiken. Aanbeveling: release 2 op de eigen component, en een fit-gap van de leveranciersmodule met de 30 voorbeelden zodra er een testversie is; overstap plannen als ≥ 90% past. Beslissing: sponsor en PO (D-03-review).

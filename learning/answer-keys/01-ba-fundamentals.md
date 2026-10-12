# Antwoordsleutel — Module 1

> Open dit pas nadat je de [quiz](../modules/01-ba-fundamentals/quiz.md) en de oefeningen zelf hebt gemaakt. Een goed antwoord is pas "beheerst" als je de redenering in eigen woorden kunt geven.

## Quiz

### Q1 — B
De BA brengt drie gevraagde oplossingen terug tot één probleem ([probleemstelling, "Where the request came from"](../../docs/01-opportunity/problem-statement.md#where-the-request-came-from)). A en D slaan de analyse over; C maakt drie keer werk voor één probleem.

### Q2 — C
De PO is accountable voor de backlog en de volgorde. De BA bereidt de scoring voor (WSJF) maar beslist niet ([prioritisation, "How I prepare a prioritisation session"](../../docs/06-backlog/prioritisation.md#how-i-prepare-a-prioritisation-session)).

### Q3 — C
C beschrijft een gewenste uitkomst zonder te zeggen hoe. A, B en D zijn oplossingen — elk is een *optie* om de behoefte in C te vervullen.

### Q4 — B
Een KPI zonder baseline kan geen verandering aantonen. In de case zijn sommige baselines een steekproef (60 orders) omdat de data niet bestond — beter een eerlijke steekproef dan geen baseline ([KPI tree, "How each baseline is measured"](../../docs/01-opportunity/kpi-tree.md#how-each-baseline-is-measured)).

### Q5 — C
Weerstand verklein je door betrokkenheid en door het echte werk te begrijpen, niet door mensen te omzeilen ([stakeholder matrix](../../docs/02-discovery/stakeholders.md#stakeholder-matrix), [BAT plan](../../docs/09-acceptance/bat-plan.md#key-users)).

### Q6 — A
In veel organisaties overlapt het, maar het vertrekpunt verschilt: waarde en probleem (BA) vs. systeemgedrag in detail (FA). Geen van beiden beslist formeel over scope (B fout); BA's schrijven wel acceptatiecriteria (C fout).

### Q7 — B
Shadowing toont workarounds (het Excel-blad, het onderbreken door telefoons) die mensen in een interview vergeten of normaal vinden.

### Q8 — B
De test met echte statusgebeurtenissen voor 20 orders liet zien dat bijna alle berichten ruis zouden zijn; twee pilotklanten zeiden dat ze een mailregel zouden maken om ze te verwijderen ([options, "Why not O2?"](../../docs/01-opportunity/options-and-business-case.md#how-they-compare)). D klopt niet: O2 scoorde juist het best op kosten.

## Begeleide oefening

**Modeluitwerking — "een dashboard met alle creditnota's per klant".** Jouw versie mag anders zijn; vergelijk de *redenering*.

1. **Letterlijk:** finance wil een dashboard met creditnota's per klant. Waarom nu: de kosten van gemiste slots (±€140 per stuk) worden zichtbaar.
2. **Concreet voorbeeld:** "Vorige maand betaalden we 12 creditnota's aan Northfield, maar niemand kon zeggen waarom."
3. **Waarom-keten:** dashboard → om te zien waar het geld heen gaat → om te weten wat we moeten verbeteren → maar de **reden** staat niet op de creditnota → omdat bij het afsluiten van een vertraging niets wordt vastgelegd.
4. **Probleem:** *we kennen de oorzaak van creditnota's niet, dus we kunnen ze niet verminderen.*
5. **Stakeholders:** finance (wil leren), road planning (moet reden vastleggen — weerstand bij extra werk), klantendienst, PO. Beslisser over scope: de PO.
6. **Indicator:** % afgesloten exceptions met een geldige reason code (doel ≥ 95%), en creditnota's per oorzaakcategorie per maand.

**Verbinding met de case:** de verplichte reason code bij het afsluiten (US-04, AC-04.3; hotspot H-06) lost de kern al op. Een dashboard is daarna een kleine stap — maar zonder reason code toont het lege data.

## Zelfstandige uitdaging — richtlijn

Geen modelantwoord (dit is jouw werk); wel wat een sterk antwoord bevat:

- **Behoefte:** "Key accounts worden nooit verrast door iets ernstigs" — niet "elke wijziging".
- **Andere stakeholders:** planners (berichtenstorm, extra werk), pilotklanten (filteren berichten weg, zie O2-test), eventueel klantendienst (meer vragen over onbelangrijke wijzigingen).
- **Beslissing:** [D-02](../../docs/03-workshops/decision-log.md#d-02), eigenaar de PO; key accounts krijgen bij *critical* bovendien een belopdracht (ER-11).
- **Terugkoppeling (voorbeeld):** "Goed punt — dat was precies de discussie in de event storming. De PO heeft beslist dat key accounts alles hoort wat ernstig is, plus een persoonlijk telefoontje bij critical, maar niet elke kleine wijziging, omdat klanten die wegfilterden. Als je denkt dat er gevallen zijn die we zo missen, neem ik ze mee naar de PO met voorbeelden."

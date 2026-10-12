# Defend your case

> Voor elk hoofdartefact: **wat is het, waarom nodig, waarom deze aanpak, alternatieven, aannames, beperkingen, wat je met echte stakeholders zou valideren, en wat een senior BA zou vragen.** Kun je dit zonder te lezen, dan kun je de case verdedigen. Oefen met iemand die de laatste kolom als doorvraag stelt.

*De case is fictief. Elk antwoord dat je geeft, begint impliciet met: "In deze portfoliocase…".*

---

### 1. Probleemstelling — [doc](../../docs/01-opportunity/problem-statement.md)

| | |
|---|---|
| **Wat** | Het probleem achter drie gevraagde oplossingen, gemeten, met 5 whys en "what would change our mind". |
| **Waarom nodig** | Zonder gedeeld probleem bouw je de oplossing van de luidste vrager. |
| **Waarom zo** | Een probleemzin zonder oplossingswoorden + cijfers + wie het voelt: snel te toetsen door de PO. |
| **Alternatieven** | Een probleemboom; een Lean Canvas; een "jobs to be done"-formulering. |
| **Aannames** | De baselinecijfers (38% WISMO, 22% proactief, €140 per slot) zijn illustratief. |
| **Beperkingen** | Geen echte data; 5 whys is lineair en kan meerdere oorzaken missen. |
| **Valideren** | Contactredenen 2 weken taggen; steekproef van orders met e-mail- en belhistoriek; financedata over creditnota's. |
| **Senior BA vraagt** | "Hoe weet je dat WISMO over late orders gaat en niet over orders op tijd?" → *gecheckt: ±70% van de gesamplede WISMO's ging over late of risico-orders; anders was een statuspagina de oplossing.* |

### 2. Opties en business case — [doc](../../docs/01-opportunity/options-and-business-case.md)

| | |
|---|---|
| **Wat** | Vier opties gescoord op vooraf afgesproken gewichten; business case met gevoeligheid; pilot met stage gate. |
| **Waarom nodig** | De sponsor moet kunnen kiezen; de riskantste aanname moet benoemd. |
| **Waarom zo** | "Buy the information first": een pilot van ±€114k test de aanname die de case maakt of breekt. |
| **Alternatieven** | NPV/IRR-berekening; kosten-batenanalyse zonder scoring; direct alles financieren. |
| **Aannames** | 35% minder WISMO (riskantst), 30% minder gemiste slots, kosten per sprint €38k. |
| **Beperkingen** | Geen NPV of discontering; tijdsbesparing is capaciteit, geen headcount (expliciet gezegd). |
| **Valideren** | Kosten met finance; offerte leverancier; de 35% via de pilot met controlegroep. |
| **Senior BA vraagt** | "Waarom scoorde O4 slechter dan O3 op klantervaring?" → *Het scoorde juist beter (5 vs. 4), maar slechter op kost, afhankelijkheid en 'lost de oorzaak op'; gewichten waren vooraf afgesproken.* |

### 3. Stakeholderanalyse en RACI — [doc](../../docs/02-discovery/stakeholders.md)

| | |
|---|---|
| **Wat** | Invloed × belang, matrix met pijn/wens/weerstand/betrokkenheid, RACI per activiteit. |
| **Waarom nodig** | Weten wie je moet overtuigen en wie beslist. |
| **Waarom zo** | De weerstandskolom en de RACI-noot ("BA: veel R, weinig A") maken het bruikbaar. |
| **Alternatieven** | Stakeholder onion; Mendelow-grid alleen; persona's. |
| **Aannames** | Posities en weerstanden zijn verzonnen op basis van typische rollen. |
| **Beperkingen** | Statisch; in werkelijkheid verschuift invloed tijdens het project. |
| **Valideren** | Met de PO overlopen vóór de eerste workshop; na elke review bijwerken. |
| **Senior BA vraagt** | "Waarom zit de klant niet in de RACI?" → *Klanten tekenen geen BAT; hun feedback zit in BAT-07/08/10 als input, niet als goedkeuring.* |

### 4. Event storming en decision log — [board](../../docs/03-workshops/event-storming-board.md) · [log](../../docs/03-workshops/decision-log.md) · [dialoog](../../docs/03-workshops/workshop-dialogue.md)

| | |
|---|---|
| **Wat** | Big-picture event storming, hotspots met dot voting, beslissingen met eigenaar en waarom. |
| **Waarom nodig** | Vijf tegenstrijdigheden tussen teams die zelden samen zitten. |
| **Waarom zo** | Events laten iedereen bijdragen; meningsverschillen worden hotspots i.p.v. verborgen aannames. |
| **Alternatieven** | Procesworkshop met BPMN aan de muur; aparte interviews + synthesedocument; design sprint. |
| **Aannames** | Deelnemers en uitspraken zijn gesimuleerd. |
| **Beperkingen** | Ik heb geen echte event storming met een groep gefaciliteerd — dat zeg ik er eerlijk bij. |
| **Valideren** | Met een echte groep; de facilitatiekeuzes (stil schrijven eerst) blijven geldig. |
| **Senior BA vraagt** | "Wat doe je als de PO niet in de kamer is bij een hotspot?" → *Eigenaar en datum noteren; opties binnen een week; geen beslissing in de kamer.* |

### 5. BPMN AS-IS / TO-BE en gap-analyse — [AS-IS](../../docs/04-process/as-is.md) · [TO-BE](../../docs/04-process/to-be.md) · [gaps](../../docs/04-process/gap-analysis.md)

| | |
|---|---|
| **Wat** | BPMN 2.0 (geldige XML) met lanes per rol/systeem, pijnpunten P1–P6, gap-analyse met type verandering. |
| **Waarom nodig** | Toont dat het probleem tussen mensen zit, niet in het TMS. |
| **Waarom zo** | Eén scenario (afvaartvertraging); de klant als lane voor leesbaarheid (bewuste afwijking van pool + message flows). |
| **Alternatieven** | Swimlane in Visio zonder BPMN-semantiek; value stream map; SIPOC. |
| **Aannames** | Het AS-IS is gebaseerd op gesimuleerde shadowing. |
| **Beperkingen** | Escalatie als gateway i.p.v. timer boundary event; klant niet als aparte pool. |
| **Valideren** | AS-IS laten bevestigen door een planner van elke shift. |
| **Senior BA vraagt** | "Waarom geen timer event voor de response time?" → *Goed punt: dat is correcter BPMN; ik koos leesbaarheid voor de business, en de regel staat in ER-09.* |

### 6. Exception rules en beslistabel — [doc](../../docs/05-requirements/exception-rules.md)

| | |
|---|---|
| **Wat** | 13 beslisregels + kanaalregel, beslistabel met volgorde, 30 uitvoerbare voorbeelden. |
| **Waarom nodig** | De oorzaak was het ontbreken van regels. |
| **Waarom zo** | Eén module gebruikt door prototype, rule explorer, demo en tests: ze kunnen niet uit elkaar groeien. |
| **Alternatieven** | DMN-beslistabellen; regels in proza; configuratie in het TMS. |
| **Aannames** | Drempels 2 u / 6 u komen uit gesimuleerde klantgesprekken ("een uur speling"). |
| **Beperkingen** | Geen openingsuren van de consignee (BAT-02-noot); throttling vast op 2 u. |
| **Valideren** | Een maand echte events door de regels laten lopen en planners laten scoren (BAT-02). |
| **Senior BA vraagt** | "Waarom staat de venstercheck bovenaan de tabel?" → *Zodat een vertraagde afvaart geen klanten alarmeert van wie de levering nog op tijd is — de volgorde is een ontwerpbeslissing.* "Waarom geen DMN?" → *Kan; ik koos Gherkin-voorbeelden omdat de business ze leest en ze in CI draaien.* |

### 7. Requirements en traceability — [requirements](../../docs/05-requirements/requirements.md) · [traceability](../../docs/05-requirements/traceability.md)

| | |
|---|---|
| **Wat** | BR/FR/NFR/DQ met ID's; matrix van pijnpunt tot KPI; script dat ID's controleert. |
| **Waarom nodig** | Niets bouwen zonder reden, niets beloven zonder test. |
| **Alternatieven** | Jira/Confluence-links; een RTM in Excel (staat ook in de workbook). |
| **Beperkingen** | Markdown-tabellen schalen niet naar honderden requirements. |
| **Senior BA vraagt** | "Hoe houd je dit actueel?" → *Deel van de DoD; en het script faalt in CI als een ID ontbreekt.* |

### 8. User stories, story map, WSJF — [stories](../../docs/06-backlog/user-stories.md) · [prioritering](../../docs/06-backlog/prioritisation.md)

| | |
|---|---|
| **Wat** | 10 stories + 2 enablers voor R1, splitsingen, WSJF met trade-offs van de PO. |
| **Waarom zo** | WSJF maakt kleine waardevolle items zichtbaar; afhankelijkheden bepalen de volgorde. |
| **Alternatieven** | Alleen MoSCoW; Kano; RICE; value vs. effort. |
| **Aannames** | Scores zijn relatieve oordelen in een gesimuleerde sessie; velocity ±18–20. |
| **Beperkingen** | Geen echte schattingen van een echt team. |
| **Senior BA vraagt** | "Waarom zit US-03 (laagste WSJF) toch in R1?" → *Zonder lijst blijven planners in Excel; scope werd wel geknipt (filters naar R2).* |

### 9. UX en design — [UX-specificatie](../../docs/07-design/ux-specification.md) · [personas](../../docs/07-design/personas-and-journeys.md) · [Figma](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI)

| | |
|---|---|
| **Wat** | Persona's, journeys, IA, flows, wireframes, tokens, statussen, UX-1 – UX-8; Figma-schermen; werkende demo. |
| **Waarom zo** | Elke keuze gekoppeld aan een behoefte; gedrag getest in code. |
| **Alternatieven** | Alleen Figma-prototype; usability-lab. |
| **Beperkingen** | Geen echte gebruikerstest; de control tower staat niet in Figma (gezegd). |
| **Senior BA vraagt** | "Waarom geen kaart?" → *UX-8: klanten willen het gevolg voor hun venster, niet de positie.* |

### 10. Architectuur en API — [overzicht](../../docs/12-architecture/README.md) · [contract](../../demo/mock-apis/openapi.yaml)

| | |
|---|---|
| **Wat** | Context, componenten, voorgesteld vs. geïmplementeerd, integratie, idempotentie, foutafhandeling, OpenAPI, datamodel, security. |
| **Waarom zo** | Klein houden (D-03); geen broker of microservices zonder reden. |
| **Alternatieven** | Integratieplatform; leveranciersmodule afwachten; extern visibility-platform. |
| **Aannames** | TMS-gedrag (TA-1 – TA-6). |
| **Beperkingen** | Niet gereviewd door een echte architect of securityteam; out-of-order events niet in de demo. |
| **Valideren** | Spike met de leverancier; architectuurreview; DPO. |
| **Senior BA vraagt** | "Is het jouw rol om een architectuur te tekenen?" → *Nee — de architect beslist; ik maak het concreet genoeg om de juiste vragen te stellen en de gevolgen voor gebruikers te zien.* |

### 11. Teststrategie, BAT en go-live — [strategie](../../docs/09-acceptance/test-strategy.md) · [BAT](../../docs/09-acceptance/bat-log.md) · [readiness](../../docs/10-go-live/release-readiness.md)

| | |
|---|---|
| **Wat** | Testniveaus, 32+ testgevallen gekoppeld aan echte tests, gesimuleerde BAT, go/no-go, rollback, hypercare. |
| **Waarom zo** | Uitgevoerd en gesimuleerd bewijs gescheiden. |
| **Beperkingen** | BAT is gesimuleerd; geen echte go-live. |
| **Senior BA vraagt** | "Wat als de BAT-key users het oneens zijn met de regels?" → *Dan is de regel fout of onvolledig — zoals BAT-02 (openingsuren); dat gaat als item naar de PO.* |

### 12. De demo — [control tower](../../demo/README.md)

| | |
|---|---|
| **Wat** | Werkende, geteste demo van de release op dezelfde regels. |
| **Waarom** | Gedrag tonen waar analysefouten zich verstoppen (throttling, recovery, escalatie). |
| **Beperking** | Een BA schrijft normaal geen productiecode; de demo bewijst dat de specificatie precies genoeg is, niet dat ik developer ben. |
| **Senior BA vraagt** | "Wat leerde je door het te bouwen?" → *Vijf open vragen (OQ-01 – OQ-05) en een privacylek in de eerste klant-API: bouwen is ook een review.* |

---

[← Vragen](questions.md) · [Simulaties →](simulations.md)

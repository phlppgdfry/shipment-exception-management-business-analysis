# Module 3 — Requirements engineering

> **Niveau:** gevorderd · **Tijd:** ±6 uur · **Voorkennis:** modules 1–2 · **Artefacten:** [requirements](../../../docs/05-requirements/requirements.md), [exception rules](../../../docs/05-requirements/exception-rules.md), [user stories](../../../docs/06-backlog/user-stories.md), [feature file](../../../docs/06-backlog/features/exception-decision.feature), [traceability](../../../docs/05-requirements/traceability.md)

## 1. Leerdoelen

Na deze module kun je:

1. business-, functionele en niet-functionele requirements onderscheiden en schrijven;
2. een user story schrijven met *rol, wens, reden* en testbare acceptatiecriteria;
3. acceptatiecriteria in Gherkin (Given/When/Then) schrijven, inclusief grens- en foutgevallen;
4. bedrijfsregels apart houden van stories en ze in een beslistabel zetten;
5. dubbelzinnigheid in een requirement vinden en verwijderen;
6. traceability opbouwen: doel → proces → requirement → story → test → KPI;
7. scope bewaken met MoSCoW en "won't (this release)".

## 2. Uitleg in gewone taal

Een **requirement** is een uitspraak over wat nodig is, zo geschreven dat iemand kan nagaan of het gehaald is. Er zijn drie niveaus:

| Niveau | Vraag | Voorbeeld (uit de case) |
|---|---|---|
| **Business requirement (BR)** | Wat moet de organisatie bereiken? | BR-1: klanten horen een major/critical exception vóór het venster begint |
| **Functional requirement (FR)** | Wat moet het systeem doen? | FR-10: klantberichten per order throttlen (ER-12) |
| **Non-functional requirement (NFR)** | Hoe goed, hoe snel, hoe veilig? | NFR-03: een event dat twee keer verwerkt wordt, opent nooit een tweede exception |

**Stakeholder requirements** zitten ertussen: wat een groep nodig heeft ("planners willen geen extra werk"). In deze case zijn ze verwerkt in de [stakeholdermatrix](../../../docs/02-discovery/stakeholders.md) en de guardrail-KPI's.

### User stories

> **As a** road planner **I want** every change to be classified as no exception, minor, major or critical **so that** I only look at what puts the delivery window at risk.

De drie delen hebben elk een functie: *wie* (zodat je weet wie het accepteert), *wat* (de functie), *waarom* (zodat het team een betere oplossing mag voorstellen). Een story is **een belofte voor een gesprek**, geen volledige specificatie — de details staan in de acceptatiecriteria en de regels.

**INVEST** helpt een goede story herkennen: Independent, Negotiable, Valuable, Estimable, Small, Testable.

### Acceptatiecriteria en Gherkin

Acceptatiecriteria zeggen wanneer een story *af* is. **Gherkin** schrijft ze als:

```gherkin
Given een open exception van verschillende severities
When ik de workbench open
Then komt critical eerst, dan major, dan minor, en binnen een severity de vroegste due time eerst
```

In deze case zijn de beslisregels een **Examples-tabel** van 30 rijen die als test draait. Elke rij is een concreet voorbeeld met een verwacht resultaat. Dat heet ook *specification by example*: het voorbeeld ís de specificatie.

### Bedrijfsregels apart houden

Een regel ("120–359 min = major") verandert vaker dan een story. Zet regels in een **regeltabel met ID's** (ER-01 …) en een **beslistabel**, en laat stories ernaar verwijzen. Dan kan de PO een parameter wijzigen zonder elke story te herschrijven, en tonen de tests welke voorbeelden van betekenis veranderen.

### Dubbelzinnigheid

Woorden die alarm moeten doen afgaan: *snel, tijdig, gebruiksvriendelijk, ongeveer, enz., indien nodig, laat*. "Laat" was in deze case de grootste: drie teams telden drie verschillende dingen. Het antwoord werd een **definitie** (D-01) en een **regel** (ER-01), niet een betere zin.

### Traceability

Elke requirement komt ergens vandaan en gaat ergens heen. De lijn in deze case:

> pijnpunt P5 → BR-1 → FR-06, FR-10 → ER-10, ER-12 → US-05, US-07 → AC-01.6, AC-07.1, BAT-07/08 → K1, K3, K8

Zo is niets gebouwd zonder reden en niets beloofd zonder test ([traceability](../../../docs/05-requirements/traceability.md)). In deze repository controleert een script dat elke ID die ergens gebruikt wordt ook gedefinieerd is (`scripts/validate_repo.py`).

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| BR / FR / NFR | business / functional / non-functional requirement |
| User story | korte beschrijving van een behoefte vanuit een gebruiker: rol, wens, reden |
| Acceptatiecriterium (AC) | voorwaarde waaraan een story moet voldoen om af te zijn |
| Gherkin | Given/When/Then-taal voor acceptatiecriteria |
| Specification by example | specificeren met concrete voorbeelden die ook tests zijn |
| Bedrijfsregel | beleid dat bepaalt wat er gebeurt (ER-xx) |
| Beslistabel | tabel met voorwaarden en uitkomsten per regel |
| Grenswaarde | waarde op de rand van een regel (119/120 min) |
| MoSCoW | Must, Should, Could, Won't (this time) |
| Traceability | koppeling van doel tot test en KPI |
| Enabler | technisch werk dat een story mogelijk maakt (EN-1) |
| INVEST | criteria voor een goede story |

## 4. Voorbeelden

**Van vaag naar testbaar (NFR):**

| Vaag | Testbaar |
|---|---|
| "Het systeem moet snel reageren." | "95% van de wijzigingen wordt binnen 2 min na het TMS-event geëvalueerd; het klantbericht vertrekt binnen 5 min na het openen van de exception." (NFR-01) |
| "Klantgegevens moeten veilig zijn." | "Berichten bevatten nooit naam, telefoonnummer of locatie van de chauffeur." (NFR-05) |

**Een grensgeval dat een bug voorkwam:** AC-07.3 "precies 2 uur na het laatste bericht: opnieuw verwittigen". Zonder dit voorbeeld kiest een developer `<` of `<=` op goed geluk.

**Een fout in een acceptatiecriterium (uit de case):** throttling stond "per exception" in de eerste versie. In BAT kreeg een klant twee mails in 10 minuten over één order (DEF-04). Nieuw criterium: throttling **per order**.

## 5. In deze repository

| Lees | Let op |
|---|---|
| [Requirements](../../../docs/05-requirements/requirements.md) | elke NFR heeft "how it is verified" |
| [Exception rules](../../../docs/05-requirements/exception-rules.md) | regeltabel, beslistabel, "why these thresholds", "rejected rules" |
| [User stories](../../../docs/06-backlog/user-stories.md) | US-07 en de toevoeging na DEF-04 |
| [Feature file](../../../docs/06-backlog/features/exception-decision.feature) | 30 voorbeelden; draaien in CI |
| [Traceability](../../../docs/05-requirements/traceability.md) | "One pain point, followed all the way" |
| [Test cases](../../../docs/09-acceptance/test-cases.md) | requirements → tests |

**Zelf proberen:** wijzig in de feature file de verwachte severity van AC-01.6 naar `MINOR` en draai `node --test tests/*.test.mjs`. De test faalt en toont precies welk voorbeeld van betekenis veranderd is. Zet het daarna terug.

## 6. Stap voor stap (tutorial)

**Van behoefte naar story met criteria in 7 stappen.**

1. Start bij het **pijnpunt** en de **BR** (waarom bestaat dit?).
2. Kies de **rol** die de waarde ervaart (niet "het systeem", niet "de gebruiker").
3. Schrijf de **wens** in gewone taal, zonder schermdetails.
4. Schrijf het **"so that"** als meetbaar effect.
5. Zoek de **regels** die gelden; verwijs naar hun ID's in plaats van ze te herhalen.
6. Schrijf **criteria**: eerst het normale geval, dan **grenzen**, dan **fouten** ("Given het e-mailadres bounced…").
7. Controleer met **INVEST** en de [Definition of Ready](../../../docs/06-backlog/definition-of-ready-done.md).

## 7. Begeleide oefening

**Herschrijf deze zwakke story** voor de klantendienst:

> "Als gebruiker wil ik een goed overzicht van de belopdrachten zodat het beter werkt."

Hulpvragen: wie is "gebruiker"? Wat is "goed"? Welke regel maakt belopdrachten aan (ER-11)? Wat moet er gebeuren bij het afsluiten (US-11)? Welk foutgeval hoort erbij?

Schrijf de story + minstens 4 Gherkin-criteria (normaal, grens, fout, rechten). Vergelijk met de [modeluitwerking](../../answer-keys/03-requirements.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

De PO wil een nieuwe regel: **"Leveringen naar een consignee die op vrijdag om 16:00 sluit, gaan bij een vertraging na 14:00 één niveau omhoog."** (Komt uit de BAT-02-noot.)

1. Schrijf de regel als nieuwe regel (volgend nummer in de regeltabel) met eigenaar en voorbeeld.
2. Zoek **3 dubbelzinnigheden** in de zin van de PO en stel de vragen die je zou stellen.
3. Schrijf **5 voorbeeldrijen** voor de Examples-tabel, inclusief twee grenswaarden.
4. Benoem welke **data** ontbreekt (hint: [DEP-07](../../../docs/01-opportunity/registers.md#dependencies)) en welke NFR geraakt wordt.

**Rubric (10 p.):** regel precies en testbaar (2) · drie echte dubbelzinnigheden (2) · voorbeelden met grenzen (3) · data-afhankelijkheid gezien (2) · verwijzingen correct (1).

## 9. Quiz

[Quiz module 3](quiz.md) — 8 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/03-requirements.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| "Als systeem wil ik…" | de rol is een mens of een externe partij die de waarde ervaart; technisch werk is een enabler |
| Schermdetails in de story ("een blauwe knop rechtsboven") | wens en reden in de story; ontwerp in Figma/UX |
| Alleen het happy path in de criteria | grenzen en foutgevallen vinden de bugs |
| Regels herhaald in tien stories | één regeltabel met ID's; stories verwijzen |
| NFR's als bijzaak ("snel", "veilig") | meetbaar maken én zeggen hoe je het verifieert |
| Alles "Must" | MoSCoW voor de release; volgorde binnen de release met WSJF |
| Zelf een klantvraag beantwoorden in refinement | markeren als vraag voor de PO/klant (DEF-04-les) |

## 11. Interviewvragen

1. Wat is het verschil tussen een functionele en een niet-functionele requirement? Geef van elk een meetbaar voorbeeld.
2. Hoe schrijf je goede acceptatiecriteria?
3. Wat doe je als een stakeholder zegt "het moet gebruiksvriendelijk zijn"?
4. Waarom houd je bedrijfsregels apart van user stories?
5. Hoe zorg je voor traceability zonder een zware tool?
6. Vertel over een requirement die fout bleek. (In de case: throttling per exception → per order.)

## 12. Competentiechecklist

- [ ] Ik kan BR, FR en NFR onderscheiden en van elk een meetbaar voorbeeld geven.
- [ ] Ik kan een story schrijven die INVEST doorstaat.
- [ ] Ik kan Gherkin-criteria schrijven met normaal geval, grens en fout.
- [ ] Ik kan de beslistabel van deze case rij voor rij uitleggen, inclusief waarom de volgorde ertoe doet.
- [ ] Ik kan in een requirement drie dubbelzinnigheden aanwijzen.
- [ ] Ik kan de traceability-lijn van P5 tot K3 uit het hoofd navertellen.
- [ ] Ik heb een voorbeeld in de feature file gewijzigd, de test zien falen en teruggezet.
- [ ] Ik heb de uitdaging gemaakt (≥ 7/10).

---

[← Module 2](../02-process-analysis/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 4 — Agile & Scrum →](../04-agile-scrum/README.md)

# Module 8 — Logistiek domein: short sea, RoRo en multimodaal

> **Niveau:** start · **Tijd:** ±4 uur · **Voorkennis:** geen · **Artefacten:** [context](../../../docs/02-discovery/context.md), [glossary (EN)](../../../docs/02-discovery/glossary.md), [bronnenregister](../../../docs/02-discovery/sources.md), [event storming](../../../docs/03-workshops/event-storming-board.md), [companion case](https://github.com/phlppgdfry/shortsea-booking-functional-analysis)

*Deze module legt algemene praktijk uit en verwijst naar publieke bronnen. Ze beweert niets over de interne werking van een bestaand bedrijf. Tidewell is fictief.*

## 1. Leerdoelen

Na deze module kun je:

1. short sea shipping, RoRo, LoLo, quay-to-quay en door-to-door uitleggen;
2. de keten van een door-to-door order beschrijven: pre-carriage, terminal, overtocht, on-carriage, levering;
3. uitleggen wat een TMS, een TOS en een boekings-/afvaartsysteem doen, en hoe ze samenhangen;
4. milestones en statussen van een zending benoemen en uitleggen waar ze vandaan komen;
5. de typische oorzaken van uitzonderingen kennen (afvaart, weg, terminal, douane, ontbrekende status) en wie ze bezit;
6. de belangrijkste termen correct gebruiken in een gesprek met planners en klanten;
7. drie actuele contextfactoren noemen (douane VK–EU, eFTI, event-standaarden) en weten wat (nog) onzeker is.

## 2. Uitleg in gewone taal

### Short sea en RoRo

**Short sea shipping** is vervoer over zee binnen Europa en naar buurlanden (VK, Ierland, Scandinavië, Iberië), in tegenstelling tot deep sea (intercontinentaal). Volgens Eurostat was short sea in 2023 goed voor ±56,6% van het zeevervoer van en naar de belangrijkste EU-havens ([S-01](../../../docs/02-discovery/sources.md)).

**RoRo (roll-on/roll-off):** lading rijdt het schip op en af — trailers, vrachtwagens, auto's, soms op een rolplatform. **LoLo (lift-on/lift-off):** containers worden met kranen geladen. RoRo is snel aan de kade en past goed bij trailers die daarna over de weg verder gaan.

- **Begeleid (accompanied):** de chauffeur rijdt mee met de vrachtwagen.
- **Onbegeleid (unaccompanied):** alleen de trailer gaat mee; aan de overkant haalt een andere trekker hem op. Dat maakt **multimodaal** werk nodig: wie haalt op, wanneer is de trailer vrij, wie levert?

### Quay-to-quay vs. door-to-door

| | Quay-to-quay | Door-to-door |
|---|---|---|
| Klant koopt | de overtocht van terminal tot terminal | het hele traject van verlader tot ontvanger |
| Wie regelt de weg | de klant (vaak een expediteur) | de operator, met onderaannemers (hauliers) |
| Belofte | afvaart en aankomsttijd | een **leveringsvenster** bij de ontvanger |
| Deze case | buiten scope | **in scope** |

### De keten van een door-to-door order

```text
Order ontvangen → Ophaling bij verlader (pre-carriage, weg/spoor) → Gate-in terminal (BE)
→ Geladen / afvaart → Overtocht → Aankomst terminal (VK) → Lossen, douane
→ Gate-out → On-carriage (weg) → Levering in het venster bij de consignee
```

Elke pijl is een **milestone**. Een vertraging kan op elke stap ontstaan; wat telt voor de klant is of de levering **binnen het afgesproken venster** blijft (D-01).

### Systemen

| Systeem | Doet | Voorbeeld van data |
|---|---|---|
| **TMS** (transport management system) | orders, planning, statussen, klantportaal | order, venster, ETA, status |
| **Boekings-/afvaartsysteem** | afvaarten, capaciteit, boekingen | afvaart E-312 vertrekt 18:00 i.p.v. 12:00 |
| **TOS** (terminal operating system) | wat er op de terminal gebeurt | gate-in, gelost, positie op het terrein |
| **Haulier-app** | statussen van onderaannemers | "vertraagd, ETA 11:00" — alleen als ze de app gebruiken |
| **Douanesystemen / makelaar** | aangiftes, blokkades, vrijgave | "commodity code ontbreekt" |
| **ERP** | facturatie, creditnota's | — |

### Uitzonderingen en wie ze bezit (in deze case)

| Oorzaak | Typisch | Eigenaar (ER-08) |
|---|---|---|
| Afvaart vertraagd / geannuleerd | technisch, weer, drukte | road planning (de levering moet herpland) |
| Vertraging op de weg | file, panne | road planning |
| Terminalvertraging | congestie, lossen | terminal operations |
| Douaneblokkade | ontbrekende documenten | customs desk |
| Ontbrekende status | haulier zonder app | road planning (eerst bevestigen, D-04) |

### Context die beweegt (en wat onzeker is)

- **Douane VK–EU:** sinds de brexit zijn er controles op EU-goederen naar het VK, gefaseerd ingevoerd met meerdere uitstellen (Border Target Operating Model, [S-08](../../../docs/02-discovery/sources.md)) — de actuele stand is in het register als *te valideren* gemarkeerd.
- **eFTI:** de EU-verordening die autoriteiten verplicht vrachtinformatie elektronisch te aanvaarden; volledige toepassing volgens de Commissie in juli 2027 ([S-07](../../../docs/02-discovery/sources.md)).
- **Event-standaarden:** DCSA Track & Trace beschrijft zendingsgebeurtenissen voor containervaart; het idee (events met uniek ID, abonnementen, gecorrigeerde events) inspireerde het integratieontwerp ([S-05, S-06](../../../docs/02-discovery/sources.md)).

## 3. Begrippen

| NL / EN | Betekenis |
|---|---|
| Short sea shipping | zeevervoer binnen Europa en naar buurlanden |
| RoRo / LoLo | lading rijdt op en af / wordt gehesen |
| Begeleid / onbegeleid | met / zonder chauffeur aan boord |
| Quay-to-quay / door-to-door | terminal tot terminal / verlader tot ontvanger |
| Pre-carriage / on-carriage | voortransport / natransport (meestal weg) |
| Haulier | wegvervoerder, vaak onderaannemer |
| Consignee | ontvanger van de goederen (vaak niet de klant) |
| Shipper / forwarder | verlader / expediteur |
| Leveringsvenster | afgesproken tijdvenster voor levering |
| ETA | verwachte aankomsttijd |
| Milestone | mijlpaal in de keten (gate-in, afvaart…) |
| Reefer | koelunit — altijd tijdkritisch in deze case |
| Gate-in / gate-out | binnenkomen / verlaten van de terminal |
| Customs hold | douaneblokkade |
| WISMO | "where is my order"-contact |
| TMS / TOS | transport / terminal operating system |

Een uitgebreidere Nederlandse lijst: [glossary](../../glossary.md).

## 4. Voorbeelden

**Waarom "later dan gepland" niet "te laat" is:** de afvaart van Calder Retail vertrekt 6 uur later, maar het venster loopt tot 16:00 en de nieuwe ETA is 14:30. Voor de klant verandert er niets → geen uitzondering (ER-01). In de demo zie je het in scenariostap 3.

**Waarom een reefer anders is:** gekoelde voeding verliest houdbaarheid en het distributiecentrum heeft vaste koelcellen; een uur te laat kost meer dan bij papierrollen. Daarom één niveau hoger (ER-04).

**Waarom een ontbrekende status meestal geen probleem is:** ±de helft van de hauliers gebruikt de app niet; stilte betekent meestal "geen update", niet "probleem". Daarom eerst bevestigen (ER-07).

## 5. In deze repository

| Lees / doe | Let op |
|---|---|
| [Context](../../../docs/02-discovery/context.md) | systeemlandschap en scope |
| [Glossary (EN)](../../../docs/02-discovery/glossary.md) | elk woord waarover gediscussieerd werd |
| [Event storming-bord](../../../docs/03-workshops/event-storming-board.md) | de tijdlijn van "er verandert iets" tot "afgesloten" |
| [Bronnenregister](../../../docs/02-discovery/sources.md) | verschil feit / praktijk / aanname / voorstel |
| [Control tower → Shipments](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/shipments/D2D-48213/) | route met drie legs en de milestones |

## 6. Stap voor stap (tutorial)

**Een order "lezen" zoals een planner (10 min per order).**

1. Open [D2D-48213](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/shipments/D2D-48213/) in de demo.
2. **Wie is de klant, wie de consignee?** Wat is de lading en is ze tijdkritisch?
3. **Wat is de belofte?** Het venster — niet de geplande ETA.
4. **Waar zit de order nu** in de keten? Welke milestones zijn bereikt?
5. **Welke afvaart**, en welke legs volgen nog?
6. **Wat kan er misgaan** op de resterende legs, en wie zou het bezitten?
7. **Wat zou de klant willen weten** als het misgaat — en wat niet (geen chauffeursnaam)?

## 7. Begeleide oefening

**Beschrijf de keten van een onbegeleide trailer van Gent naar een DC in Leeds** (fictief), met minstens 8 milestones, de systemen die elke milestone registreren en per stap één mogelijke uitzondering met eigenaar. Vergelijk met de [modeluitwerking](../../answer-keys/08-logistics-domain.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

Bereid een **gesprek van 10 minuten met een planner** voor (je bent nieuw in het domein): 8 vragen die laten zien dat je de keten begrijpt en die iets opleveren voor de analyse (geen quizvragen). Leg per vraag uit wat je ermee wil leren.

**Rubric (10 p.):** vragen gaan over echte beslissingen en pijn (4) · juiste termen (2) · volgorde van algemeen naar concreet (2) · telkens duidelijk waarom je het vraagt (2).

## 9. Quiz

[Quiz module 8](quiz.md) — 8 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/08-logistics-domain.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| "Klant" en "consignee" door elkaar | de klant betaalt en krijgt de berichten; de consignee ontvangt de goederen |
| ETA-wijziging = vertraging | alleen relevant tegenover het **venster** |
| Doen alsof je het domein kent | "ik ken het uit publieke bronnen; vertel me hoe het hier gaat" |
| Interne informatie van een echt bedrijf veronderstellen | fictieve case, publieke bronnen, aannames labelen |
| Douane als "IT-probleem" zien | het is een documentenprobleem met een eigen eigenaar en klantactie |

## 11. Interviewvragen

1. Wat is het verschil tussen quay-to-quay en door-to-door, en waarom maakt dat uit voor de analyse?
2. Waar komen de statussen van een zending vandaan, en hoe betrouwbaar zijn ze?
3. Wat weet je over onze sector? (Antwoord met publieke feiten en vragen, nooit met beweringen over interne processen.)
4. Wat zijn typische oorzaken van vertraging in RoRo-ketens en wie lost ze op?
5. Hoe zou je een planner overtuigen om een nieuw scherm te gebruiken?

## 12. Competentiechecklist

- [ ] Ik kan short sea, RoRo/LoLo, begeleid/onbegeleid en quay-to-quay/door-to-door uitleggen.
- [ ] Ik kan de keten van een door-to-door order tekenen met milestones en systemen.
- [ ] Ik kan per uitzonderingsoorzaak de eigenaar en de reden noemen.
- [ ] Ik kan uitleggen waarom een reefer en een ontbrekende status anders behandeld worden.
- [ ] Ik ken drie contextfactoren en weet welke onzeker zijn.
- [ ] Ik gebruik klant/consignee/haulier/expediteur correct.
- [ ] Ik heb de oefening en de uitdaging gemaakt (≥ 7/10).

---

[← Module 7](../07-testing-delivery/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 9 — Case-oefeningen →](../09-case-exercises/README.md)

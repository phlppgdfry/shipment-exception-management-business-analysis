# Module 2 — Procesanalyse: BPMN 2.0, AS-IS/TO-BE en UML

> **Niveau:** start → gevorderd · **Tijd:** ±5 uur · **Voorkennis:** module 1 · **Artefacten:** [AS-IS](../../../docs/04-process/as-is.md), [TO-BE](../../../docs/04-process/to-be.md), [gap-analyse](../../../docs/04-process/gap-analysis.md), [UML](../../../docs/04-process/uml.md), [`.bpmn`-bestanden](../../../docs/04-process/bpmn/)

## 1. Leerdoelen

Na deze module kun je:

1. de BPMN-elementen *event, activity, gateway, sequence flow, message flow, pool, lane* herkennen en correct gebruiken;
2. het verschil uitleggen tussen een exclusieve (XOR), parallelle (AND) en inclusieve (OR) gateway;
3. een AS-IS-proces modelleren uit interview- of shadowingnotities, met genummerde pijnpunten;
4. een TO-BE afleiden en de verschillen in een gap-analyse zetten (met *type* verandering);
5. kiezen tussen BPMN, een UML-activiteitendiagram, een sequentiediagram en een state diagram — en uitleggen waarom;
6. een `.bpmn`-bestand openen, lezen en aanpassen in een BPMN-tool.

## 2. Uitleg in gewone taal

Een **procesmodel** toont *wie wat doet in welke volgorde*, zodat mensen uit verschillende teams over hetzelfde praten. **BPMN 2.0** (Business Process Model and Notation) is de standaard van de OMG ([S-10](../../../docs/02-discovery/sources.md)); een `.bpmn`-bestand is XML die elke BPMN-tool kan openen.

### De bouwstenen

| Element | Vorm | Betekenis | Voorbeeld in de TO-BE |
|---|---|---|---|
| Start event | dunne cirkel | iets gebeurt waardoor het proces begint | "Status, ETA or sailing change" |
| End event | dikke cirkel | het proces eindigt | "Exception closed, KPIs logged" |
| Task (activity) | afgeronde rechthoek | werk dat iemand of iets doet | "Re-plan delivery, agree new window" |
| User task / service task / send task | rechthoek met icoon | door een mens / door een systeem / een bericht versturen | "Evaluate exception rules" is een service task |
| Exclusive gateway (XOR) | ruit met × | precies één uitgang | "Exception?" ja/nee |
| Parallel gateway (AND) | ruit met + | alle uitgangen tegelijk | (niet in deze TO-BE) |
| Inclusive gateway (OR) | ruit met ○ | één of meer uitgangen | "Customer notification?" kan ook als OR gemodelleerd worden |
| Sequence flow | volle pijl | volgorde binnen één pool | |
| Message flow | stippellijn | bericht tussen pools (organisaties) | klant ↔ Tidewell als je de klant een eigen pool geeft |
| Pool / lane | grote rechthoek / strook | organisatie / rol of systeem | lanes: TMS, exception component, planner, klantendienst, klant |

**Gateway-regel:** een gateway *beslist niet*; hij volgt een voorwaarde die ergens anders gedefinieerd is. In de TO-BE staat de voorwaarde "Exception?" in de [regels ER-01 – ER-07](../../../docs/05-requirements/exception-rules.md). Daarom zijn proces en regels twee aparte artefacten die naar elkaar verwijzen.

### AS-IS en TO-BE

- **AS-IS:** hoe het nu echt gaat — inclusief workarounds (het Excel-blad) en wachttijden. Nummer de pijnpunten (P1–P6) zodat je er later naar kunt verwijzen.
- **TO-BE:** hoe het na de verandering gaat. Elke wijziging verwijst naar een pijnpunt.
- **Gap-analyse:** per stap het verschil, het *type* verandering (systeem, beleid, organisatie, proces) en wie geraakt wordt. Het type bepaalt het werk: een systeemgap → backlog; een beleidsgap → beslissing; een organisatiegap → training en communicatie ([gap-analyse](../../../docs/04-process/gap-analysis.md)).

### Wanneer welk diagram?

| Vraag | Diagram | In deze case |
|---|---|---|
| Wie doet wat in welke volgorde, over rollen heen? | BPMN met lanes | AS-IS, TO-BE |
| Welke stappen en beslissingen binnen één flow, ook parallel? | UML activiteitendiagram | [exception handling](../../../docs/04-process/gap-analysis.md#exception-handling--uml-activity-diagram) |
| Welke berichten gaan tussen systemen, in welke volgorde? | UML sequentiediagram | [hoe de systemen praten](../../../docs/04-process/uml.md#how-the-systems-talk-uml-sequence-diagram) |
| In welke toestanden kan één ding zijn, en hoe gaat het over? | UML state diagram | [exception lifecycle](../../../docs/12-architecture/data-model-and-states.md#exception-state-machine) |
| Wie gebruikt het systeem waarvoor? | UML use case diagram | [use cases](../../../docs/04-process/uml.md#use-cases-uml-use-case-diagram) |

### Procesoptimalisatie — zonder Lean-jargon

Kijk naar vijf dingen: **wachttijd** (de klant hoort het pas aan de poort), **dubbel werk** (orders overtikken in Excel), **onderbrekingen** (planner die telefoons beantwoordt), **ontbrekende eigenaar** (niemand "moet" de klant verwittigen) en **ontbrekende beslisregel** (gevoel bepaalt wat "laat" is). De TO-BE in deze case lost vooral de laatste twee op — en dat is de kern.

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| BPMN 2.0 | standaardnotatie voor bedrijfsprocessen (OMG) |
| Pool / lane | organisatie / rol of systeem binnen een organisatie |
| Event | iets dat gebeurt (start, tussen, eind) |
| Activity / task | werk |
| Gateway (XOR, AND, OR) | splitsing of samenvoeging van de flow |
| Sequence flow / message flow | volgorde binnen een pool / bericht tussen pools |
| AS-IS / TO-BE | huidige / gewenste situatie |
| Pijnpunt | concreet probleem in het AS-IS, met bewijs |
| Gap-analyse | verschil AS-IS ↔ TO-BE per stap, met type verandering |
| Happy path / exception flow | normaal pad / afwijkend pad |
| UML | Unified Modeling Language: familie van diagrammen voor software |
| State machine | toestanden en overgangen van één object |

## 4. Voorbeelden

**Een gateway goed benoemen.** Fout: een ruit met "Controle" erin. Goed: een vraag met antwoorden op de uitgaande pijlen: "Exception?" → *ja* / *nee*.

**Een pijnpunt met bewijs.** Zwak: "Planners werken inefficiënt." Sterk: "P3 — Getroffen orders worden manueel opgezocht en in een Excel-blad gezet; shadowing: ±25 min per vertraagde afvaart."

**Een modelkeuze verantwoorden** (uit [as-is.md](../../../docs/04-process/as-is.md#modelling-choices)): "De klant staat als lane in dezelfde pool zodat het wachten aan het slot naast onze eigen stappen zichtbaar is. Formeel zou de klant een eigen pool met message flows krijgen."

## 5. In deze repository

| Lees / open | Let op |
|---|---|
| [AS-IS](../../../docs/04-process/as-is.md) | pijnpunten P1–P6 en "Why model it at all?" |
| [TO-BE](../../../docs/04-process/to-be.md) | kolom "Fixes" — elke stap verwijst naar een pijnpunt |
| [Gap-analyse](../../../docs/04-process/gap-analysis.md) | het *type* verandering per gap |
| [`to-be.bpmn`](../../../docs/04-process/bpmn/to-be.bpmn) | open in [bpmn.io](https://demo.bpmn.io) of Camunda Modeler |
| [UML](../../../docs/04-process/uml.md) | de drie diagrammen en wat de testers in het state diagram vonden |
| [Architectuur, OQ-01..05](../../../docs/12-architecture/README.md#open-questions-found-while-building-the-demo) | gaten die pas zichtbaar werden toen de demo gebouwd werd |

## 6. Stap voor stap (tutorial)

**Een AS-IS modelleren uit shadowingnotities.**

1. **Kies één scenario** (hier: een afvaart is vertraagd). Niet alle oorzaken tegelijk.
2. **Bepaal de lanes**: per *rol* die iets doet, en per *systeem* dat iets doet. Te veel lanes = te veel detail.
3. **Start event**: wat zet het in gang? ("Sailing delay published.")
4. **Leg de taken in volgorde** zoals ze *echt* gebeuren, inclusief workarounds (chat, Excel).
5. **Voeg gateways toe** waar iemand een keuze maakt; schrijf de vraag in de ruit en de antwoorden op de pijlen.
6. **End event(s)**: waar eindigt het voor de klant? ("Customer calls at the slot.")
7. **Nummer de pijnpunten** op het diagram en zet ze in een tabel met bewijs.
8. **Valideer** met één persoon die het werk doet: "Klopt dit voor een gewone dinsdag?"
9. **Bewaar als `.bpmn`** (niet alleen een afbeelding), zodat anderen het kunnen aanpassen.

**Oefenen in een tool:** open [demo.bpmn.io](https://demo.bpmn.io), sleep `to-be.bpmn` erin, voeg een *timer boundary event* toe op "Acknowledge within response time" en sluit het aan op "Escalate to shift lead". Dat is de correctere BPMN-manier om ER-09 te tonen dan een gateway "Within response time?".

## 7. Begeleide oefening

**Modelleer het AS-IS van een *douaneblokkade* (customs hold)** in dezelfde organisatie. Gegeven (uit de [interviewnotities](../../../docs/02-discovery/interview-notes.md)):

- De douanemakelaar zet een blokkade in het systeem; het TMS toont "customs hold".
- De customs desk ziet het soms pas uren later; ze mailen de klant met wat er ontbreekt.
- De klant antwoordt traag; intussen staat de trailer op de terminal en loopt het leveringsvenster af.
- Planners weten vaak niet dat er een blokkade is en plannen de levering gewoon in.

Teken (papier, bpmn.io of tekst) met lanes *Customs broker, TMS, Customs desk, Road planner, Customer*. Nummer minstens 3 pijnpunten. Bewaar in `learning/my-work/module-02.md` (afbeelding of beschrijving) en vergelijk met de [modeluitwerking](../../answer-keys/02-process-analysis.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

Maak het **TO-BE voor de customs hold** (release 2, US-09) en een **gap-analyse van 4–6 rijen** met het type verandering. Gebruik ER-06 (customs = major, eigenaar customs desk, klant moet actie ondernemen, nooit gethrottled).

**Rubric (10 p.):** correcte BPMN-elementen en gateways met vraag/antwoorden (3) · elke TO-BE-stap verwijst naar een pijnpunt of regel (2) · gap-analyse met type verandering en wie geraakt wordt (3) · één bewuste modelkeuze uitgelegd (2). ≥ 7 = beheerst.

## 9. Quiz

[Quiz module 2](quiz.md) — 8 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/02-process-analysis.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| Het TO-BE modelleren voordat het AS-IS gevalideerd is | eerst AS-IS laten bevestigen door wie het werk doet |
| Een gateway die "beslist" zonder vraag of zonder labels op de pijlen | vraag in de ruit, antwoord op elke pijl, voorwaarde gedefinieerd in de regels |
| Alles in één diagram: elke oorzaak, elk detail | één scenario per diagram; varianten in een tabel |
| Sequence flows tussen pools | tussen pools gebruik je message flows |
| Alleen een PNG bewaren | het `.bpmn`-bestand is het artefact; de afbeelding is een export |
| Een systeem als "actor" vergeten | systemen die iets doen krijgen een lane (TMS, exception component) |
| Het state diagram overslaan | testers vonden er twee ontbrekende overgangen mee; de demo vond er nog drie |

## 11. Interviewvragen

1. Wat is het verschil tussen een sequence flow en een message flow?
2. Wanneer gebruik je een parallelle gateway in plaats van een exclusieve?
3. Hoe zorg je dat een AS-IS de werkelijkheid toont en niet het handboek?
4. Waarom heb je zowel BPMN als een state diagram gemaakt?
5. Hoe zou je dit proces in Visio of Visual Paradigm maken, als je bpmn.io gebruikte? (Eerlijk: de notatie is dezelfde; de bestanden zijn BPMN 2.0-XML die elke tool importeert.)

## 12. Competentiechecklist

- [ ] Ik kan elk BPMN-element in de TO-BE benoemen en uitleggen.
- [ ] Ik kan XOR, AND en OR uitleggen met een eigen voorbeeld.
- [ ] Ik kan uitleggen waarom het AS-IS "niet het TMS" als probleem toont.
- [ ] Ik kan een gap-analyse maken met het type verandering per gap.
- [ ] Ik kan kiezen tussen BPMN, activiteiten-, sequentie- en state diagram, met reden.
- [ ] Ik heb `to-be.bpmn` geopend en een timer boundary event toegevoegd.
- [ ] Ik heb de begeleide oefening en de uitdaging gemaakt (≥ 7/10).

---

[← Module 1](../01-ba-fundamentals/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 3 — Requirements →](../03-requirements/README.md)

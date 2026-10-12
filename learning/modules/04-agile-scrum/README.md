# Module 4 — Agile & Scrum, en de plaats van de BA erin

> **Niveau:** start → gevorderd · **Tijd:** ±4 uur · **Voorkennis:** modules 1 en 3 · **Artefacten:** [product vision en roadmap](../../../docs/06-backlog/product-vision-and-roadmap.md), [story map](../../../docs/06-backlog/story-map.md), [prioritering](../../../docs/06-backlog/prioritisation.md), [DoR/DoD](../../../docs/06-backlog/definition-of-ready-done.md), [sprint plan](../../../docs/08-delivery/sprint-plan.md), [refinement log](../../../docs/08-delivery/refinement-log.md), [review & retro](../../../docs/08-delivery/sprint-review.md), [rollen](../../../docs/08-delivery/roles-and-responsibilities.md)

## 1. Leerdoelen

Na deze module kun je:

1. de Agile-waarden en de Scrum-verantwoordelijkheden, -events en -artefacten uitleggen;
2. uitleggen waar de BA in Scrum past (de Scrum Guide kent geen BA-rol) zonder de PO te vervangen;
3. een refinement voorbereiden en leiden, en vragen met een eigenaar vastleggen;
4. prioriteren met MoSCoW en WSJF, en uitleggen waarom beide nodig zijn;
5. een story map en een release slice maken;
6. een Definition of Ready en Done opstellen en gebruiken;
7. sprintdoelen formuleren die een uitkomst zijn, geen takenlijst.

## 2. Uitleg in gewone taal

**Agile** is een manier van werken in korte cycli met vroeg en vaak feedback. **Scrum** is het bekendste raamwerk daarvoor ([Scrum Guide 2020, S-12](../../../docs/02-discovery/sources.md)).

### Scrum in één tabel

| Onderdeel | Wat | In deze case |
|---|---|---|
| **Product Owner** | eigenaar van de backlog en de waarde | PO "Customer Visibility" |
| **Scrum Master** | effectiviteit van het team, de events | runt ceremonies, hypercare-rooster |
| **Developers** | maken het increment | 4 developers, 1 tester — en de BA |
| **Sprint** | vaste periode (hier 2 weken) | sprint 1 en 2 |
| **Sprint planning** | wat en waarom deze sprint | sprintdoel + items |
| **Daily scrum** | 15 min afstemmen | BA haalt domeinvragen op |
| **Sprint review** | increment tonen, feedback | demo-script met de developer |
| **Retrospective** | samenwerking verbeteren | BA-actie na DEF-04 |
| **Product backlog** | geordende lijst | WSJF-tabel |
| **Sprint backlog** | wat het team deze sprint doet | sprint plan |
| **Increment** | werkend resultaat dat aan de DoD voldoet | |

**Backlog refinement** is in de Scrum Guide geen apart event, maar een doorlopende activiteit. Voor een BA is het het belangrijkste moment: hier worden stories *ready*.

### Waar staat de BA?

De Scrum Guide noemt drie verantwoordelijkheden; "business analyst" is er niet bij. In de praktijk werkt de BA **in het team als een van de Developers** (in de Scrum-betekenis: iedereen die aan het increment werkt), met analyse als specialisme, en **ondersteunt** de PO. Valkuil: de BA wordt "proxy-PO" en beslist dingen die de PO hoort te beslissen. Zie [rollen, "Where the lines blur"](../../../docs/08-delivery/roles-and-responsibilities.md#where-the-lines-blur--and-how-this-case-handles-it).

### Prioriteren: MoSCoW én WSJF

- **MoSCoW** zegt *wat in de release zit* (Must, Should, Could, Won't this time).
- **WSJF** (Weighted Shortest Job First) zegt *in welke volgorde*: cost of delay ÷ size. Cost of delay = business value + time criticality + risk reduction/opportunity enablement.
- In de case noemde iedereen alles "Must". WSJF maakte kleine waardevolle items zichtbaar: EN-2 (1 punt, en niets werkt zonder venster) kwam bovenaan.
- **Afhankelijkheden** bepalen de bouwvolgorde: US-07 (throttling) scoort hoog maar kan pas als US-01 en US-05 bestaan.

### Story map

Een story map zet de gebruikersactiviteiten horizontaal (detecteren → beslissen → werken → informeren → afsluiten) en de stories verticaal. Een horizontale snede is een **release**: de dunste versie die end-to-end waarde levert ([story map](../../../docs/06-backlog/story-map.md)).

### DoR en DoD

- **Definition of Ready:** wanneer mag een story een sprint in? (O.a. criteria met minstens één grens- of foutgeval, open vragen beantwoord of geparkeerd met eigenaar, afhankelijkheden bekend.)
- **Definition of Done:** wanneer is iets af? Deze case heeft er twee: op **storyniveau** en op **releaseniveau** ("ready for production": BAT getekend, support getraind, rollback getest).

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| Agile | iteratief werken met snelle feedback |
| Scrum | raamwerk met PO, SM, Developers; sprints en vijf events |
| Product backlog | geordende lijst van alles wat aan het product kan veranderen |
| Refinement | stories verduidelijken, splitsen, schatten |
| Story points | relatieve schatting van omvang |
| Velocity | gemiddeld aantal punten per sprint (hier ±18–20) |
| Sprintdoel | de uitkomst die de sprint moet opleveren |
| MoSCoW | Must/Should/Could/Won't |
| WSJF | cost of delay ÷ size |
| Story map | activiteiten × stories, met release-snedes |
| DoR / DoD | Definition of Ready / Done |
| Increment | werkend resultaat van een sprint |
| Spike | korte, time-boxed verkenning (TMS-webhooks, 2 dagen) |

## 4. Voorbeelden

**Een sprintdoel als uitkomst:** "A planner sees the right exceptions" (sprint 1). Niet: "EN-1, US-01, US-02 en US-03 bouwen".

**Een refinementvraag goed vastleggen** ([refinement log](../../../docs/08-delivery/refinement-log.md)):

| # | Vraag (wie) | Antwoord (wie besliste) | Werd |
|---|---|---|---|
| Q2 | "Precies 120 minuten: major of minor?" (tester) | Major; grenzen horen bij het hogere niveau (PO) | AC-01.5 – AC-01.8 grensparen |

**Een story splitsen:** "Planner manages exceptions" (13 pt) → US-03 workbench · US-04 acknowledge/re-plan/resolve · US-08 missing status. Reden: te groot, en missing status had andere regels en een andere stakeholder.

## 5. In deze repository

| Lees | Let op |
|---|---|
| [Product vision en roadmap](../../../docs/06-backlog/product-vision-and-roadmap.md) | outcome-based roadmap, "not on the roadmap" |
| [Prioritering](../../../docs/06-backlog/prioritisation.md) | "WSJF ranks; dependencies sequence" en de trade-offs van de PO |
| [Refinement log](../../../docs/08-delivery/refinement-log.md) | Q6 — de vraag die fout beantwoord werd |
| [Sprint review & retro](../../../docs/08-delivery/sprint-review.md) | de retro-actie van de BA zelf |
| [DoR/DoD](../../../docs/06-backlog/definition-of-ready-done.md) | waarom een aparte release-DoD |
| [Delivery workspace in de demo](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/delivery/) | backlog, sprints, BAT, go/no-go op één scherm |

## 6. Stap voor stap (tutorial)

**Een refinement van 60 minuten voorbereiden en leiden.**

1. **Twee dagen vooraf:** kies 3–5 stories die bovenaan staan; check ze tegen de DoR; markeer wat ontbreekt.
2. **Stuur ze vooraf** naar team en PO, met de open vragen erbij.
3. **Begin met het waarom** (1 min per story): pijnpunt, BR, wie het vroeg.
4. **Loop de criteria en voorbeelden door**; laat de tester grensgevallen zoeken.
5. **Elke vraag krijgt een eigenaar** in het log. Klantgerichte vragen → PO, dezelfde dag (retro-les).
6. **Splits** wat te groot is (> halve sprint), op waarde, niet op technische lagen.
7. **Laat het team schatten**; jij schat niet mee als je niet bouwt.
8. **Sluit af:** welke stories zijn ready, welke niet en waarom.

## 7. Begeleide oefening

**WSJF-sessie voorbereiden.** Drie nieuwe items voor release 2:

- *Consignee-openingsuren als input voor de regels* (uit BAT-02)
- *Haulier-app onboarding voor de 20 grootste hauliers* (minder held exceptions, D-04)
- *Meldingsvoorkeuren in het portaal* (US-12)

Geef per item een **voorstel** voor business value, time criticality en risk reduction (Fibonacci 1–13) met één zin uitleg per cel, en een vraag aan wie de size schat. Bereken WSJF met een veronderstelde size. Wie scoort welke kolom? Vergelijk met de [modeluitwerking](../../answer-keys/04-agile-scrum.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

De sponsor wil na week 6 van de pilot "meteen alle klanten aanzetten" omdat de eerste cijfers goed zijn. De stage gate is pas in week 12.

Schrijf een korte notitie aan de PO (max. 1 pagina): wat staat er op het spel, welke informatie heb je nog niet, welke opties zijn er (minstens drie), en wat zou je aanraden — *zonder* zelf te beslissen. Gebruik de [benefits review](../../../docs/11-measure/benefits-review.md) en [D-07](../../../docs/03-workshops/decision-log.md#d-07).

**Rubric (10 p.):** risico's concreet (controlegroep, guardrails, seizoen) (3) · minstens drie opties met gevolgen (3) · aanbeveling met voorwaarde (2) · beslissing blijft bij PO/sponsor (2).

## 9. Quiz

[Quiz module 4](quiz.md) — 8 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/04-agile-scrum.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| De BA als "proxy-PO" die prioriteit bepaalt | voorstellen met redenering; de PO beslist en het staat in het log |
| Stories pas in de sprint uitwerken | refinement een sprint vooruit; DoR als poort |
| Sprintdoel = lijst van tickets | sprintdoel = uitkomst voor een gebruiker |
| WSJF alleen invullen | de business scoort value, het team scoort size, de PO beslist |
| Retro = klagen over anderen | één eigen actie met eigenaar |
| "Done" = gemerged | release-DoD: BAT, support, rollback, communicatie |
| Splitsen per technische laag (frontend/backend) | splitsen per waarde (workbench / missing status) |

## 11. Interviewvragen

1. Wat is jouw rol in sprint planning, review en retrospective als BA?
2. Hoe verschilt jouw verantwoordelijkheid van die van de PO?
3. Hoe prioriteer je als iedereen zegt dat alles "Must" is?
4. Wat staat er in een goede Definition of Ready?
5. Een developer heeft midden in de sprint een vraag die je niet kunt beantwoorden. Wat doe je?
6. Heb je in een professioneel Scrum-team gewerkt? (Eerlijk antwoorden — zie [transferverhaal](../../interview-preparation/transfer-story.md).)

## 12. Competentiechecklist

- [ ] Ik kan de Scrum-rollen, -events en -artefacten opsommen en uitleggen.
- [ ] Ik kan uitleggen waar de BA in Scrum past zonder de PO te vervangen.
- [ ] Ik kan MoSCoW en WSJF naast elkaar gebruiken en het verschil uitleggen.
- [ ] Ik kan de WSJF-score van EN-2 narekenen en uitleggen waarom die bovenaan staat.
- [ ] Ik kan een refinement voorbereiden volgens de 8 stappen.
- [ ] Ik kan het verschil tussen story-DoD en release-DoD uitleggen.
- [ ] Ik heb de begeleide oefening en de uitdaging gemaakt (≥ 7/10).

---

[← Module 3](../03-requirements/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 5 — UX en productontwerp →](../05-ux-design/README.md)

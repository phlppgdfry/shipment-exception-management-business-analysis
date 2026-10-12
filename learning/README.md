# Learning Lab — IT Business Analysis, geleerd aan één echte case

> Een gestructureerde cursus in het Nederlands (met de gangbare Engelse vaktermen) om de methodes in deze repository te **begrijpen, toe te passen en te verdedigen**. Elke module verwijst naar de echte artefacten van de case. Interactief oefenen kan op de [Learning Lab-pagina](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/learning/).

## Waarom deze cursus bestaat

Deze repository toont een volledige BA-aanpak. Maar **gemaakt is niet beheerst**: de case is grotendeels met AI-hulp opgebouwd ([AI-herkomst](ai-provenance.md)). Competentie toon je pas met je **eigen** antwoorden op de oefeningen, de uitdagingen en de [competentietaken](assessment/README.md) — niet doordat de bestanden bestaan. De [voortgangstracker](progress-tracker.md) begint daarom overal op "niet gestart".

## Curriculum

| # | Module | Tijd | Kernartefacten in de case |
|---|---|---:|---|
| 1 | [IT Business Analysis: de basis](modules/01-ba-fundamentals/README.md) | 3 u | probleemstelling, business case, stakeholders |
| 2 | [Procesanalyse: BPMN, AS-IS/TO-BE, UML](modules/02-process-analysis/README.md) | 5 u | `.bpmn`, gap-analyse, state diagram |
| 3 | [Requirements engineering](modules/03-requirements/README.md) | 6 u | requirements, regels, stories, feature file, traceability |
| 4 | [Agile & Scrum](modules/04-agile-scrum/README.md) | 4 u | roadmap, WSJF, DoR/DoD, refinement, retro |
| 5 | [UX en productontwerp](modules/05-ux-design/README.md) | 4 u | persona's, journeys, UX-specificatie, Figma |
| 6 | [Technische fundamenten](modules/06-technical-fundamentals/README.md) | 6 u | architectuur, OpenAPI, JSON, idempotentie |
| 7 | [Testen, UAT en oplevering](modules/07-testing-delivery/README.md) | 5 u | teststrategie, BAT, go/no-go, support |
| 8 | [Logistiek domein](modules/08-logistics-domain/README.md) | 4 u | context, glossary, bronnen |
| 9 | [Realistische case-oefeningen](modules/09-case-exercises/README.md) | 8 u | de hele case + demo |
| 10 | [Interviewvoorbereiding](modules/10-interview-preparation/README.md) | 6 u | vragen, defend your case, simulaties |
| — | [Competentietaken met rubrics](assessment/README.md) | 10 u | 10 praktijktaken |

**Totaal ±60 uur.** Moeilijkheid loopt op: 1, 8 → 2, 4, 5 → 3, 6, 7 → 9, 10 → competentietaken.

## Elke module heeft dezelfde 12 delen + een aparte antwoordsleutel

1. Leerdoelen · 2. Uitleg in gewone taal · 3. Begrippen · 4. Voorbeelden · 5. In deze repository · 6. Stap voor stap (tutorial) · 7. Begeleide oefening · 8. Zelfstandige uitdaging (met rubric) · 9. Quiz (`quiz.md`) · 10. Veelgemaakte fouten · 11. Interviewvragen · 12. Competentiechecklist — en **13. de antwoordsleutel** in [`answer-keys/`](answer-keys/), bewust gescheiden van de opdrachten.

Een script (`scripts/validate_repo.py`) controleert in CI dat elke module alle delen heeft en dat elke quiz een even lange, aparte antwoordsleutel heeft.

## Hoe je het gebruikt

1. Lees de module en open de artefacten waar ze naar verwijst.
2. Doe de **tutorial** met de echte bestanden (BPMN-tool, feature file, demo).
3. Maak de **begeleide oefening** in [`my-work/`](my-work/README.md) — pas daarna de modeluitwerking openen.
4. Maak de **uitdaging** en scoor jezelf eerlijk met de rubric (of laat iemand anders scoren).
5. Doe de **quiz** (hier of interactief); lees de uitleg ook bij goede antwoorden.
6. Vink de **checklist** pas af als je het zonder tekst kunt; noteer niveau en bewijs in de [tracker](progress-tracker.md).

## Mapping naar de voorgestelde mapstructuur

De oorspronkelijke opdracht stelde aparte mappen voor curriculum, tutorials, exercises, quizzes, practical challenges, interview preparation en glossary. Hier zit alles **per module** samen (uitleg, tutorial, oefening, uitdaging en quiz in één map), omdat je zo één onderwerp van begin tot eind doorloopt zonder tussen mappen te springen. Alleen wat je *niet* tijdens het oefenen mag zien, staat apart: [`answer-keys/`](answer-keys/) en [`assessment/reference-solutions/`](assessment/reference-solutions/README.md).

| Voorgesteld | Hier |
|---|---|
| curriculum/ | deze README |
| tutorials/, exercises/, quizzes/, practical-challenges/ | `modules/NN-*/` (secties 6–9) |
| interview-preparation/ | [`interview-preparation/`](interview-preparation/README.md) |
| glossary/ | [`glossary.md`](glossary.md) |
| progress-tracker.md | [`progress-tracker.md`](progress-tracker.md) |
| (praktische competentietoets) | [`assessment/`](assessment/README.md) |

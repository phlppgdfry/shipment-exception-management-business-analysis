# Module 9 — Realistische case-oefeningen

> **Niveau:** gevorderd · **Tijd:** ±8 uur (verspreid) · **Voorkennis:** modules 1–8 · **Artefacten:** de hele case; vooral de [control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/) en de [regels](../../../docs/05-requirements/exception-rules.md)

## 1. Leerdoelen

Na deze module kun je, in de context van de fictieve organisatie Tidewell:

1. een nieuwe vraag van de business van begin tot eind analyseren onder tijdsdruk;
2. de juiste techniek kiezen (interview, workshop, model, regel, story, test) en dat verantwoorden;
3. een wijziging doorrekenen tot in de regels, de voorbeelden, de stories en de KPI's (impactanalyse);
4. een stakeholderconflict voorbereiden met opties en een beslissingseigenaar;
5. je werk zo presenteren dat een PO er in 10 minuten over kan beslissen.

## 2. Uitleg in gewone taal

Modules 1–8 leerden technieken. In het echte werk komen ze **door elkaar** binnen: een gangvraag van een directeur wordt een workshop, een regel, drie stories en een testplan. Deze module oefent dat met vier cases van oplopende moeilijkheid. Elke case heeft een **briefing**, een **opdracht** en een **tijdslimiet**. Werk zonder de modeluitwerking open te hebben; leg je werk vast in `learning/my-work/`.

Werkwijze per case (de "BA-lus"):

1. **Begrijp** — wat wordt gevraagd, door wie, waarom nu?
2. **Verken** — welke artefacten in de case raakt dit? (Zoek op ID's.)
3. **Analyseer** — model, regel of story: welke vorm helpt het meest?
4. **Weeg af** — opties met gevolgen; wie beslist?
5. **Specificeer** — zo precies dat iemand het kan bouwen en testen.
6. **Communiceer** — één pagina voor de beslisser.

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| Impactanalyse | nagaan welke artefacten, systemen en mensen een wijziging raakt |
| Change request | formeel verzoek tot wijziging van scope of gedrag |
| Time-box | vaste maximale tijd voor een taak |
| Beslisnota | één pagina met vraag, opties, gevolgen, aanbeveling en eigenaar |
| Spike | korte verkenning om onzekerheid te verkleinen |

## 4. Voorbeelden

**Impactanalyse in één tabel (voorbeeld: drempel major van 120 naar 90 min):**

| Artefact | Impact |
|---|---|
| ER-02, beslistabel | parameter wijzigt |
| Feature file | AC-01.5 (119 min) wordt major; nieuwe grensparen 89/90 |
| Tests | 1+ voorbeelden veranderen van betekenis → CI toont welke |
| KPI | K7 false alarms en planner-workload (guardrail) stijgen waarschijnlijk; K1 kan stijgen |
| Mensen | planners (meer exceptions — eerder ±60% bij 60 min), klanten (meer berichten) |
| Beslisser | PO, na overleg met road planning lead |

## 5. In deze repository

Gebruik als bronnen: [regels](../../../docs/05-requirements/exception-rules.md), [stories](../../../docs/06-backlog/user-stories.md), [traceability](../../../docs/05-requirements/traceability.md), [registers](../../../docs/01-opportunity/registers.md), [decision log](../../../docs/03-workshops/decision-log.md), [benefits review](../../../docs/11-measure/benefits-review.md), de [rule explorer](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/rules/) en de [control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/).

## 6. Stap voor stap (tutorial)

**Case 0 (voorgedaan): "Kunnen klanten zelf kiezen dat ze ook minor-berichten krijgen?"**

1. *Begrijp:* een pilotklant vroeg het; de PO wil weten of het in R1 kan.
2. *Verken:* ER-10 kent al "prefersAllUpdates"; US-12 (voorkeuren in portaal) is R2; in R1 zet CS de vlag op verzoek.
3. *Analyseer:* geen nieuwe regel nodig; het is een **kanaal**-vraag (wie zet de vlag).
4. *Weeg af:* (a) CS zet de vlag manueel (bestaat); (b) US-12 naar voren halen (5 pt); (c) niets doen.
5. *Specificeer:* voor (a) een stap in het KB-artikel; AC-01.4 dekt het gedrag al.
6. *Communiceer:* "Dit kan vandaag al: CS zet 'every update' aan. US-12 blijft in R2 tenzij meer klanten erom vragen (1 van 5 nu)."

## 7. Begeleide oefening

**Case 1 — Het ochtendrapport (time-box 60 min).** De COO wil "elke ochtend om 07:00 een mail met alle problemen van vandaag".

Opdracht: (1) herformuleer de behoefte; (2) welke bestaande data/KPI's beantwoorden het al; (3) welk risico zit in "alle problemen"; (4) schrijf één story met 3 criteria; (5) welke beslissing moet de PO nemen?

Vergelijk met de [modeluitwerking](../../answer-keys/09-case-exercises.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

Kies **twee** van de drie cases. Time-box: 2 uur per case.

**Case 2 — Ierland erbij.** De sponsor wil de pilot uitbreiden naar de route BE–IE. Ierse leveringen hebben vaak vensters van een hele dag en meer douanecontroles. *Lever:* impactanalyse (regels, data, mensen, KPI's), twee open vragen voor wie, en een aanbeveling in beslisnotaformaat.

**Case 3 — De klacht.** Een pilotklant klaagt: "Jullie zeiden om 09:15 dat de levering om 13:30 kwam, maar het werd 13:50 en we hoorden niets." *Lever:* zoek in de demo uit wat er gebeurde (hint: [D2D-48231](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/exceptions/?id=EX-1003)), leg uit of het een regel of een bug is (KB "rule or bug?"), en stel — als je denkt dat de regel moet veranderen — een wijziging voor met voorbeelden.

**Case 4 — Het conflict.** De customs desk lead wil dat douaneblokkades *altijd critical* zijn ("anders reageren klanten niet"); de PO vreest berichtmoeheid. *Lever:* voorbereiding van een gesprek van 20 minuten: belangen per partij, data die je nodig hebt (hint: 4% van de exceptions in de pilot), drie opties met gevolgen, en wie beslist.

**Rubric per case (10 p.):** behoefte juist (2) · impact volledig (artefacten, data, mensen, KPI) (3) · opties met gevolgen (2) · eigenaar en volgende stap (2) · bondig (1). ≥ 7 = beheerst.

## 9. Quiz

[Quiz module 9](quiz.md) — 6 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/09-case-exercises.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| Meteen oplossen | eerst de BA-lus: begrijp → verken |
| Impact alleen in software zien | ook data, mensen, KPI's, communicatie |
| Een klacht meteen een bug noemen | eerst nagaan wat de regels beslisten (audit trail) |
| Eindeloos analyseren | time-box; een aanbeveling met voorwaarde is beter dan geen |
| Beslisnota van vijf pagina's | één pagina: vraag, opties, gevolgen, aanbeveling, eigenaar |

## 11. Interviewvragen

Veel interviews hebben een **case-opdracht**. Oefen deze hardop met een timer van 15 minuten:

1. "Onze klanten klagen over te veel e-mails. Wat doe je?"
2. "Een directeur wil een dashboard. Hoe begin je?"
3. "Je krijgt twee tegenstrijdige requirements van twee managers. Wat doe je?"
4. "Een feature is live en de cijfers verbeteren niet. Wat analyseer je?"

Uitgewerkte aanpakken: interviewvragen, case-based.

## 12. Competentiechecklist

- [ ] Ik heb de BA-lus toegepast op case 0 zonder te kijken.
- [ ] Ik heb case 1 gemaakt en vergeleken met de modeluitwerking.
- [ ] Ik heb twee van de cases 2–4 gemaakt en ≥ 7/10 gescoord.
- [ ] Ik kan een impactanalyse maken over artefacten, data, mensen en KPI's.
- [ ] Ik kan in de demo achterhalen waarom een klant (geen) bericht kreeg.
- [ ] Ik kan een beslisnota van één pagina schrijven.

---

[← Module 8](../08-logistics-domain/README.md) · [Learning Lab](../../README.md) · Volgende: Module 10 — Interviewvoorbereiding →

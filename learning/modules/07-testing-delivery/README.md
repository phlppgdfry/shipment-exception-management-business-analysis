# Module 7 — Testen, UAT en oplevering

> **Niveau:** gevorderd · **Tijd:** ±5 uur · **Voorkennis:** modules 3–4 · **Artefacten:** [teststrategie](../../../docs/09-acceptance/test-strategy.md), [testgevallen](../../../docs/09-acceptance/test-cases.md), [testresultaten](../../../docs/09-acceptance/test-results.md), [BAT-plan](../../../docs/09-acceptance/bat-plan.md), [BAT-log](../../../docs/09-acceptance/bat-log.md), [release readiness](../../../docs/10-go-live/release-readiness.md), [support handover](../../../docs/10-go-live/support-handover.md), [communicatieplan](../../../docs/10-go-live/communication-plan.md)

## 1. Leerdoelen

Na deze module kun je:

1. de testniveaus uitleggen (regels, unit, integratie/contract, systeem, acceptatie) en wie wat test;
2. testgevallen schrijven met grenswaarden, beslistabellen en state transitions, inclusief negatieve gevallen;
3. het verschil uitleggen tussen systeemtest en Business Acceptance Testing (BAT/UAT);
4. een BAT organiseren: key users, scenario's, planning, ernstdefinities, entry/exit;
5. een defect triëren (fix, known issue met datum, of uitstellen) en de levenscyclus van een defect volgen;
6. een go/no-go voorbereiden met een eigenaar per criterium, rollback en hypercare;
7. een supportoverdracht en eindgebruikersdocumentatie laten maken;
8. **uitgevoerde** testresultaten scheiden van gesimuleerde of beloofde.

## 2. Uitleg in gewone taal

**Testen** beantwoordt twee verschillende vragen:

- *Doet de software wat de stories zeggen?* → het team test (tester, developers).
- *Is wat de stories zeggen wat de business nodig heeft?* → de business test (**BAT** of **UAT**: user/business acceptance testing), met de mensen die ermee moeten leven, in situaties die ze herkennen.

De belangrijkste les uit de [BAT-log](../../../docs/09-acceptance/bat-log.md): *drie van de vier major-bevindingen kwamen van mensen die echte berichten in hun eigen context lazen. De tests van het team waren groen: de stories waren voldaan, de behoefte niet.*

### Testtechnieken die een BA moet kennen

| Techniek | Idee | Voorbeeld |
|---|---|---|
| Grenswaardenanalyse | test net onder, op en net boven elke grens | 119 / 120 / 359 / 360 min |
| Beslistabeltest | elke rij van de beslistabel is een test | 30 voorbeelden |
| State transition test | elke pijl, én verboden pijlen | resolve vóór acknowledge → 409 |
| Negatief testen | wat mag níét lukken | terminal coordinator wijzigt planning-exception → geweigerd |
| Scenariotest | een volledig verhaal van begin tot eind | het 10-stappenscenario |
| Exploratief | vrij proberen met een doel | "breek het met een slechte dag die je je herinnert" |

### Defecten

Ernst: **blocker** (fout bericht aan klant, datalek, planner kan niet werken → geen go-live), **major** (fout resultaat, geen redelijke workaround → fixen vóór go-live), **minor** (workaround bestaat → known issue met datum), **cosmetic** (backlog). Levenscyclus: *nieuw → getrieerd (PO beslist) → gefixt → hertest → gesloten*.

### Productieklaar

"Af" is meer dan "gemerged": BAT getekend, support getraind, KB-artikel gepubliceerd, monitoring en rollback getest, klanten geïnformeerd, **go/no-go door de PO** ([release readiness](../../../docs/10-go-live/release-readiness.md)). Met **shadow mode** (alles loggen, niets versturen) en **gefaseerd aanzetten** per klant verklein je het risico. **Hypercare** = de eerste weken met extra aandacht en duidelijke drempels.

### Bewijs eerlijk labelen

In deze repository is er **uitgevoerd** bewijs (tests die een tool echt draaide: [testresultaten](../../../docs/09-acceptance/test-results.md)) en **gesimuleerd** bewijs (de BAT van een fictief team). Die mogen nooit door elkaar lopen. Een test is pas "geslaagd" als een tool het rapporteerde.

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| Teststrategie | aanpak: niveaus, technieken, verantwoordelijken, bewijs |
| Testgeval | voorwaarden, actie, verwacht resultaat |
| Regressietest | opnieuw testen of bestaand gedrag nog werkt |
| BAT / UAT | acceptatietest door de business / gebruikers |
| Key user | ervaren gebruiker die test en anderen helpt |
| Entry / exit criteria | voorwaarden om te starten / af te ronden |
| Defect / bevinding | afwijking van verwacht resultaat of behoefte |
| Known issue | aanvaard defect met workaround, eigenaar en datum |
| Go/no-go | beslismoment om live te gaan |
| Rollback | terugdraaien als het misgaat |
| Hypercare | periode met verhoogde ondersteuning na go-live |
| Shadow mode | systeem draait mee, maar handelt niet naar buiten |
| KB-artikel | knowledge base-artikel voor support |

## 4. Voorbeelden

**Een BAT-scenario in de taal van de key user** (BAT-08): *"De afvaart wordt drie keer bijgewerkt in 10 minuten."* Verwacht: *één bericht, tenzij het erger werd.* Resultaat run 1: **fail** — twee mails (DEF-04). Oorzaak: een analysekeuze, geen codeerfout.

**Een triagebeslissing:** DEF-05 (workbench ververst niet vanzelf) — *minor, known issue: refresh-knop + escalatie werkt nog; auto-refresh in R1.1 (week 7)*. Eigenaar: team.

**Waarom niet op vrijdag live:** planners werken in shifts; het weekend is dun bezet. Maandagochtend geeft vijf werkdagen hypercare vóór het eerste weekend.

## 5. In deze repository

| Open | Let op |
|---|---|
| [Teststrategie](../../../docs/09-acceptance/test-strategy.md) | "Two kinds of evidence — kept apart on purpose" |
| [Testgevallen](../../../docs/09-acceptance/test-cases.md) | elk TC → requirement → geautomatiseerde testnaam |
| [Testresultaten](../../../docs/09-acceptance/test-results.md) | gegenereerd door een script; datum en commit |
| [BAT-plan](../../../docs/09-acceptance/bat-plan.md) en [BAT-log](../../../docs/09-acceptance/bat-log.md) | key users, ernst, triage, sign-off met known issues |
| [Release readiness](../../../docs/10-go-live/release-readiness.md) | 13 criteria, elk met eigenaar en bewijs |
| [Support handover](../../../docs/10-go-live/support-handover.md) | "Rule or bug?" — hoe support het verschil ziet |

**Zelf doen:** `node --test tests/*.test.mjs` in de root, en in `demo/application`: `npm test`. Kijk hoe de testnamen overeenkomen met de testgevallen.

## 6. Stap voor stap (tutorial)

**Een BAT organiseren in 8 stappen.**

1. **Doel en scope** (wat wel/niet; performance zit bij het team).
2. **Key users kiezen** — bewust ook de sceptische (de senior planner).
3. **Scenario's** schrijven uit de acceptatiecriteria en de exception flows, in hún taal.
4. **Testdata** zonder klantgegevens (synthetische set die de mix nabootst).
5. **Planning**: tijd vrijgemaakt door hun manager; dag voor triage; dag voor hertests.
6. **Kick-off**: doel, hoe bevindingen melden, ernstdefinities.
7. **Triage** met PO en team: per bevinding fix, known issue of uitstel.
8. **Sign-off** door key users van élke betrokken groep; voorwaarden en known issues expliciet.

## 7. Begeleide oefening

**Schrijf 6 testgevallen voor ER-12 (throttling)** — niet de bestaande AC-07.x kopiëren, maar nieuwe:

- 2 grenswaarden rond de 2 uur;
- 1 geval "erger geworden";
- 1 geval "beter geworden";
- 1 negatief geval met twee oorzaken op één order (de DEF-04-situatie);
- 1 geval na een "back on schedule"-bericht.

Per geval: Given / When / Then en welk resultaat (`NOTIFY`, `SUPPRESSED`…). Controleer jezelf: probeer ze uit in de [rule explorer](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/rules/). Vergelijk met de [modeluitwerking](../../answer-keys/07-testing-delivery.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

**Triage drie nieuwe bevindingen** uit een (fictieve) BAT voor release 2, en geef per bevinding: ernst, beslissing (fix / known issue met workaround en datum / uitstel), eigenaar en wat in de go/no-go komt.

1. Een EDI-klant krijgt het statusbericht met de tijd in UTC.
2. De lijst "Unassigned" toont ook exceptions die al recovered zijn.
3. Het KB-artikel noemt nog "release 1" in de titel.

**Rubric (10 p.):** juiste ernst met reden (3) · realistische beslissing en workaround (3) · eigenaar en datum (2) · impact op go/no-go benoemd (2).

## 9. Quiz

[Quiz module 7](quiz.md) — 8 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/07-testing-delivery.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| BAT = de tester nog eens laten testen | de business test de behoefte, in eigen context |
| Alleen happy paths in BAT | ook "een slechte dag die je je herinnert" |
| Klantdata in de testomgeving | synthetische testset |
| Known issue zonder datum of eigenaar | workaround + eigenaar + datum, anders geen go |
| Go/no-go door de BA | de BA bereidt voor; de PO beslist |
| Testresultaten "voorlopig groen" noteren | alleen wat een tool rapporteerde; simulaties apart labelen |
| Support pas na go-live informeren | KB-artikel en training vóór go-live (release-DoD) |

## 11. Interviewvragen

1. Wat is het verschil tussen systeemtest en UAT, en wat is de rol van de BA in elk?
2. Hoe kies je key users voor UAT?
3. Een major bevinding op de dag vóór go-live — wat doe je?
4. Wat staat er op een go/no-go-checklist?
5. Hoe zorg je dat support een nieuwe feature kan uitleggen?
6. Wat zijn grenswaarden, en geef een voorbeeld uit je case.

## 12. Competentiechecklist

- [ ] Ik kan de testniveaus en wie wat test uitleggen.
- [ ] Ik kan grenswaarden, beslistabel- en state transition-gevallen schrijven.
- [ ] Ik kan het verschil systeemtest ↔ BAT uitleggen met DEF-04 als voorbeeld.
- [ ] Ik kan een BAT organiseren volgens de 8 stappen.
- [ ] Ik kan een defect triëren en een known issue correct vastleggen.
- [ ] Ik kan de go/no-go-checklist, rollback en hypercare uitleggen.
- [ ] Ik kan uitgevoerd en gesimuleerd bewijs uit elkaar houden in deze repo.
- [ ] Ik heb de oefening en de uitdaging gemaakt (≥ 7/10).

---

[← Module 6](../06-technical-fundamentals/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 8 — Logistiek domein →](../08-logistics-domain/README.md)

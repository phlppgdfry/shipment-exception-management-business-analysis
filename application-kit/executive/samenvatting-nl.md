# Samenvatting op één pagina — Uitzonderingen afhandelen vóór de klant belt

*Onafhankelijke portfolio-case · fictieve organisatie · Philippe Godfroy · alle cijfers zijn illustratieve aannames.*

**Het probleem.** Een shortsea- en door-to-door-operator gebruikt sinds kort een nieuw TMS. Klanten zien statussen, maar niet of hun leveringsvenster in gevaar is. Dus bellen ze: ±38% van de contacten met klantenservice gaat over "waar is mijn lading?", er worden ±55 leveringsslots per week gemist, en maar 22% van de late leveringen wordt vooraf gemeld.

**Wat ik deed, als business analist naast de Product Owner:**

| Stap | Resultaat |
|---|---|
| Kans kaderen | Drie gevraagde oplossingen teruggebracht tot één oorzaak (geen regels, geen eigenaar); vier opties gescoord; business case met terugverdientijd ±13,5 maanden áls de WISMO-contacten met 35% dalen — eerst getest in een pilot van 6 weken met een controlegroep |
| Discovery + event storming | Zeven interviews, een ochtend meelopen met de planners, een event storming van 3 uur; zes hotspots, elk beslist door de eigenaar (beslissingslog D-01 … D-08) |
| Proces en regels | BPMN 2.0 AS-IS/TO-BE; 13 uitzonderingsregels in één beslistabel; 30 voorbeelden die als test in CI draaien |
| Backlog met de PO | Story map; WSJF gescoord met de business; pilot van twee sprints (36 punten); afwegingen gedocumenteerd |
| Ontwerp | Planner-werkbank en klantbericht in Figma, gevalideerd met planners en twee pilotklanten; klikbaar prototype |
| Acceptatie en go-live | BAT met key users (4 majors gevonden en opgelost, goedgekeurd met 2 bekende kleine issues); go/no-go-checklist van 13 punten; klanten één voor één aangezet; rollback; hypercare; communicatieplan; KB-artikel |
| Meten | Stage gate tegenover een controlegroep; business case herberekend met de pilotcijfers |

**Pilotdoelen.** Proactief gemeld 22% → ≥ 90% · tijd tot de klant het weet 3 u → ≤ 30 min · WISMO −35% · valse alarmen < 5%.

**Links.** Site: phlppgdfry.github.io/shipment-exception-management-business-analysis · Rondleiding prototype: …/prototype/?tour · Repository: github.com/phlppgdfry/shipment-exception-management-business-analysis

# Antwoordsleutel — Module 7

## Quiz

### Q1 — B
"The tester checks that the software does what the stories say. BAT checks that what the stories say is what the business needs" ([BAT-plan](../../docs/09-acceptance/bat-plan.md#why-bat-and-not-only-the-teams-testing)).

### Q2 — B
Net onder, op en net boven de grens. In de case: AC-01.5 (119) en AC-01.6 (120).

### Q3 — C
De BA bereidt de checklist en het bewijs voor; elke lijn heeft een eigenaar; de PO beslist.

### Q4 — B
DEF-05 en DEF-06 gingen zo mee, met R1.1 in week 7.

### Q5 — B
Constraint C-06 in de [registers](../../docs/01-opportunity/registers.md#constraints); het team bouwde een set van 40 orders die de mix van de pilotklanten nabootst.

### Q6 — B
Gebruikt voor de controlegroep (AC-13.1) en twee dagen vóór de echte start.

### Q7 — B
Zie de [teststrategie](../../docs/09-acceptance/test-strategy.md#two-kinds-of-evidence--kept-apart-on-purpose).

### Q8 — B
Zie [release readiness, "Why not a Friday go-live"](../../docs/10-go-live/release-readiness.md#why-not-a-friday-go-live).

## Begeleide oefening

**Modeluitwerking** (controleer met de rule explorer; alle gevallen: SAILING_DELAY, geen key account, geen time-critical):

| # | Given | When | Then |
|---|---|---|---|
| 1 | laatst verwittigd MAJOR, 119 min geleden; nu 200 min laat | geëvalueerd | `SUPPRESSED` (binnen 2 u, niet erger) |
| 2 | laatst verwittigd MAJOR, 120 min geleden; nu 200 min laat | geëvalueerd | `NOTIFY` (precies 2 u = opnieuw) |
| 3 | laatst verwittigd MAJOR, 10 min geleden; nu 400 min laat | geëvalueerd | `NOTIFY` (erger: critical) |
| 4 | laatst verwittigd CRITICAL, 30 min geleden; nu 150 min laat | geëvalueerd | `SUPPRESSED` (beter, binnen 2 u) |
| 5 | order met een SAILING_DELAY-bericht (MAJOR) 10 min geleden; nu een ROAD_DELAY op dezelfde order, 200 min laat | geëvalueerd | `SUPPRESSED` — throttling **per order**, niet per oorzaak (DEF-04) |
| 6 | klant kreeg 30 min geleden "back on schedule"; nu opnieuw 200 min laat | geëvalueerd | `NOTIFY` — na een herstelbericht denkt de klant dat alles op tijd is (in de demo: laatste bericht = recovery → geen throttle) |

Geval 6 is interessant: de regelmodule zelf kent het verschil niet; de **engine** geeft "geen vorige melding" door na een herstelbericht. Dat is een analysebeslissing die je in een interview kunt uitleggen.

## Zelfstandige uitdaging — richtlijn

1. **UTC in EDI-bericht** — major (zelfde fout als DEF-01, nu in een ander kanaal; klant plant verkeerd). Fix vóór go-live; hertest met de EDI-klant. Eigenaar: team. Go/no-go: criterium "geen open major".
2. **Recovered in "Unassigned"** — minor (lijst te lang, maar geen fout naar de klant). Known issue: filter "Active" + sortering werkt; fix in R2.1 met datum. Eigenaar: team. In de go/no-go bij "known issues met workaround".
3. **KB-titel** — cosmetic. Supportlead past het aan vóór publicatie; geen impact op go/no-go behalve "KB gepubliceerd" (criterium 9).

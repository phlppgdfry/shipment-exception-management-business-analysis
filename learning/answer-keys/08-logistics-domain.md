# Antwoordsleutel — Module 8

## Quiz

### Q1 — B
LoLo (A) gebruikt kranen.

### Q2 — B
Daarom meet ER-01 "laat" tegen het einde van het venster.

### Q3 — B
Daarom zijn consigneeberichten pas voor release 3 (D-05): andere rechtsgrond, ander contract.

### Q4 — B
Later, maar binnen het venster (Calder Retail in de demo). A en C zijn na het venster; D is altijd een uitzondering (ER-05).

### Q5 — B
Het TOS (terminal operating system) registreert wat op de terminal gebeurt: gate-in, lossen, positie, gate-out.

### Q6 — B
D-04, ER-07.

### Q7 — C
ER-06, ER-08.

### Q8 — B
Eerlijk en nieuwsgierig. Deze repository noemt geen echt bedrijf; de bronnen staan in het [register](../../docs/02-discovery/sources.md).

## Begeleide oefening

**Modeluitwerking — onbegeleide trailer Gent → Leeds (fictief):**

| # | Milestone | Systeem | Mogelijke uitzondering | Eigenaar |
|---|---|---|---|---|
| 1 | Order ontvangen | TMS (portaal/EDI) | venster ontbreekt | TMS PO / klant (DQ) |
| 2 | Opgehaald bij verlader | haulier-app → TMS | haulier te laat | road planning |
| 3 | Gate-in terminal BE | TOS → TMS | te laat voor cut-off | road planning |
| 4 | Geladen / afvaart | afvaartsysteem → TMS | afvaart vertraagd of geannuleerd | road planning |
| 5 | Aankomst terminal VK | afvaartsysteem / TOS | aankomst later | road planning |
| 6 | Gelost, douane | TOS + douanemakelaar | customs hold | customs desk |
| 7 | Gate-out | TOS → TMS | congestie, trailer niet vrij | terminal operations |
| 8 | Opgepikt door UK-haulier | haulier-app (of telefoon) | geen status | road planning (bevestigen) |
| 9 | Geleverd in venster | haulier-app → TMS | file, gesloten DC | road planning |

## Zelfstandige uitdaging — richtlijn

Sterke vragen: "Wat was de laatste vertraging die echt misliep, en wat gebeurde er eerst?" · "Hoe weet je dat een afvaart vertraagd is — en hoe snel?" · "Welke orders bekijk je eerst als een afvaart schuift?" · "Wanneer bel je zelf een klant?" · "Welke hauliers sturen geen status, en wat doe je dan?" · "Wat doe je als het DC gesloten is?" · "Wat zou je nooit aan een klant willen laten sturen?" · "Wat zou je doen stoppen met een nieuw systeem in week één?" — telkens met het doel (pijn, regel, eigenaar, weerstand).

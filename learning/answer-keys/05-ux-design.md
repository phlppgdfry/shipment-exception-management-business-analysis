# Antwoordsleutel — Module 5

## Quiz

### Q1 — B
Persona's vatten onderzoek samen; in de case komen ze uit de [interviewnotities](../../docs/02-discovery/interview-notes.md).

### Q2 — B
UX-4. Een live ETA die afwijkt van het laatste bericht lokt juist telefoontjes uit.

### Q3 — B
Component + variants; auto layout zorgt dat het meegroeit.

### Q4 — C
Een lege status legt uit *waarom* het leeg is en leert de regel.

### Q5 — B
UX-8 en de PO-trade-off in de [prioritering](../../docs/06-backlog/prioritisation.md#trade-offs-the-po-made).

### Q6 — B
Kleur alleen sluit mensen uit en verdwijnt op een zwart-witafdruk.

### Q7 — B
Automatische checks vinden maar een deel van de problemen; een test met een schermlezergebruiker (TC-M6) is nog niet gedaan.

## Begeleide oefening

**Modeluitwerking (vergelijk met de demo):**

| Situatie | Titel | Uitleg | Actie | Niet tonen |
|---|---|---|---|---|
| Ordernummer bestaat niet | "We could not find D2D-99999" | "Check the reference on your order confirmation." | opnieuw invoeren | of het nummer van een andere klant is (privacy) |
| TMS antwoordt niet | "We could not load your order" | "Please try again in a moment." | Try again; contact customer service | technische foutcode, "TMS", "503" |
| Geen bericht verstuurd | "On schedule" + venster | "We only write when your delivery window is at risk — or when it is back on schedule." | geen | held/geminimaliseerde exceptions, severity, de live ETA |

## Zelfstandige uitdaging — richtlijn

Sterke journey: AS-IS — telefoon gaat, Sara weet niets, zoekt de order, belt de planner (bezet), belt terug met een vaag antwoord. TO-BE — Sara krijgt al een belopdracht met het verstuurde bericht erbij *vóór* de klant belt; ze belt proactief; ze legt de uitkomst vast (verplicht). Moments that matter: het moment dat ze de order opent (ziet ze wat de klant al gehoord heeft?) en het afsluiten van de belopdracht (verplichte uitkomst, korte tekst). Voorbeeld-UX-beslissing: "Toon het verstuurde bericht in de belopdracht — behoefte: hetzelfde verhaal vertellen (D-08); alternatief: link naar de order, kost een extra zoekactie (dat was DEF-06)."

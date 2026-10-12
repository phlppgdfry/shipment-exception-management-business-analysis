# Antwoordsleutel — Module 9

## Quiz

### Q1 — B
Kijk in de demo naar EX-1003: bericht om 09:15 (major), update 09:45 met dezelfde severity → `SUPPRESSED`. Dat is de regel, geen bug. Of 20 minuten extra een bericht waard is, is een **regelvraag** voor de PO (en een mooi voorbeeld voor de KB "rule or bug?").

### Q2 — B
Eerst de omvang van de wijziging begrijpen; de code volgt uit de geactualiseerde regels en voorbeelden.

### Q3 — B
Severity bestaat precies om aandacht te richten. Een ochtendrapport moet dus ook filteren (critical/major, escalated, held).

### Q4 — B
Een beslisser heeft genoeg aan vraag, opties, gevolgen en aanbeveling; de analyse zelf hoort in de bijlage of de documenten.

### Q5 — B
Ook: welke vensters zijn er in de data (DQ), en verandert de douanelast (ER-06, release 2)?

### Q6 — B
Analyse is een middel om een beslissing mogelijk te maken.

## Begeleide oefening

**Modeluitwerking — het ochtendrapport.**

1. **Behoefte:** "De COO wil om 07:00 weten welke beloftes aan klanten vandaag in gevaar zijn en of iemand ze aanpakt" — niet "alle problemen".
2. **Bestaande data:** open exceptions met severity, owner, assignee en due time; K6 (acknowledged within response time); escalaties; call tasks. De pilotexport (US-13) heeft alle tijdstempels.
3. **Risico van "alle":** ruis (minors, recovered), en een rapport dat niemand leest — of dat de COO laat micromanagen.
4. **Story:**
   > As the COO I want a 07:00 summary of today's critical and major exceptions, with owner and status, so that I know which customer promises are at risk and that each has an owner.
   - Given 07:00, then the e-mail lists critical and major active exceptions grouped by owner group, escalated first.
   - Given no critical or major exceptions, then the e-mail says so in one line (no empty table).
   - Given an exception without an assignee, then it is marked "unassigned".
5. **Beslissing PO:** is dit release 2-waardig (WSJF), en wie ontvangt het (alleen COO, of ook shift leads)?

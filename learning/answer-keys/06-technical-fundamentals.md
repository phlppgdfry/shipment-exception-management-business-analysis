# Antwoordsleutel — Module 6

## Quiz

### Q1 — C
409 = niet mogelijk in de huidige toestand ([problem-409.json](../../demo/mock-apis/examples/problem-409.json)). 422 zou ongeldige invoer zijn (bv. "other" zonder notitie).

### Q2 — B
NFR-03; in de demo zichtbaar als "Duplicate ignored ✓" in scenariostap 3, en getest in de contracttest.

### Q3 — B
Aanmelden (token, webhook-handtekening) bewijst wie je bent; de rollenmatrix bepaalt wat je mag. Een geldige aanmelding als CS-agent geeft nog geen recht om een exception af te sluiten.

### Q4 — B
`null` is een bewuste "nog niet"-waarde; het contract staat het toe (`type: ["string","null"]`).

### Q5 — B
Zie [integratie, "Why a queue table and not a broker"](../../docs/12-architecture/integration-and-api.md#event-driven-integration--the-flow). Herbekijken als het volume vertienvoudigt of er een tweede bron bijkomt.

### Q6 — B
De component leest het venster; in het voorgestelde ontwerp wordt een herplanning ook in het TMS gezet.

### Q7 — B
Een mooi voorbeeld van "bouwen als test van de specificatie".

### Q8 — B
Daarom zijn idempotentie en een volgordecheck op `occurredAt` onderdeel van het ontwerp.

## Begeleide oefening

**Problemen in het voorgestelde endpoint:**

1. `closedBy: "Maren"` — wie handelt, komt uit de **aanmelding** (token), niet uit de body (authenticatie).
2. Geen **rechtencontrole** beschreven: wie mag sluiten? (403)
3. `reason: "ok"` — geen **reason code** uit de lijst; "other" vraagt een notitie (AC-04.3).
4. "close" slaat **resolve** over: de lifecycle is ACKNOWLEDGED/RECOVERED → RESOLVED → CLOSED; vanuit OPEN moet het 409 geven.
5. De respons bevat **telefoonnummer van de klant en naam van de chauffeur** — niet nodig, in strijd met NFR-05 / C-02.
6. Geen **Idempotency-Key**: een retry kan dubbel sluiten of dubbel loggen.
7. Geen **foutcodes** gedocumenteerd (404, 409, 422).
8. Geen **audit**: wie, wanneer, met welke reden.

**Betere versie** (zoals in het [contract](../../demo/mock-apis/openapi.yaml)):

```text
POST /exceptions/{id}/resolve
Headers: Authorization: Bearer <token>, Idempotency-Key: <uuid>
Body: { "reasonCode": "NEW_WINDOW_AGREED", "note": "" }
200 → Exception (zonder persoonsgegevens) · 403 · 404 · 409 · 422
```

## Zelfstandige uitdaging — richtlijn

Kern: "Elk bericht van het TMS heeft een uniek nummer. Komt hetzelfde nummer nog eens binnen — wat gebeurt bij een netwerkhapering — dan herkent de component het en doet niets. Zonder dat zou een klant twee mails krijgen over dezelfde vertraging, en dat ondermijnt het vertrouwen dat we met één duidelijk bericht willen winnen (K8: ≤ 2 berichten per exception). Het is getest: een automatische test stuurt hetzelfde event twee keer en controleert dat er niets bijkomt."

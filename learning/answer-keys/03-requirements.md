# Antwoordsleutel — Module 3

## Quiz

### Q1 — C
Het gaat over *hoe goed/snel*, niet over *wat*: NFR-01. Merk op dat het meetbaar is en een verificatiemethode heeft.

### Q2 — B
120 is de grens voor major (AC-01.6); 119 is nog minor (AC-01.5).

### Q3 — B
"These are parameters, not code changes. When the PO changes one, the analyst updates the examples and the test run shows which examples change meaning" ([why these thresholds](../../docs/05-requirements/exception-rules.md#why-these-thresholds)).

### Q4 — C
"Het systeem" ervaart geen waarde. Technisch werk is een enabler (EN-1) met een "so that" voor een mens.

### Q5 — B
De criteria waren voldaan, de behoefte niet. Een realistisch voorbeeld (sailing delay + road re-plan op dezelfde order) had het eerder gevonden. De BA had de vraag in refinement zelf beantwoord — vandaar de retro-actie.

### Q6 — A
Eén bron per regel, stories verwijzen, tests bewijzen.

### Q7 — C
"Tijdig", "duidelijk" en "indien nodig" zijn alle drie niet testbaar. A, B en D zijn precies.

### Q8 — B
"Won't (this time)". FR-15 – FR-17 zijn bewust uitgesteld naar release 2.

## Begeleide oefening

**Modeluitwerking.**

> **As a** customer service agent **I want** a call task when a key account's delivery becomes critically late, with the message that was already sent, **so that** I can call the customer before they call us and tell the same story.

```gherkin
Given a critical exception for a key account in the pilot
When the exception opens
Then a call task appears for customer service with the order, new ETA and the message already sent   # ER-11

Given a major exception for a key account
When the exception opens
Then no call task is created                                                                       # boundary: AC-11.2

Given the customer was already called for this order less than 2 hours ago and it is still critical
When the order is re-evaluated
Then no second call task is created                                                                # AC-07.5

Given an open call task
When I close it without an outcome
Then it is refused with "a short outcome is required"                                             # error

Given I am a road planner
When I try to close a call task
Then it is refused: call tasks are completed by customer service                                  # rights (NFR-06)
```

## Zelfstandige uitdaging — richtlijn

Dubbelzinnigheden die je zou moeten vinden: *"sluit om 16:00"* — welke dag, welke tijdzone, wat bij feestdagen? *"vertraging na 14:00"* — nieuwe ETA na 14:00, of vertraging die om 14:00 bekend wordt? *"één niveau omhoog"* — ook als het al critical is (max. critical)? *"consignee"* — waar komen de openingsuren vandaan (geen data: DEP-07)? Voorbeelden: grenzen rond 14:00 (13:59 / 14:00) en rond 16:00, plus een donderdag als negatief geval. NFR-09 (veranderbaarheid) en de privacyvraag (consignee-data, D-05) worden geraakt.

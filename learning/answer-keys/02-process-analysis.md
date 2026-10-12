# Antwoordsleutel — Module 2

## Quiz

### Q1 — B
Message flows (stippellijn) verbinden pools; sequence flows blijven binnen één pool.

### Q2 — C
Precies één uitgang wordt genomen: exclusief. Een OR zou meer dan één uitgang tegelijk toelaten.

### Q3 — B
De gateway volgt een regel die elders gedefinieerd is. Zo blijft het diagram leesbaar en zijn de regels testbaar ([exception rules](../../docs/05-requirements/exception-rules.md)).

### Q4 — B
"The information exists … It gets lost between people" ([as-is.md](../../docs/04-process/as-is.md#why-model-it-at-all)). Daarom voegt de TO-BE eigenaarschap en regels toe, geen nieuw scherm.

### Q5 — C
Eén object, toestanden en overgangen: state diagram ([data model and states](../../docs/12-architecture/data-model-and-states.md#exception-state-machine)).

### Q6 — B
Het type verandering bepaalt het soort werk: backlog, beslissing, of training en communicatie.

### Q7 — B
Een timer boundary event drukt een termijn op een taak uit. De gateway in de huidige TO-BE werkt voor leesbaarheid maar is minder precies — een goed onderwerp om in een interview zelf aan te kaarten.

### Q8 — B
Het bestand is het artefact; de SVG in `site/assets/bpmn` wordt ervan gegenereerd.

## Begeleide oefening

**Modeluitwerking — AS-IS customs hold** (tekstvorm; een tekening mag anders zijn):

```text
Lanes: Customs broker | TMS | Customs desk | Road planner | Customer
(start) Declaration incomplete
 → [Broker] Place customs hold
 → [TMS] Status "customs hold" shown            ← P-C1: nobody is notified
 → [Customs desk] Notices hold (when checking the list, often hours later)
 → [Customs desk] E-mail customer what is missing   ← P-C2: free-text mail, no deadline
 → [Customer] Collects documents (slow)
 → <XOR> Documents complete before window?
      no → [Road planner] Delivery still planned → slot missed   ← P-C3: planner unaware
      yes → [Broker] Release → [TMS] Status released → (end) Delivered
```

Pijnpunten: **P-C1** geen melding bij de blokkade · **P-C2** de klant krijgt geen duidelijke actie en termijn · **P-C3** de planner weet het niet en plant door · (eventueel) **P-C4** geen reden vastgelegd bij een gemist slot.

## Zelfstandige uitdaging — richtlijn

Een sterk TO-BE bevat: service task "evaluate rules" → customs hold = major (critical bij time-critical), eigenaar customs desk (ER-06, ER-08); send task "action required"-bericht naar de klant met *wat* ontbreekt en *tegen wanneer* — nooit gethrottled; een melding aan de planner (geen levering inplannen zolang de hold actief is); een timer op de response time. Gap-typen: melding = systeem; "klant moet actie ondernemen" = beleid (en juridische review van de tekst, zie [user stories R2](../../docs/06-backlog/user-stories.md#release-2-and-later-headlines-not-refined)); planner informeren = proces/organisatie.

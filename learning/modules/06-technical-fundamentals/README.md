# Module 6 — Technische fundamenten voor de BA

> **Niveau:** gevorderd · **Tijd:** ±6 uur · **Voorkennis:** modules 2–3 · **Artefacten:** [architectuur](../../../docs/12-architecture/README.md), [integratie en API](../../../docs/12-architecture/integration-and-api.md), [datamodel en state machines](../../../docs/12-architecture/data-model-and-states.md), [security en privacy](../../../docs/12-architecture/security-privacy-observability.md), [OpenAPI-contract](../../../demo/mock-apis/openapi.yaml), [voorbeeldpayloads](../../../demo/mock-apis/examples/)

## 1. Leerdoelen

Na deze module kun je:

1. uitleggen wat een REST-API is: resource, endpoint, HTTP-methode, statuscode, header, body;
2. een JSON-payload lezen en controleren tegen een schema;
3. authenticatie en autorisatie uit elkaar houden, en een rollenmatrix lezen;
4. synchrone (REST) en event-gedreven integratie vergelijken, en uitleggen wat een webhook is;
5. idempotentie, retries en dubbele events uitleggen met een voorbeeld;
6. een logisch datamodel en een state machine lezen en controleren;
7. een technische trade-off in businesstaal uitleggen.

## 2. Uitleg in gewone taal

Je hoeft als BA geen code te schrijven. Je moet wel **precies genoeg kunnen praten** met developers en architecten om fouten in de specificatie te vinden vóór ze in de code zitten.

### REST in vijf delen

Een **API** is een afgesproken manier waarop systemen elkaar vragen stellen. **REST** gebruikt het web:

| Deel | Betekenis | Voorbeeld uit het contract |
|---|---|---|
| Resource | het "ding" | een exception, een shipment |
| Endpoint | adres van de resource | `GET /exceptions/{exceptionId}` |
| Methode | wat je wilt doen | `GET` lezen, `POST` iets doen/aanmaken, `PUT/PATCH` wijzigen, `DELETE` verwijderen |
| Statuscode | hoe het afliep | `200` ok, `202` aanvaard, `401` niet aangemeld, `403` geen recht, `404` niet gevonden, `409` niet in deze toestand, `422` ongeldige invoer, `503` onderliggend systeem onbereikbaar |
| Body | de inhoud, meestal **JSON** | zie [`exception-critical.json`](../../../demo/mock-apis/examples/exception-critical.json) |

Een **OpenAPI-bestand** beschrijft alle endpoints, inputs, outputs en fouten in één contract dat mensen én tools lezen. In deze repo controleert een test dat wat de demo teruggeeft overeenkomt met het contract.

### JSON lezen

```json
{
  "exceptionId": "EX-1012",
  "severity": "CRITICAL",
  "dueAt": "2026-02-04T10:22:00Z",
  "assigneeId": null,
  "rulesApplied": ["ER-01", "ER-02", "ER-04", "ER-08", "ER-09", "ER-10", "ER-11"]
}
```

Objecten `{}`, lijsten `[]`, tekst `""`, getallen, `true/false`, `null` (bewust leeg). Vragen die een BA stelt: *is `null` toegestaan en wat betekent het?* (hier: nog niemand toegewezen) · *in welke tijdzone is die tijd?* (de `Z` = UTC; tonen in UK-tijd — DEF-01) · *is dit veld verplicht?*

### Authenticatie vs. autorisatie

- **Authenticatie** = *wie ben je?* (aanmelden; voor systemen: een geheime sleutel of handtekening).
- **Autorisatie** = *wat mag je?* (rollen en rechten). De [rollenmatrix](../../../docs/12-architecture/security-privacy-observability.md#authorisation-model-nfr-06) zegt bv. dat alleen de shift lead mag toewijzen. Een BA schrijft die matrix mee — het zijn bedrijfsregels.

### Integratie: vragen of verwittigd worden

| Patroon | Hoe | Voordeel | Nadeel |
|---|---|---|---|
| **Polling** | elke X min vragen "is er iets veranderd?" | eenvoudig | traag en veel overbodige vragen |
| **Webhook / event** | het TMS stuurt een bericht zodra iets verandert | snel, efficiënt | events kunnen dubbel, laat of in verkeerde volgorde komen |
| **Batch** | 's nachts een bestand | eenvoudig voor grote volumes | te traag voor "verwittig vóór het venster" |

De case kiest webhooks + bij twijfel het order opvragen via REST ([integratie](../../../docs/12-architecture/integration-and-api.md#event-driven-integration--the-flow)).

### Idempotentie, retries en dubbels

- **Idempotent** = twee keer hetzelfde doen heeft hetzelfde effect als één keer. Het TMS kan een event opnieuw sturen (netwerkfout); dan mag er **geen tweede exception en geen tweede mail** komen (NFR-03). Oplossing: elk event heeft een uniek `eventId`; ken je het al, dan negeer je het. Probeer het in de demo: stap 3 van het scenario, "Send the same event again".
- **Retry** = opnieuw proberen na een fout, met wachttijd die oploopt (back-off). Na X pogingen: alarm naar support.
- **Volgorde** = een ouder event dat na een nieuwer binnenkomt, mag de nieuwere ETA niet overschrijven (`occurredAt` vergelijken).

### Data en databases

Een **logisch datamodel** toont entiteiten (Order, Exception, Message…) en relaties ("een order heeft max. één actieve exception"). Belangrijk voor de BA: **wie is eigenaar van welke data** (system of record). Hier blijft het TMS eigenaar van orders en vensters; de component bewaart alleen exceptions, beslissingen, berichten en audit ([datamodel](../../../docs/12-architecture/data-model-and-states.md#who-owns-which-data)).

### Architectuur zonder overdaad

Niet elk probleem vraagt een message broker of microservices. De case kiest bewust een kleine component met een tabel als wachtrij, omdat het volume bescheiden is (±1.600 orders/week) en support het moet kunnen beheren. **Een goede BA vraagt "wat lossen we hiermee op?" bij elke extra laag.**

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| API / REST / endpoint | afgesproken interface / web-stijl API / adres van een resource |
| HTTP-methode / statuscode | GET, POST… / 200, 404, 409… |
| JSON / schema | dataformaat / beschrijving van welke velden en types verplicht zijn |
| OpenAPI | standaardformaat voor een REST-contract |
| Webhook | het andere systeem roept jou aan als er iets gebeurt |
| Event-driven | systemen reageren op gebeurtenissen |
| Idempotentie | herhalen heeft geen extra effect |
| Retry / back-off | opnieuw proberen met oplopende wachttijd |
| Authenticatie / autorisatie | wie ben je / wat mag je |
| OIDC / OAuth 2.0 | standaarden voor aanmelden en toegangstokens |
| System of record | het systeem dat de waarheid over een gegeven bezit |
| Problem details (RFC 9457) | standaardformaat voor API-foutmeldingen |
| Observability | logs, metrics en alerts om te zien of iets werkt |

## 4. Voorbeelden

**Een foutmelding die de business begrijpt** ([`problem-409.json`](../../../demo/mock-apis/examples/problem-409.json)):

```json
{ "status": 409, "title": "Not possible in the current state",
  "detail": "Acknowledge the exception before resolving it (now OPEN)" }
```

**Een trade-off in businesstaal:** *"We kunnen wachten tot de TMS-leverancier een exceptionmodule bouwt, maar de datum is onzeker. Een kleine eigen component kost ±€195k en levert in 6 weken een pilot op. Omdat de regels in één module zitten, kunnen we later naar de module van de leverancier verhuizen zonder het werk van de business opnieuw te doen."* (D-03)

**Een privacyvraag in een payload:** de klant-API ([`tracking-delayed.json`](../../../demo/mock-apis/examples/tracking-delayed.json)) bevat geen severity, geen eigenaar, geen regel-ID's, geen chauffeur. Tijdens het bouwen van de demo bleek de eerste versie wél de interne severity mee te sturen — gevonden en opgelost met een "public message"-projectie en een test.

## 5. In deze repository

| Open | Opdracht |
|---|---|
| [`openapi.yaml`](../../../demo/mock-apis/openapi.yaml) | zoek `POST /exceptions/{exceptionId}/resolve`: welke statuscodes kan het geven en waarom? |
| [Swagger Editor](https://editor.swagger.io) | plak het contract erin en bekijk het als documentatie |
| [`exception-critical.json`](../../../demo/mock-apis/examples/exception-critical.json) | welke velden zijn `null` en wat betekent dat? |
| [Integratie en API](../../../docs/12-architecture/integration-and-api.md) | tabel "Retries and failure handling" |
| [Data model and states](../../../docs/12-architecture/data-model-and-states.md) | ERD en transitietabel |
| [`engine.ts`](../../../demo/application/src/domain/engine.ts) | zoek `TRANSITIONS` — vergelijk met het state diagram |

## 6. Stap voor stap (tutorial)

**Een API-contract reviewen als BA (8 vragen).**

1. **Wie roept het aan** en waarom? (TMS, planner, portaal.)
2. **Welke bedrijfsregel** zit achter elk endpoint? (resolve → AC-04.3.)
3. **Welke velden zijn verplicht**, en wat betekent `null`?
4. **Tijd:** welke tijdzone, welk formaat?
5. **Fouten:** welke statuscodes, en is de `detail` begrijpelijk voor een gebruiker?
6. **Rechten:** wie mag dit (403)?
7. **Herhaling:** wat als het twee keer gebeurt (idempotentie)?
8. **Privacy:** welke persoonsgegevens gaan over de lijn, en zijn ze nodig?

## 7. Begeleide oefening

**Review dit voorgestelde endpoint** dat een developer voorstelt voor release 2:

```text
POST /exceptions/{id}/close
Body: { "closedBy": "Maren", "reason": "ok" }
Response 200: { "status": "CLOSED", "customerPhone": "+44 7700 900123", "driver": "J. Smith" }
```

Vind minstens **6 problemen** met de 8 vragen van de tutorial en stel een betere versie voor. Vergelijk met de [modeluitwerking](../../answer-keys/06-technical-fundamentals.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

**Leg aan een niet-technische Head of Customer Service uit** (max. 250 woorden) waarom het belangrijk is dat "hetzelfde bericht van het TMS twee keer binnenkomen" geen tweede mail naar de klant mag geven, wat het team daarvoor doet, en hoe het getest wordt. Geen jargon zonder uitleg.

**Rubric (10 p.):** juist (idempotentie, eventId) (3) · begrijpelijk zonder jargon (3) · businessgevolg genoemd (vertrouwen, K8) (2) · testbewijs genoemd (2).

## 9. Quiz

[Quiz module 6](quiz.md) — 8 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/06-technical-fundamentals.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| "Dat is technisch, daar moet ik niet over gaan" | rechten, foutmeldingen, tijdzones en dubbels zijn bedrijfsregels |
| Alleen het happy path van een API bespreken | vraag naar 403/409/422 en naar herhaling |
| Persoonsgegevens "voor het gemak" meesturen | dataminimalisatie: alleen wat nodig is |
| Technische oplossingen voorschrijven ("gebruik Kafka") | de behoefte beschrijven (volgorde, betrouwbaarheid, volume); het team kiest |
| Tijd zonder tijdzone | altijd UTC opslaan, lokaal tonen, zone vermelden |
| Datamodel kopiëren uit het TMS | eigenaar van data respecteren; alleen opslaan wat jou toebehoort |

## 11. Interviewvragen

1. Leg aan een developer uit wat je van een API verwacht voor het afsluiten van een exception.
2. Wat is het verschil tussen authenticatie en autorisatie?
3. Wat is idempotentie, en waarom is het hier belangrijk?
4. Webhook of polling — wanneer kies je wat?
5. Hoe lees je een datamodel, en wat vraag je eerst?
6. Leg een technische trade-off uit aan de sponsor.

## 12. Competentiechecklist

- [ ] Ik kan GET/POST en de statuscodes 200, 202, 401, 403, 404, 409, 422, 503 uitleggen met een voorbeeld uit het contract.
- [ ] Ik kan een JSON-payload lezen en `null`-velden verklaren.
- [ ] Ik kan authenticatie en autorisatie uit elkaar houden en de rollenmatrix uitleggen.
- [ ] Ik kan idempotentie uitleggen en tonen in de demo.
- [ ] Ik kan het ERD en de transitietabel lezen.
- [ ] Ik kan D-03 als trade-off in businesstaal uitleggen.
- [ ] Ik heb de API-review-oefening en de uitdaging gemaakt (≥ 7/10).

---

[← Module 5](../05-ux-design/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 7 — Testen en oplevering →](../07-testing-delivery/README.md)

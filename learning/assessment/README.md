# Competentietaken

> Tien praktijktaken die samen tonen of je de methodes van deze case **zelf** kunt toepassen. Elke taak heeft een opdracht, een time-box, wat je inlevert en een rubric. **Referentieoplossingen staan apart** in [`reference-solutions/`](reference-solutions/README.md) — open die pas nadat je eigen werk in `learning/my-work/task-NN.md` staat.
>
> **Competent** = minstens 7 van de 10 taken met ≥ 7/10, waarvan T1, T4, T5 en T9 verplicht, **beoordeeld door iemand anders of na minstens een dag afstand**. Niemand wordt competent doordat deze bestanden bestaan.

*Alle taken spelen in de fictieve organisatie Tidewell. Gebruik de case als bron; verzin geen echte bedrijfsinformatie.*

---

## T1 — Een nieuwe requirement analyseren (90 min)

**Situatie.** De Head of Customer Service mailt: *"Kunnen we klanten ook een sms sturen bij elke vertraging? Ze lezen hun mail niet altijd."*

**Lever in:** (1) de behoefte achter de vraag; (2) welke bestaande aannames, beslissingen en regels dit raakt (met ID's); (3) drie opties met kosten/gevolgen; (4) welke data je eerst wil zien; (5) een aanbeveling van max. 5 zinnen voor de PO.

| Criterium | Punten |
|---|---:|
| Behoefte juist geformuleerd, zonder oplossingswoorden | 2 |
| Raakt de juiste ID's (o.a. A-03, A-06, ER-10, ER-12, NFR-05) | 2 |
| Drie realistische opties met gevolgen | 2 |
| Data die de keuze onderbouwt | 2 |
| Aanbeveling laat de beslissing bij de PO | 2 |

## T2 — Een discoverygesprek faciliteren (60 min voorbereiding + 20 min gesprek)

**Situatie.** Je spreekt de **terminal operations coordinator** (eigenaar van TERMINAL_DELAY, ER-08) die niet in de event storming zat. Laat iemand die rol spelen.

**Lever in:** gespreksplan (doel, 8–10 vragen, volgorde), notities, drie inzichten, één tegenstrijdigheid met de bestaande case, en de vervolgacties met eigenaar.

| Criterium | Punten |
|---|---:|
| Vragen open, concreet ("laatste keer dat…"), niet sturend | 3 |
| Goede volgorde: context → verhaal → pijn → behoefte → afsluiten | 2 |
| Inzichten onderscheiden feit, mening en aanname | 2 |
| Tegenstrijdigheid benoemd zonder ze zelf te beslissen | 2 |
| Vervolgacties met eigenaar | 1 |

## T3 — Een BPMN-proces maken (2 uur)

**Opdracht.** Modelleer het TO-BE voor **"missing status"** (ER-07, US-08) in BPMN 2.0 in een tool (bpmn.io of Camunda Modeler), met lanes *Exception component, Road planner, Haulier, Customer*. Gebruik minstens één exclusieve gateway en één timer boundary event. Exporteer `.bpmn` en `.svg`.

| Criterium | Punten |
|---|---:|
| Geldige BPMN 2.0 (opent in een andere tool) | 2 |
| Juiste elementen (events, taken, gateways met vraag/labels, timer) | 3 |
| Klopt met ER-07 en US-08 (hold, twee bevestigingspaden) | 3 |
| Leesbaar: één scenario, geen kruisende lijnen, duidelijke namen | 2 |

## T4 — User stories schrijven (60 min)

**Opdracht.** Schrijf drie stories voor **release 2: meldingsvoorkeuren in het portaal (US-12)**, gesplitst op waarde, met INVEST-check per story.

| Criterium | Punten |
|---|---:|
| Juiste rollen en "so that" met effect | 3 |
| Splitsing op waarde, niet op technische laag | 2 |
| Elk verwijst naar regels/requirements waar relevant (ER-10, ER-12, FR-17) | 2 |
| INVEST-check eerlijk ingevuld | 3 |

## T5 — Acceptatiecriteria schrijven (60 min)

**Opdracht.** Schrijf voor één story uit T4 minstens **6 Gherkin-criteria**: normaal geval, 2 grenzen, 2 fouten, 1 rechtencheck. Voeg een Examples-tabel toe als er een regel in zit.

| Criterium | Punten |
|---|---:|
| Correct Given/When/Then, één gedrag per scenario | 2 |
| Grenzen echt op de rand | 2 |
| Foutgevallen realistisch | 2 |
| Testbaar zonder interpretatie | 3 |
| Geen UI-details die het ontwerp vastleggen | 1 |

## T6 — Dubbelzinnigheid in requirements vinden (45 min)

**Opdracht.** Zoek in deze tekst minstens **8 dubbelzinnigheden** en herschrijf hem testbaar:

> *"Het systeem moet klanten tijdig verwittigen bij belangrijke vertragingen, behalve als het om kleine dingen gaat. Key accounts krijgen altijd voorrang. Berichten moeten duidelijk zijn en mogen niet te vaak gestuurd worden. Als de status ontbreekt, moet de planner snel reageren. Het moet ook werken voor EDI-klanten, indien mogelijk."*

| Criterium | Punten |
|---|---:|
| ≥ 8 echte dubbelzinnigheden | 4 |
| Herschrijving testbaar, met ID's naar bestaande regels waar ze al bestaan | 4 |
| Open vragen met eigenaar voor wat niet uit de case volgt | 2 |

## T7 — Een backlog prioriteren (60 min)

**Opdracht.** Zeven items voor release 2 (zie [reference-solutions — T7 input](reference-solutions/README.md#t7--input-ook-zonder-oplossing-te-gebruiken)). Maak een WSJF-voorstel met één zin uitleg per score, de afhankelijkheden, en een release slice van ±36 punten. Benoem wie welke kolom zou moeten scoren.

| Criterium | Punten |
|---|---:|
| Scores consistent en uitgelegd | 3 |
| Afhankelijkheden juist verwerkt in de volgorde | 3 |
| Slice levert end-to-end waarde | 2 |
| Rollen van scorers juist (business, team, PO beslist) | 2 |

## T8 — Een API-contract beoordelen (60 min)

**Opdracht.** Beoordeel `POST /messages/{messageId}/send` en `GET /orders/{orderRef}/tracking` in het [contract](../../demo/mock-apis/openapi.yaml) met de 8 vragen uit module 6. Lever 5 verbeterpunten of vragen, elk met reden.

| Criterium | Punten |
|---|---:|
| Begrijpt wat elk endpoint doet en voor wie | 2 |
| Vindt echte punten (rechten, privacy, idempotentie, fouten, tijd) | 4 |
| Formuleert ze als vragen/voorstellen voor het team, niet als bevelen | 2 |
| Verwijst naar de juiste requirements | 2 |

## T9 — UAT-scenario's ontwerpen (60 min)

**Opdracht.** Ontwerp **6 BAT-scenario's** voor release 2 "EDI/API-statusberichten (US-06)", in de taal van de key users, met key user, verwacht resultaat, en entry/exit-criteria voor de BAT.

| Criterium | Punten |
|---|---:|
| Scenario's in businesstaal, uit echte situaties | 3 |
| Juiste key users (incl. een EDI-klant en support) | 2 |
| Dekt grens- en foutgevallen (tijdzone, dubbel bericht, onbekende order) | 3 |
| Entry/exit concreet | 2 |

## T10 — Een technische trade-off uitleggen (30 min + 5 min presentatie)

**Opdracht.** Leg aan de sponsor uit (max. 1 pagina, 5 min mondeling): **"Bouwen we release 2 verder op onze eigen component, of wachten we op de exceptionmodule die de TMS-leverancier nu wél voor volgend kwartaal belooft?"**

| Criterium | Punten |
|---|---:|
| Beide opties eerlijk met voor- en nadelen | 3 |
| Businesstaal, jargon uitgelegd | 2 |
| Verwijst naar D-03 en de portabiliteit van de regels | 2 |
| Aanbeveling met voorwaarde; beslissing bij sponsor/PO | 2 |
| Benoemt wat je eerst zou valideren | 1 |

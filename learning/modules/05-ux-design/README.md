# Module 5 — UX en productontwerp (Figma, journeys, wireframes, handoff)

> **Niveau:** start → gevorderd · **Tijd:** ±4 uur · **Voorkennis:** modules 1 en 3 · **Artefacten:** [personas en journeys](../../../docs/07-design/personas-and-journeys.md), [UX-specificatie](../../../docs/07-design/ux-specification.md), [design](../../../docs/07-design/design.md), [Figma-bestand](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI), [control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/)

## 1. Leerdoelen

Na deze module kun je:

1. een persona en een journey map maken die op discovery steunen, niet op fantasie;
2. een informatiearchitectuur en een user flow tekenen;
3. van een low-fidelity wireframe naar een high-fidelity mock-up gaan in Figma (frames, componenten, auto layout, variabelen);
4. een klikbaar prototype maken en er een korte gebruikerstest mee doen;
5. lege, laad- en foutstatussen ontwerpen;
6. een design handoff voorbereiden die een developer kan bouwen;
7. elke ontwerpkeuze koppelen aan een gebruikersbehoefte of businessdoel.

## 2. Uitleg in gewone taal

Als BA ontwerp je niet om het mooi te maken, maar om **een analyse zichtbaar en testbaar te maken** vóór er gebouwd wordt. Een scherm toont meteen of een regel begrijpelijk is ("waarom staat dit bovenaan?") en of een bericht duidelijk is ("wat moet ik nu doen?").

### Van mens naar scherm

1. **Persona** — een samengestelde gebruiker op basis van interviews: doel, frustraties, angsten, wat het ontwerp moet doen. In de case: Maren (planner), Priya (shift lead), Sara (klantendienst), Daniel (klant).
2. **Journey map** — de stappen die iemand doorloopt, met gevoel en pijn per stap; AS-IS en TO-BE naast elkaar. De **moments that matter** zijn waar het ontwerp moet kloppen.
3. **Informatiearchitectuur (IA)** — welke schermen er zijn en hoe ze samenhangen.
4. **User flow** — de klikken voor één taak ("handel de meest dringende exception af").
5. **Wireframe (low-fi)** — grijze blokken: wat staat waar, zonder kleur of stijl.
6. **Mock-up (high-fi)** — echte inhoud, kleuren, typografie, componenten.
7. **Prototype** — klikbaar; toont *gedrag*. Figma-prototypes tonen navigatie; voor gedrag zoals throttling of escalatie bouwde deze case een prototype op dezelfde regels als de tests.

### Figma — wat een BA moet kunnen

| Concept | Waarvoor | Tip |
|---|---|---|
| **Frame** | een scherm of een deel ervan | begin met een desktop- en een mobiel frame |
| **Auto layout** | elementen die meegroeien (lijsten, knoppen) | maakt een lijst van exceptions herbruikbaar |
| **Component + variants** | herbruikbaar element met varianten | "Exception row" met variant per severity |
| **Variables / styles** | kleuren en tekstformaten als tokens | zelfde namen als in code (`--critical`) |
| **Prototype-links** | klikbaar maken | één flow, niet het hele product |
| **Comments** | feedback op de plek zelf | key users laten reageren op het scherm |
| **Dev Mode** | maten, tokens en assets voor developers | de handoff |
| **FigJam** | whiteboard (event storming, flows) | in de case: het event-storming-bord |

### Statussen die vaak vergeten worden

Elk scherm heeft minstens: **laden**, **leeg** (met uitleg *waarom* leeg), **fout** (met wat de gebruiker kan doen), **geen rechten** (uitleggen wie het wel kan). In de control tower kun je de fout zelf oproepen met "Simulate TMS outage".

### Toegankelijkheid (a11y) — de basis

Kleur is nooit het enige signaal (severity = vorm + tekst + kleur), voldoende contrast, alles met het toetsenbord bereikbaar, labels bij invoervelden, foutmeldingen die voorgelezen worden. De demo wordt automatisch gecontroleerd met axe (WCAG 2.2 AA) — maar een automatische test is een ondergrens, geen certificaat.

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| UX / UI | user experience (hoe het werkt en voelt) / user interface (wat je ziet) |
| Persona | samengestelde gebruiker op basis van onderzoek |
| Journey map | stappen, gevoel en pijn van een gebruiker over tijd |
| Moment that matters | stap waar het ontwerp het verschil maakt |
| IA | informatiearchitectuur: structuur van schermen en inhoud |
| Wireframe / mock-up / prototype | schets / uitgewerkt ontwerp / klikbaar ontwerp |
| Design system / tokens | herbruikbare componenten en vaste waarden (kleur, ruimte) |
| Handoff | overdracht van ontwerp naar development |
| Usability test | gebruikers taken laten doen en observeren |
| WCAG | Web Content Accessibility Guidelines |

## 4. Voorbeelden

**Een ontwerpkeuze verantwoorden** (uit de [UX-specificatie](../../../docs/07-design/ux-specification.md#ux-decisions-and-the-need-behind-each)):

> UX-4: de klantkaart wordt alleen opgebouwd uit **verstuurde** berichten. *Behoefte:* Daniel ziet één consistent verhaal; niets interns lekt (NFR-05). *Alternatief:* de live ETA tonen — dat spreekt het laatste bericht tegen en lokt telefoontjes uit.

**Een lege status die iets leert:** "Nothing to act on. No exceptions match these filters. Delays inside the agreed window are not exceptions (ER-01)." — de lege status legt de regel uit.

**Waarom geen kaart:** de Head of CS vroeg een live kaart. Discovery toonde dat klanten de *gevolgen voor hun venster* willen weten, niet de positie. Een kaart is aantrekkelijk en beantwoordt de verkeerde vraag (UX-8).

## 5. In deze repository

| Bekijk | Let op |
|---|---|
| [Personas en journeys](../../../docs/07-design/personas-and-journeys.md) | moments that matter; de false alarm die níét gebeurt |
| [UX-specificatie](../../../docs/07-design/ux-specification.md) | IA, flows F1–F5, wireframes, tokens, statussen, UX-1 – UX-8 |
| [Design + Figma-exports](../../../docs/07-design/design.md) | het "exception row"-component en de geannoteerde ontwerpkeuzes |
| [Control tower](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/control-tower/exceptions/) | probeer flow F1 en de rol "terminal coordinator" (read-only) |
| [`globals.css`](../../../demo/application/src/app/globals.css) | dezelfde tokens als in de UX-specificatie |

## 6. Stap voor stap (tutorial)

**Het "exception card"-component in Figma bouwen (±45 min).**

1. Maak een frame van 420 × 120 px; zet **auto layout** aan (verticaal, padding 12, gap 6).
2. Rij 1: drie tekstlagen in een horizontale auto layout: severity-badge, status-badge, ID rechts (*fill container* op een spacer).
3. Rij 2: "D2D-48213 · Sailing delay" (semibold). Rij 3: klant · eigenaar · toegewezen persoon (muted). Rij 4: "Respond by Wed 10:22 · 18 min left".
4. Maak kleurvariabelen `critical`, `major`, `minor`, `ok`, `accent`, `surface`, `text`, `muted` met modes *light* en *dark* (waarden: [UX-specificatie, design system](../../../docs/07-design/ux-specification.md#design-system)).
5. Maak er een **component** van; voeg een **variant**-eigenschap `severity` (critical/major/minor) en `state` (default/selected) toe.
6. Zet vijf instanties in een lijst (auto layout verticaal); sorteer ze zoals AC-03.1 voorschrijft.
7. Maak het geselecteerde detailpaneel als tweede frame; verbind met een prototype-link *On click → Navigate*.
8. Schrijf bij het component een **beschrijving**: welke story, welke regel bepaalt de volgorde, welke statussen bestaan.
9. Open **Dev Mode** en controleer of maten en tokennamen leesbaar zijn voor een developer.

Geen Figma-account? FigJam of zelfs papier volstaat voor stap 1–7; het gaat om de structuur.

## 7. Begeleide oefening

**Ontwerp de lege, laad- en foutstatus** van het scherm "Customer view" (portaalkaart) voor deze situaties:

1. de klant geeft een ordernummer in dat niet bestaat;
2. het TMS antwoordt niet;
3. de order bestaat maar er is geen enkel bericht verstuurd.

Per situatie: titel, één zin uitleg, wat de klant kan doen, en wat je **niet** toont (interne info). Vergelijk met de [modeluitwerking](../../answer-keys/05-ux-design.md#begeleide-oefening) en met wat de demo doet (`/track/?ref=D2D-99999`).

## 8. Zelfstandige uitdaging

Maak een **journey map** voor **Sara (klantendienst)** wanneer een key account belt over een kritieke vertraging — AS-IS en TO-BE, 5–6 stappen, met gevoel per stap en twee moments that matter. Leid er **twee UX-beslissingen** uit af (formaat UX-n: beslissing, behoefte, alternatief).

**Rubric (10 p.):** stappen realistisch en gebaseerd op de case (3) · gevoel en pijn per stap (2) · moments that matter goed gekozen (2) · UX-beslissingen gekoppeld aan behoefte en met alternatief (3).

## 9. Quiz

[Quiz module 5](quiz.md) — 7 vragen. Antwoorden: [antwoordsleutel](../../answer-keys/05-ux-design.md).

## 10. Veelgemaakte fouten

| Fout | Beter |
|---|---|
| Persona's verzinnen zonder onderzoek | persona's als samenvatting van interviews en shadowing |
| Meteen high-fidelity ontwerpen | eerst wireframe en flow; kleur leidt de discussie af |
| Alleen het happy path ontwerpen | lege, laad-, fout- en geen-rechten-statussen |
| Kleur als enige signaal | vorm + tekst + kleur |
| Een prototype van het hele product | één flow die een vraag beantwoordt |
| Ontwerpkeuzes zonder reden | elke keuze → behoefte of doel, plus het afgewezen alternatief |
| Claimen dat een Figma-bestand bestaat dat er niet is | in de case staat expliciet dat de control tower níét in Figma zit |

## 11. Interviewvragen

1. Hoe gebruik je Figma als business analyst — en waar stopt jouw rol en begint die van een UX-designer?
2. Hoe test je een ontwerp met gebruikers als je weinig tijd hebt?
3. Welke statussen ontwerp je naast het normale scherm?
4. Hoe zorg je dat een developer jouw ontwerp juist bouwt?
5. Vertel over een ontwerpkeuze die je bewust níét maakte (de kaart).

## 12. Competentiechecklist

- [ ] Ik kan een persona en journey map maken op basis van interviewnotities.
- [ ] Ik kan de IA en flow F1 van de control tower tekenen uit het hoofd.
- [ ] Ik kan in Figma een component met variants en auto layout maken.
- [ ] Ik kan lege, laad-, fout- en geen-rechten-statussen ontwerpen.
- [ ] Ik kan drie UX-beslissingen uit de case uitleggen met behoefte en alternatief.
- [ ] Ik heb de tutorial in Figma (of FigJam/papier) gedaan.
- [ ] Ik heb de oefening en de uitdaging gemaakt (≥ 7/10).

---

[← Module 4](../04-agile-scrum/README.md) · [Learning Lab](../../README.md) · Volgende: [Module 6 — Technische fundamenten →](../06-technical-fundamentals/README.md)

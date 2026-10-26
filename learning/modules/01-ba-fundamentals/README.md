# Module 1 — IT Business Analysis: de basis

> **Niveau:** start · **Tijd:** ±3 uur · **Voorkennis:** geen · **Artefacten die je hier leert lezen:** [probleemstelling](../../../docs/01-opportunity/problem-statement.md), [opties en business case](../../../docs/01-opportunity/options-and-business-case.md), [stakeholders](../../../docs/02-discovery/stakeholders.md), [interviewnotities](../../../docs/02-discovery/interview-notes.md), [rollen](../../../docs/08-delivery/roles-and-responsibilities.md)

## 1. Leerdoelen

Na deze module kun je:

1. in twee zinnen uitleggen wat een IT business analyst (BA) doet en wat niet;
2. het verschil uitleggen tussen BA, Product Owner (PO) en functioneel analist (FA), met een voorbeeld uit deze case;
3. een *gevraagde oplossing* terugbrengen tot een *probleem* en een *behoefte*;
4. "business value" concreet maken met een meetbare indicator;
5. een stakeholderanalyse lezen en zelf opstellen (invloed × belang, RACI);
6. drie discoverytechnieken kiezen voor een situatie en zeggen waarom.

## 2. Uitleg in gewone taal

**Een IT business analyst zorgt dat het team het juiste probleem oplost, op een manier die de business kan gebruiken en die IT kan bouwen en testen.** Hij of zij staat tussen "de business" (mensen met een probleem: planners, klantendienst, klanten) en "IT" (mensen die software maken en beheren).

Concreet in deze case:

- Drie mensen vroegen drie oplossingen: een trackingpagina, mails naar key accounts, en "niets dat extra werk geeft". De BA maakte daar **één probleem** van: *klanten horen te laat over vertragingen, omdat niemand regels heeft voor wat "laat" is en wie het zegt* ([probleemstelling](../../../docs/01-opportunity/problem-statement.md)).
- De BA legde **vier opties** naast elkaar met kosten en baten, en liet de PO en sponsor kiezen ([business case](../../../docs/01-opportunity/options-and-business-case.md)).
- De BA schreef de **regels** zo precies dat ze als test kunnen draaien ([exception rules](../../../docs/05-requirements/exception-rules.md)).

**Wat de BA níét doet:** prioriteit bepalen (dat is de PO), de software bouwen (developers), het proces runnen (de business). De BA is *verantwoordelijk voor de kwaliteit van de analyse*, niet *eigenaar van de beslissingen*. Zie de RACI in [stakeholders](../../../docs/02-discovery/stakeholders.md#raci-for-the-release): de BA heeft veel R's en bijna geen A's.

### BA, PO en FA naast elkaar

| | Business analyst | Product Owner | Functioneel analist |
|---|---|---|---|
| Kernvraag | *Waarom* en *wat* moet er veranderen? | *Wat eerst*, en is het waardevol genoeg? | *Precies hoe* moet het systeem zich gedragen? |
| Beslist | niets formeel; bereidt beslissingen voor | backlogvolgorde, scope, acceptatie | niets formeel; detailleert binnen de scope |
| Typische output | probleemstelling, opties, business case, processen, stories, acceptatiecriteria | geordende backlog, releasebeslissingen | functionele specificaties, beslistabellen, datamodel, interfaces |
| In deze case | jouw rol | de PO "Customer Visibility" | de [companion case](https://github.com/phlppgdfry/shortsea-booking-functional-analysis) |

In veel bedrijven overlappen BA en FA. Een veilige uitleg in een interview: *"De BA vertrekt van het bedrijfsprobleem en de waarde; de FA vertrekt van het systeem en de details. In kleine teams doet één persoon beide."*

### Business need en business value

- Een **business need** is wat de organisatie nodig heeft om een doel te halen — los van de oplossing. "Klanten horen een ernstige vertraging vóór hun leveringsvenster begint" is een behoefte. "Een trackingpagina" is een oplossing.
- **Business value** maak je meetbaar: minder WISMO-contacten (K3), minder gemiste leverslots (K4). Elke waarde die je claimt heeft een **baseline**, een **doel** en een **eigenaar** ([KPI tree](../../../docs/01-opportunity/kpi-tree.md)). Zonder baseline kun je later niet bewijzen dat iets werkte.

### Stakeholdermanagement

Een **stakeholder** is iedereen die geraakt wordt of invloed heeft. Je brengt ze in kaart op **invloed** en **belang** (power/interest grid): wie "manage closely" is (sponsor, PO, planninglead), wie je alleen informeert. Daarnaast noteer je per groep: pijn vandaag, wat ze willen, mogelijke weerstand, hoe je ze betrekt. De planninglead had **hoge weerstand** ("I already call the important customers myself") — daarom werd de senior planner key user in BAT.

### Discoverytechnieken

| Techniek | Goed voor | In deze case |
|---|---|---|
| Interview (semi-gestructureerd) | behoeften, pijn, verhalen | 8 interviews |
| Observatie / shadowing | het echte werk, workarounds | ochtendshift van een planner |
| Workshop (event storming) | gedeeld beeld over teams heen, tegenstrijdigheden zichtbaar | 3 uur, 8 deelnemers |
| Data-analyse | baseline, omvang van het probleem | 60 orders, contactredenen 2 weken |
| Documentanalyse | huidige regels, contracten | klantcontracten (consignee, GDPR) |
| Prototype | gedrag testen voor er gebouwd wordt | prototype + control tower |

## 3. Begrippen

| Begrip | Betekenis |
|---|---|
| Business analyst (BA) | brugfunctie tussen business en IT; analyseert behoeften en vertaalt ze naar oplossingen |
| Stakeholder | persoon of groep die geraakt wordt of invloed heeft |
| Business need | wat de organisatie nodig heeft, los van de oplossing |
| Business value | het meetbare voordeel (tijd, geld, risico, klanttevredenheid) |
| Baseline | de gemeten beginwaarde van een indicator |
| KPI | key performance indicator: meetbare indicator met doel en eigenaar |
| RACI | Responsible, Accountable, Consulted, Informed |
| Discovery | de fase waarin je het probleem en de context leert kennen |
| Root cause | de onderliggende oorzaak (bv. via "5 whys") |
| Scope | wat wel en niet in een release zit |
| Business case | onderbouwing: opties, kosten, baten, risico's, aanbeveling |
| WISMO | "where is my order"-contact |

## 4. Voorbeelden

**Van oplossing naar probleem (uit de case):**

> Vraag: "Maak een trackingpagina zoals bij de pakjesdiensten."
> BA: "Wat zou je doen als je die pagina had?" → "Dan bellen klanten minder." → "Waarom bellen ze nu?" → "Omdat ze niet weten dat hun levering te laat komt." → "Weten wij het wel?" → "Soms, maar niemand zegt het."
> **Probleem:** niet de ontbrekende pagina, maar dat niemand verantwoordelijk is om de klant te verwittigen en niemand weet welke wijziging ertoe doet.

**Value meetbaar maken:**

> Vaag: "Betere klantcommunicatie."
> Meetbaar: "Het aandeel ernstige vertragingen dat de klant van ons hoort vóór het venster begint, gaat van 22% naar ≥ 90% (K1), gemeten wekelijks door de Head of Customer Service."

## 5. In deze repository

| Lees | Let op |
|---|---|
| [Probleemstelling](../../../docs/01-opportunity/problem-statement.md) | "Where the request came from", de 5 whys en "What would change our mind" |
| [Opties en business case](../../../docs/01-opportunity/options-and-business-case.md) | waarom optie O2 (standaard mails) afviel, en de gevoeligheidsanalyse |
| [Stakeholders](../../../docs/02-discovery/stakeholders.md) | kolom "possible resistance" en de RACI-noot onderaan |
| [Interviewnotities](../../../docs/02-discovery/interview-notes.md) | "Contradictions taken to the event storming" |
| [Rollen en verantwoordelijkheden](../../../docs/08-delivery/roles-and-responsibilities.md) | "Where the lines blur" |

## 6. Stap voor stap (tutorial)

**Een binnenkomende vraag analyseren in 6 stappen.** Gebruik de vraag van de Head of Customer Service als oefenmateriaal.

1. **Noteer de vraag letterlijk**, met wie het vroeg en waarom nu. ("Tracking page like the parcel carriers", Head of CS, na de TMS go-live.)
2. **Vraag naar het laatste concrete voorbeeld.** Verhalen bevatten behoeften; eisen bevatten oplossingen.
3. **Stel 3 tot 5 keer "waarom?"** tot je bij iets komt dat geen oplossing meer is. Schrijf de keten op.
4. **Formuleer het probleem in één zin** zonder oplossingswoorden (geen "pagina", "app", "mail").
5. **Zoek wie het nog voelt** en wat zij willen: dat geeft je de stakeholders en de tegenstrijdigheden.
6. **Bepaal hoe je weet dat het opgelost is:** één of twee indicatoren met een baseline die je kunt meten.

## 7. Begeleide oefening

**Situatie (nieuw, in dezelfde fictieve organisatie):** de financedirecteur vraagt "een dashboard met alle creditnota's per klant".

Werk de 6 stappen uit. Gebruik deze hulpvragen:

- Welk besluit wil finance nemen met dat dashboard?
- Wat staat er vandaag *niet* op een creditnota? (Hint: [problem statement, "Who feels it"](../../../docs/01-opportunity/problem-statement.md#who-feels-it).)
- Welke bestaande reason code in deze case raakt dit al? (Hint: [US-04](../../../docs/06-backlog/user-stories.md).)
- Wie zijn de stakeholders en wie beslist?

Schrijf je antwoord in `learning/my-work/module-01.md` (zie [template](../../my-work/README.md)). Vergelijk daarna met de modeluitwerking in de [antwoordsleutel](../../answer-keys/01-ba-fundamentals.md#begeleide-oefening).

## 8. Zelfstandige uitdaging

De commercieel directeur zegt in een gang: *"Kunnen we key accounts niet gewoon elke statuswijziging sturen? Dat is toch service."*

Schrijf (max. 1 pagina):

1. het onderliggende behoefte-statement;
2. twee andere stakeholders die het hier niet mee eens zouden zijn, en waarom;
3. welke bestaande beslissing in de case hierover gaat en wie die nam;
4. hoe je dit in 3 zinnen terugkoppelt **zonder** zelf te beslissen.

**Beoordeling (zelf of met een mentor):** behoefte zonder oplossingswoorden (2 p.) · juiste stakeholders met reden (2 p.) · juiste beslissing én eigenaar (2 p.) · antwoord laat de beslissing bij de eigenaar (2 p.) · toon: respectvol, concreet (2 p.). ≥ 7/10 = beheerst.

## 9. Quiz

[Quiz module 1](quiz.md) — 8 vragen. Antwoorden met uitleg staan **apart** in de [antwoordsleutel](../../answer-keys/01-ba-fundamentals.md); open die pas na je eigen poging. Je kunt de quiz ook interactief doen in het [Learning Lab op de site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/learning/).

## 10. Veelgemaakte fouten

| Fout | Waarom het misgaat | Beter |
|---|---|---|
| De gevraagde oplossing meteen uitschrijven | je bouwt iemands idee, niet de behoefte; de andere twee vragers voelen zich genegeerd | eerst het probleem, dan opties |
| Zelf beslissen "omdat je het het best begrijpt" | de PO wordt gepasseerd; jij wordt aanspreekbaar op waarde | opties + gevolgen voorbereiden, eigenaar laat beslissen |
| Value zonder baseline | je kunt nooit aantonen dat het werkte | eerst meten, desnoods met een steekproef |
| Alleen de luidste stakeholder interviewen | de weerstand komt later, tijdens BAT | invloed × belang in kaart brengen, ook de stillen |
| "Stakeholder management" = mails sturen | betrokkenheid is iets anders dan informeren | per stakeholder kiezen: betrekken, raadplegen of informeren |

## 11. Interviewvragen

1. Wat is het verschil tussen een business analyst en een Product Owner? Geef een voorbeeld waar de lijn dun is.
2. Iemand vraagt je een specifieke oplossing te bouwen. Wat doe je eerst?
3. Hoe maak je business value meetbaar? Geef een voorbeeld met baseline en doel.
4. Hoe ga je om met een stakeholder met veel invloed en veel weerstand?
5. Welke discoverytechniek kies je wanneer mensen zeggen dat ze iets doen, maar je twijfelt of dat klopt?

Voorbeeldantwoorden en valkuilen: interviewvoorbereiding.

## 12. Competentiechecklist

Vink pas af als je het **zonder de tekst te bekijken** kunt uitleggen of doen. Registreer je niveau in de [voortgangstracker](../../progress-tracker.md).

- [ ] Ik kan de rol van de BA in twee zinnen uitleggen, met wat de BA níét doet.
- [ ] Ik kan BA, PO en FA onderscheiden met een voorbeeld uit deze case.
- [ ] Ik kan een gevraagde oplossing terugbrengen tot een probleemzin zonder oplossingswoorden.
- [ ] Ik kan uitleggen waarom optie O2 in de business case afviel.
- [ ] Ik kan één KPI met baseline, doel en eigenaar formuleren.
- [ ] Ik kan uitleggen waarom de senior planner key user in BAT werd.
- [ ] Ik heb de begeleide oefening gemaakt en vergeleken met de modeluitwerking.
- [ ] Ik heb de zelfstandige uitdaging gemaakt en scoorde ≥ 7/10.

---

[Learning Lab](../../README.md) · Volgende: [Module 2 — Procesanalyse →](../02-process-analysis/README.md)

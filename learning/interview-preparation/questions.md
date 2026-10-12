# 45 interviewvragen voor een IT business analyst

> Per vraag: **wat de interviewer wil horen** (concepten), een **sterk antwoord** (gebaseerd op deze case, eerlijk gelabeld), een **zwak antwoord** en **doorvragen** om op voorbereid te zijn. Oefen hardop, zonder te lezen. Pas de antwoorden aan aan je eigen woorden en echte ervaring.

**Inhoud:** [1 Rol](#1-de-rol-van-de-business-analyst) · [2 Requirements](#2-requirements) · [3 Agile/Scrum](#3-agile-en-scrum) · [4 BPMN/UML](#4-bpmn-en-uml) · [5 Stakeholders](#5-stakeholders-en-conflict) · [6 Techniek](#6-techniek-en-oplossingsontwerp) · [7 Testen](#7-testen-uat-en-oplevering) · [8 Logistiek](#8-logistiek) · [9 Cases](#9-case-based-scenarios)

---

## 1. De rol van de business analyst

**1.1 Wat doet een IT business analyst volgens jou?**
- *Concepten:* brug business–IT, probleem vóór oplossing, waarde, testbaar maken, beslissingen voorbereiden.
- *Sterk:* "Zorgen dat het team het juiste probleem oplost, op een manier die de business kan gebruiken en IT kan bouwen en testen. Concreet: het probleem helder krijgen, opties met gevolgen voorleggen, het gedrag zo precies beschrijven dat het testbaar is, en mee zorgen dat het in productie ook begrepen wordt. Wat ik níét doe: de prioriteit bepalen — dat is de PO."
- *Zwak:* "Requirements verzamelen en doorgeven aan de developers." (doorgeefluik)
- *Doorvragen:* Wat is het verschil met een PO? Hoe meet je of je goed werk deed?

**1.2 Wat is het verschil tussen een BA en een Product Owner?**
- *Concepten:* accountability backlog/waarde (PO) vs. kwaliteit analyse (BA); voorbereiden vs. beslissen.
- *Sterk:* "De PO is eigenaar van de backlog en beslist over volgorde en scope. De BA zorgt dat die beslissingen goed geïnformeerd zijn: opties, gevolgen, scores. In mijn case bereidde ik de WSJF-scoring voor, maar de PO maakte de trade-offs — bijvoorbeeld US-08 vóór US-06."
- *Zwak:* "De BA doet het werk, de PO tekent af."
- *Doorvragen:* Wat als de PO er niet is en het team wacht?

**1.3 Wat is het verschil tussen een business analyst en een functioneel analist?**
- *Sterk:* "Het vertrekpunt: de BA vertrekt van het probleem en de waarde, de FA van het precieze systeemgedrag. In kleine teams doet één persoon beide. Mijn tweede case over booking amendments is meer FA-werk: beslistabellen, datamodel, interfaces."
- *Doorvragen:* Welke van de twee past jou het best, en waarom?

**1.4 Iemand vraagt je een specifieke oplossing te bouwen. Wat doe je eerst?**
- *Concepten:* behoefte achter de vraag, concreet voorbeeld, 5 whys, opties.
- *Sterk:* "Vragen naar het laatste concrete geval en wat ze zouden doen als ze die oplossing hadden. In de case vroeg de Head of CS een trackingpagina; de echte behoefte was dat klanten een ernstige vertraging vóór hun venster horen. Een trackingpagina beantwoordde de verkeerde vraag."
- *Zwak:* "Ik schrijf de requirements voor die oplossing uit."

**1.5 Hoe toon je de waarde van je werk?**
- *Sterk:* "Met een baseline en een doel per indicator, vóór er gebouwd wordt, en een meetopzet die toeval uitsluit — een controlegroep. In de case: K3 WISMO-contacten tegenover een controlegroep, met een stage gate op −20%."
- *Doorvragen:* Wat als de baseline niet bestaat? ("Een steekproef — 60 orders — en dat zo labelen.")

## 2. Requirements

**2.1 Wat is het verschil tussen functionele en niet-functionele requirements?**
- *Sterk:* "Functioneel: wat het systeem doet — 'berichten per order throttlen'. Niet-functioneel: hoe goed — '95% binnen 2 minuten geëvalueerd', 'een event twee keer verwerkt opent nooit een tweede exception'. Elke NFR heeft bij mij een verificatiemethode."
- *Zwak:* "Niet-functioneel is alles wat niet belangrijk is."

**2.2 Hoe schrijf je goede acceptatiecriteria?**
- *Concepten:* Given/When/Then, grenswaarden, foutgevallen, testbaar, gedrag niet UI.
- *Sterk:* "In Given/When/Then, met het normale geval, de grenzen en minstens één foutgeval. Beslislogica zet ik in een voorbeeldtabel: in de case zijn dat 30 rijen die als test draaien. Bijvoorbeeld 119 minuten is minor, 120 is major."
- *Doorvragen:* Wie schrijft ze — jij, de PO of het team? ("Ik stel voor, het team en de tester vullen aan, de PO aanvaardt.")

**2.3 Een stakeholder zegt: "Het moet gebruiksvriendelijk zijn." Wat doe je?**
- *Sterk:* "Vragen wat ze nu frustreert en voor wie. Dat vertaal ik naar iets meetbaars of observeerbaars: 'een planner erkent de meest dringende exception in maximaal 4 klikken', getest met een key user."

**2.4 Waarom houd je bedrijfsregels apart van user stories?**
- *Sterk:* "Regels veranderen vaker en worden door meerdere stories gebruikt. Eén regeltabel met ID's, stories verwijzen ernaar, voorbeelden testen ze. Als de PO een drempel wijzigt, tonen de tests welke voorbeelden van betekenis veranderen."

**2.5 Hoe zorg je voor traceability?**
- *Sterk:* "Met ID's en een matrix van pijnpunt tot KPI: P5 → BR-1 → FR-06 → ER-10/12 → US-05/07 → AC-07.1 → K1/K3. Geen zware tool nodig; in mijn repo controleert een script dat elke gebruikte ID ook gedefinieerd is."
- *Doorvragen:* Wie onderhoudt dat in een team? ("De BA, als deel van de DoD.")

**2.6 Vertel over een requirement die fout bleek.**
- *Sterk (case, gelabeld als fictief):* "Throttling per exception. Een developer vroeg in refinement of het per exception of per order was; ik antwoordde zelf 'per exception'. In BAT kreeg een klant twee mails in tien minuten over één order. Fix: per order, nieuw criterium. Mijn retro-actie: klantgerichte vragen dezelfde dag naar de PO."

## 3. Agile en Scrum

**3.1 Wat is jouw rol in de Scrum-events als BA?**
- *Sterk:* "Refinement voorbereiden en leiden; in planning het sprintdoel in businesstaal uitleggen; in de daily domeinvragen dezelfde dag oplossen; in de review het demoscript voorbereiden met wie demonstreert; in de retro als teamlid één verbetering aan de analysekant."

**3.2 Heb je in een Scrum-team gewerkt?**
- *Sterk:* eerlijk antwoord uit je eigen ervaring (zie [transferverhaal](transfer-story.md)), aangevuld met: "In mijn case heb ik uitgewerkt hoe een BA elk event ondersteunt, inclusief een refinement die misging."
- *Zwak:* "Ja, veel." (als dat niet klopt)

**3.3 Iedereen zegt dat alles "Must" is. Hoe prioriteer je?**
- *Sterk:* "MoSCoW voor wat in de release zit, WSJF voor de volgorde: cost of delay gedeeld door omvang. De business scoort waarde, het team de omvang, de PO beslist. Afhankelijkheden bepalen daarna de bouwvolgorde."

**3.4 Wat staat in een goede Definition of Ready?**
- *Sterk:* "Rol, behoefte en 'so that'; link naar requirement en regels; criteria met minstens één grens- of foutgeval; ontwerp voor schermen; open vragen beantwoord of geparkeerd met eigenaar; geschat; afhankelijkheden gepland; de tester weet hoe te testen."

**3.5 Wat doe je als een developer midden in de sprint een vraag heeft die jij niet kunt beantwoorden?**
- *Sterk:* "Dezelfde dag uitzoeken bij wie het wel weet; als het gaat over wat de klant ziet of over scope: de PO. Het antwoord leg ik vast in het refinementlog en, als het een regel is, in de regeltabel en de voorbeelden."

## 4. BPMN en UML

**4.1 Wat is het verschil tussen een sequence flow en een message flow?**
- *Sterk:* "Sequence flow is volgorde binnen één pool; message flow is een bericht tussen pools, dus tussen organisaties of partijen."

**4.2 Wanneer gebruik je een parallelle gateway?**
- *Sterk:* "Als meerdere paden tegelijk moeten gebeuren — bijvoorbeeld een exception openen én het bericht klaarzetten. Een exclusieve gateway kiest precies één pad, een inclusieve één of meer."

**4.3 Hoe zorg je dat een AS-IS de werkelijkheid toont?**
- *Sterk:* "Meelopen en het laatste concrete geval laten vertellen, niet het handboek lezen. Workarounds zoals het Excel-blad horen erin. Daarna laten bevestigen door iemand die het werk doet."

**4.4 Waarom zowel BPMN als een state diagram?**
- *Sterk:* "BPMN toont wie wat doet over rollen heen; een state diagram toont de levenscyclus van één exception. Testers vonden met het state diagram twee ontbrekende overgangen, en toen ik de demo bouwde vond ik er nog drie."

**4.5 Werk je met Visio of Visual Paradigm?**
- *Sterk:* eerlijk: "In deze case gebruikte ik [je echte tools]. De notatie is BPMN 2.0; de bestanden zijn standaard-XML die je in elke tool importeert. Een nieuwe tool leer ik snel, de notatie is het belangrijke."

## 5. Stakeholders en conflict

**5.1 Twee stakeholders willen het tegenovergestelde. Wat doe je?**
- *Concepten:* positie vs. behoefte, concreet verhaal, zichtbaar maken, opties, eigenaar beslist.
- *Sterk:* het severity-verhaal van de event storming ([dialoog](../../docs/03-workshops/workshop-dialogue.md)).
- *Zwak:* "Een compromis zoeken waar iedereen een beetje tevreden mee is."

**5.2 Hoe ga je om met een stakeholder met veel invloed en weerstand?**
- *Sterk:* "Het werk van die persoon leren kennen, het ontwerp met hen maken en hen een rol geven waarin ze het kunnen testen. In de case werd de sceptische senior planner key user in BAT: als zij het aanvaardt, aanvaarden de planners het."

**5.3 Hoe faciliteer je een workshop met mensen die elkaar niet vaak zien?**
- *Sterk:* "Event storming: iedereen schrijft eerst stil, dan samen de tijdlijn ordenen, meningsverschillen worden hotspots met een eigenaar en een datum. Ik beslis geen hotspots zelf."

**5.4 Een senior manager wil iets dat buiten scope valt. Wat doe je?**
- *Sterk:* "Serieus nemen, de behoefte begrijpen, op de backlog met een 'so that', en de PO laten ordenen. Duidelijk zijn over wat het zou verdringen. Niet stilletjes in de sprint stoppen."

**5.5 Hoe houd je stakeholders betrokken zonder ze te overladen?**
- *Sterk:* "Per groep kiezen: betrekken, raadplegen of informeren. De sponsor kreeg één pagina na elke review; key users zaten in refinement en BAT; support zat vanaf sprint 1 in refinement."

## 6. Techniek en oplossingsontwerp

**6.1 Leg uit wat een REST-API is aan een niet-technische collega.**
- *Sterk:* "Een afgesproken manier waarop twee systemen elkaar vragen stellen via het web: je vraagt iets op een adres, met een werkwoord — lezen, aanmaken — en krijgt een antwoord met een code die zegt of het gelukt is."

**6.2 Wat verwacht je als BA van een API-contract?**
- *Sterk:* "Per endpoint: wie roept het aan, welke regel zit erachter, verplichte velden en wat `null` betekent, tijdzone, foutcodes met begrijpelijke uitleg, rechten, wat er gebeurt bij herhaling, en geen persoonsgegevens die niet nodig zijn."

**6.3 Wat is idempotentie?**
- *Sterk:* "Iets twee keer doen heeft hetzelfde effect als één keer. Als het TMS een event opnieuw stuurt, mag de klant geen tweede mail krijgen. Elk event heeft een uniek ID; ken je het al, dan negeer je het."

**6.4 Webhook of polling?**
- *Sterk:* "Webhooks zijn sneller en efficiënter, maar events kunnen dubbel, laat of in de verkeerde volgorde komen — dat ontwerp je mee. Polling is eenvoudiger maar trager. Voor 'verwittig vóór het venster' was polling te traag."

**6.5 Leg een technische trade-off uit aan de sponsor.**
- *Sterk:* D-03: "Wachten op de leverancier (datum onzeker) of een kleine eigen component (pilot in 6 weken). Omdat de regels in één module zitten, kunnen we later verhuizen zonder het werk van de business opnieuw te doen."

**6.6 Hoe ga je om met privacy in een oplossing?**
- *Sterk:* "Dataminimalisatie: alleen wat nodig is voor het doel. Berichten bevatten nooit chauffeursgegevens; de klant-API toont alleen wat verstuurd is. De DPO reviewt de templates vóór go-live."

## 7. Testen, UAT en oplevering

**7.1 Wat is het verschil tussen systeemtest en UAT?**
- *Sterk:* "De tester controleert of de software doet wat de stories zeggen; UAT controleert of wat de stories zeggen is wat de business nodig heeft, met key users in hun eigen context."

**7.2 Hoe organiseer je een UAT?**
- *Sterk:* de 8 stappen: doel en scope, key users (ook sceptici), scenario's in hun taal, synthetische testdata, planning met vrijgemaakte tijd, kick-off met ernstdefinities, triage met de PO, sign-off door elke groep.

**7.3 Een major bevinding de dag vóór go-live. Wat doe je?**
- *Sterk:* "Impact en oorzaak helder krijgen, opties voorbereiden — fixen en hertesten, uitstellen, of live met workaround als het minor is — en de PO laten beslissen. Een major gaat niet live zonder fix volgens onze exitcriteria."

**7.4 Wat staat op een go/no-go-checklist?**
- *Sterk:* "BAT getekend zonder open blockers/majors; known issues met workaround, eigenaar en datum; regressie groen; data gecontroleerd; monitoring en rollback getest; support getraind en KB gepubliceerd; gebruikers getraind; klanten geïnformeerd; hypercare-rooster; DPO-review. Elk criterium met een eigenaar en bewijs."

**7.5 Hoe zorg je dat support een feature kan uitleggen?**
- *Sterk:* "Support zit vanaf refinement mee; ik schrijf het KB-artikel met hen, met een sectie 'regel of bug?' en de regel-ID's in de audit trail zodat ze kunnen uitleggen waarom een klant een bericht kreeg."

## 8. Logistiek

**8.1 Wat is het verschil tussen quay-to-quay en door-to-door?**
- *Sterk:* "Quay-to-quay is de overtocht van terminal tot terminal; door-to-door is het hele traject tot bij de ontvanger, met wegvervoer van onderaannemers. De belofte bij door-to-door is een leveringsvenster — dat bepaalt wat 'te laat' is."

**8.2 Wat weet je over onze sector?**
- *Sterk:* publieke feiten (short sea, RoRo, routes, actuele context zoals douane VK–EU en eFTI) + "Mijn case is fictief en gebaseerd op publieke bronnen; ik ben benieuwd hoe het bij jullie werkt, bijvoorbeeld hoe planners vandaag van een vertraagde afvaart horen."
- *Zwak:* beweringen over interne processen.

**8.3 Waar komen zendingsstatussen vandaan en hoe betrouwbaar zijn ze?**
- *Sterk:* "Uit verschillende systemen: afvaartsysteem, terminal, hauliers, douane. Betrouwbaarheid verschilt; hauliers zonder app geven vaak geen status. Daarom houdt de case een ontbrekende status vast tot de planner bevestigt."

**8.4 Hoe overtuig je planners om een nieuw scherm te gebruiken?**
- *Sterk:* "Door het met hen te ontwerpen, te tonen dat het werk wegneemt (geen Excel, geen telefoontjes), en hun zorg — geen valse alarmen — als guardrail-KPI op te nemen."

## 9. Case-based scenarios

**9.1 "Onze klanten klagen over te veel e-mails. Wat doe je?"**
- *Aanpak:* begrijpen (welke mails, welke klanten, sinds wanneer), data (berichten per order — K8), oorzaak (geen severity? geen throttling?), opties (drempels, throttling, voorkeuren), meting, PO beslist.

**9.2 "Een directeur wil een dashboard. Hoe begin je?"**
- *Aanpak:* welke beslissing wil hij nemen met het dashboard? Welke data bestaat al en is ze betrouwbaar? Wat is het minimum dat die beslissing ondersteunt? (Zie module 9, case 1.)

**9.3 "Twee managers geven tegenstrijdige requirements."**
- *Aanpak:* behoefte achter elk, gedeelde doelen zoeken, opties met gevolgen, beslissingseigenaar benoemen, beslissing vastleggen.

**9.4 "Een feature is live, maar de cijfers verbeteren niet."**
- *Aanpak:* klopt de meting (controlegroep, seizoen)? Wordt de feature gebruikt (adoptie)? Klopt de aanname achter de business case? Waar zit het gat (in de case: K5 — consignee gesloten)? Volgende stap met de sponsor (stage gate).

---

[Learning Lab](../README.md) · [Defend your case →](defend-your-case.md)

# Interviewsimulaties

> Drie gesprekken om hardop te oefenen. Laat iemand de rol van interviewer spelen (of lees de vragen zelf voor en neem je antwoord op). Kijk pas na afloop naar de **beoordelingspunten**.

---

## Simulatie 1 — Eerste gesprek met de hiring manager (20 min)

| Min | Interviewer | Waar het om draait |
|---:|---|---|
| 0 | "Vertel kort over jezelf en waarom deze rol." | 60–90 s; waarom BA, waarom logistiek; geen cv voorlezen |
| 3 | "Je hebt een portfoliocase. Vertel erover in twee minuten." | structuur: probleem → aanpak → resultaat → wat níét geclaimd |
| 6 | "Waarom is 'laat' gemeten tegen het einde van het venster?" | D-01; ruis bij planned ETA; klantbelofte |
| 8 | "Wie besliste dat? En wat was jouw rol daarin?" | PO besliste; BA bereidde opties voor |
| 10 | "Welke fout maakte je?" | DEF-04 eerlijk vertellen, met de retro-actie |
| 13 | "Heb je dit met echte stakeholders gedaan?" | nee — eerlijk; wat de case wel toont; wat je echte ervaring is |
| 16 | "Hoe zou je de eerste 30 dagen bij ons aanpakken?" | luisteren, systemen en mensen leren, één backlogdomein, geen grote beloftes |
| 19 | "Heb je vragen voor mij?" | 2 vragen over hoe refinement en BAT hier lopen |

**Beoordelingspunten:** eerlijk over grenzen (geen overclaim) · inhoud juist · beslissingen bij de juiste eigenaar · bondig · minstens één goede vraag terug.

---

## Simulatie 2 — Technisch-functioneel gesprek met een lead developer (25 min)

| Interviewer | Verwacht |
|---|---|
| "Hoe krijgen jullie wijzigingen uit het TMS binnen?" | webhooks + order opvragen via REST; aannames TA-1 – TA-6 |
| "Wat als hetzelfde event twee keer komt?" | idempotentie op eventId; getest; demo stap 3 |
| "En als een ouder event na een nieuwer komt?" | `occurredAt` vergelijken — voorgesteld, níét in de demo (eerlijk zeggen) |
| "Waarom geen Kafka?" | volume, één bron, beheerbaarheid voor support; herbekijken bij 10× volume |
| "Hoe zou jij `resolve` specificeren?" | reason code verplicht, "other" + notitie, 409 vanuit OPEN, rechten, idempotency key |
| "Je hebt een demo gebouwd. Moet een BA coderen?" | nee; demo als bewijs dat de spec precies genoeg is; vond OQ-01 – OQ-05 en een privacylek |
| "Lees deze JSON en zeg wat je opvalt." (toon [exception-critical.json](../../demo/mock-apis/examples/exception-critical.json)) | `null`-velden, UTC, regel-ID's voor audit |

**Beoordelingspunten:** juiste begrippen · weet waar de grens van de BA-rol ligt · kent de beperkingen van de demo · stelt zelf goede vragen ("hoe doen jullie dat nu?").

---

## Simulatie 3 — Case ter plaatse (30 min)

**Opdracht (gekregen bij het begin):** *"Klanten van onze door-to-doordienst klagen dat ze te veel e-mails krijgen sinds we statusmeldingen aanzetten. De klantendienst wil ze uitzetten, sales wil ze houden. Je hebt 15 minuten voorbereiding en 15 minuten om je aanpak te presenteren."*

**Wat een sterke aanpak bevat:**

1. **Verduidelijken:** welke meldingen, sinds wanneer, welke klanten klagen, hoeveel mails per order (K8)?
2. **Behoeften:** klantendienst (minder klachten), sales (klanten geïnformeerd), klanten (alleen wat hun dag verandert).
3. **Hypothese:** meldingen per statuswijziging i.p.v. per relevante uitzondering (cf. optie O2: ±9 wijzigingen, ±0,3 relevant).
4. **Opties:** (a) uitzetten; (b) severity-drempels + throttling; (c) voorkeuren per klant; combinaties met gevolgen.
5. **Meten:** berichten per order, uitschrijvingen, WISMO vóór/na, controlegroep.
6. **Beslisser en volgende stap:** PO; eerst een week data verzamelen, dan beslissen.

**Beoordelingspunten:** begint niet met de oplossing · gebruikt data · ziet beide kanten · geeft opties met gevolgen · benoemt wie beslist · rondt af met een concrete volgende stap.

---

[← Defend your case](defend-your-case.md) · [Transferverhaal →](transfer-story.md)

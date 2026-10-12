# Quiz — Module 2: Procesanalyse

Antwoorden: [antwoordsleutel](../../answer-keys/02-process-analysis.md) — pas na je poging.

### Q1
Welk BPMN-element gebruik je voor een bericht tussen twee organisaties (twee pools)?

- A) Sequence flow
- B) Message flow
- C) Association
- D) Exclusive gateway

### Q2
In de TO-BE heeft de gateway "Exception?" de uitgangen *ja* en *nee*. Welk type gateway is dat?

- A) Parallel (AND)
- B) Inclusive (OR)
- C) Exclusive (XOR)
- D) Event-based

### Q3
Waar is de voorwaarde achter de gateway "Exception?" gedefinieerd?

- A) In de gateway zelf, als tekst
- B) In de exception rules (ER-01 – ER-07)
- C) In de sprint planning
- D) Nergens; de planner beslist

### Q4
Welke uitspraak over het AS-IS van deze case klopt?

- A) Het toont dat het TMS de vertraging niet kent
- B) Het toont dat de informatie bestaat maar tussen mensen verloren gaat, omdat niemand eigenaar is
- C) Het is gemaakt vanuit het procedurehandboek
- D) Het modelleert alle oorzaken tegelijk

### Q5
Je wilt tonen in welke toestanden één exception kan zijn en hoe ze overgaat. Welk diagram?

- A) BPMN met lanes
- B) UML sequentiediagram
- C) UML state diagram
- D) Use case diagram

### Q6
Wat levert een gap-analyse op die een TO-BE-diagram alleen niet geeft?

- A) De kleuren van de lanes
- B) Per verschil het type verandering (systeem, beleid, organisatie, proces) en wie geraakt wordt
- C) De story points
- D) De testresultaten

### Q7
Wat is de correctere BPMN-manier om "niet erkend binnen 30 minuten → escaleren" te modelleren?

- A) Een tekstannotatie
- B) Een timer boundary event op de taak, met een flow naar "Escalate to shift lead"
- C) Een parallel gateway
- D) Een extra lane "Timer"

### Q8
Waarom bewaar je het `.bpmn`-bestand en niet alleen een afbeelding?

- A) Afbeeldingen zijn te groot
- B) Het `.bpmn`-bestand is BPMN 2.0-XML dat elke tool kan openen en aanpassen; de afbeelding is maar een export
- C) GitHub toont geen afbeeldingen
- D) Dat schrijft Scrum voor

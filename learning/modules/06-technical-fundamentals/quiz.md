# Quiz — Module 6: Technische fundamenten

Antwoorden: [antwoordsleutel](../../answer-keys/06-technical-fundamentals.md) — pas na je poging.

### Q1
Een planner probeert een exception af te sluiten die nog niet erkend is. Welke statuscode geeft het contract?

- A) 200
- B) 404
- C) 409
- D) 500

### Q2
Het TMS stuurt hetzelfde event (zelfde eventId) een tweede keer. Wat hoort er te gebeuren?

- A) Een tweede exception en een tweede mail
- B) Niets verandert; het event wordt herkend en genegeerd (200)
- C) Een foutmelding 500
- D) De eerste exception wordt verwijderd

### Q3
Wat is het verschil tussen authenticatie en autorisatie?

- A) Er is geen verschil
- B) Authenticatie = wie ben je; autorisatie = wat mag je
- C) Authenticatie = wat mag je; autorisatie = wie ben je
- D) Autorisatie gaat alleen over wachtwoorden

### Q4
Wat betekent `"assigneeId": null` in een exception?

- A) Een fout in de data
- B) Er is (nog) niemand toegewezen
- C) De exception is verwijderd
- D) De klant is onbekend

### Q5
Waarom koos de case voor een tabel als wachtrij in plaats van een message broker?

- A) Message brokers zijn verboden
- B) Eén bron, bescheiden volume; een tabel geeft volgorde, retries en zichtbaarheid zonder extra infrastructuur voor support
- C) Een broker is te traag
- D) De leverancier wilde het zo

### Q6
Wie is in deze case het "system of record" voor het leveringsvenster?

- A) De exceptioncomponent
- B) Het TMS
- C) De klant
- D) Het notificatiesysteem

### Q7
Wat deed de demo fout in de eerste versie van de klant-API, en hoe werd het opgelost?

- A) Ze stuurde de chauffeursnaam mee — verwijderd
- B) Ze stuurde de interne severity en berichtstatus mee — opgelost met een publieke berichtprojectie en een test
- C) Ze gebruikte de verkeerde tijdzone — omgezet
- D) Er was geen fout

### Q8
Webhook vs. polling: welke uitspraak klopt?

- A) Polling is altijd beter
- B) Webhooks zijn sneller en efficiënter, maar events kunnen dubbel, laat of in verkeerde volgorde komen
- C) Webhooks hebben nooit dubbels
- D) Polling kan geen fouten geven

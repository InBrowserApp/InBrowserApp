## Begrijp cron-schema's voordat je ze uitrolt

Cron-expressies zijn compact, maar een kleine fout in een veld kan een taak veel vaker, of juist veel minder vaak, uitvoeren dan bedoeld. Deze parser valideert de expressie in je browser, legt het schema in gewone taal uit, splitst elk veld uit en toont een voorbeeld van aankomende uitvoeringstijden.

### Wanneer je dit gebruikt

- Controleer een schema voor deployment, back-up, opschoning of notificaties voordat je het toevoegt aan een server, CI-systeem of task runner.
- Vergelijk een gekopieerde cron-expressie met het schema dat je daadwerkelijk verwacht.
- Leer of debug cron-syntaxis door één veld tegelijk te wijzigen en te zien hoe de uitleg wordt bijgewerkt.

### Ondersteunde indeling

De tool ondersteunt standaard Unix-cron-expressies met vijf velden: minuut, uur, dag van de maand, maand en dag van de week. De tool accepteert ook een expressie met zes velden, met seconden vooraan, voor schedulers die precisie op secondenniveau ondersteunen.

### Het resultaat lezen

De samenvatting geeft een beschrijving in gewone taal, terwijl de veldtabel laat zien hoe de ruwe expressie is opgesplitst. De aankomende uitvoeringstijden gebruiken de lokale tijdzone van je browser, dus vergelijk ze met de tijdzone die wordt gebruikt door de scheduler die de taak uitvoert.

### Opmerkingen

- Waarden voor dag van de week gebruiken vaak `0` of `7` voor zondag, en namen zoals `MON` of `FRI` worden ook geaccepteerd.
- Maandnamen zoals `JAN` of `DEC` kunnen productieschema's makkelijker te beoordelen maken.
- Als je scheduler een ander cron-dialect gebruikt, controleer dan speciale tokens zoals `?`, `L`, `W` of `#` in de eigen documentatie van die scheduler.

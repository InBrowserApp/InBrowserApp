## Bouw cron-schema's visueel

Cron-expressies zijn compact, maar een kleine wijziging in het verkeerde veld kan een taak verplaatsen van "ochtenden op werkdagen" naar "elke minuut." Deze generator geeft elk veld eigen bediening, zodat je een standaardexpressie met vijf velden kunt maken zonder elke syntaxregel te onthouden.

### Wanneer het helpt

- Maak schema's voor CI-taken, back-ups, cachewarmers, rapporten en andere terugkerende taken.
- Begin met een bekende preset en verfijn een veld tegelijk.
- Bekijk komende lokale uitvoeringstijden voordat je de expressie in een scheduler plakt.

### Zo gebruik je het

1. Kies een snelle preset of behoud de standaardexpressie en bewerk elk veld handmatig.
2. Kies of elk veld op elke waarde, een interval, specifieke waarden of een bereik moet draaien.
3. Controleer de gegenereerde expressie en de preview van de volgende uitvoering, en kopieer deze daarna naar je scheduler.

### Opmerkingen

- Deze tool genereert standaard cron met vijf velden: minuut, uur, dag van de maand, maand en dag van de week.
- Zondag wordt weergegeven als `0`, wat wordt geaccepteerd door gangbare Unix-achtige cron-schedulers.
- Als zowel dag van de maand als dag van de week beperkt zijn, voeren veel cron-implementaties uit wanneer een van beide velden overeenkomt. Sommige systemen verschillen hierin, dus controleer die combinatie in je doelscheduler.

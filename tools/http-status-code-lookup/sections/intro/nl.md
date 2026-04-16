## Wat is een HTTP-statuscode?

HTTP-statuscodes zijn antwoordcodes van drie cijfers die een server terugstuurt om te laten zien wat er met een verzoek is gebeurd. Je ziet ze vaak in browser-devtools, API-antwoorden, serverlogs, uptime-checks en dashboards van reverse proxies.

### Zo lees je de belangrijkste statuscodefamilies

- **1xx Informatief:** De server heeft het verzoek ontvangen en de verwerking loopt nog.
- **2xx Succes:** Het verzoek is succesvol afgerond.
- **3xx Redirectie:** De client moet een andere locatie volgen of een gecachet resultaat hergebruiken.
- **4xx Clientfout:** Het probleem zit in het verzoek zelf, zoals een ontbrekende resource, ongeldige invoer of mislukte authenticatie.
- **5xx Serverfout:** De server of een upstream-afhankelijkheid faalde tijdens het verwerken van een geldig verzoek.

### Wanneer deze lookup handig is

Gebruik dit hulpmiddel wanneer je de betekenis van een code wilt bevestigen, vergelijkbare codes zoals 401 en 403 of 502 en 504 wilt vergelijken, of wilt zoeken op een zin uit een foutmelding. Zoeken werkt op code, statusnaam en gelokaliseerde beschrijving.

### Waarom juiste interpretatie belangrijk is

Tijdens het debuggen is de statuscode vaak de snelste aanwijzing. Een 4xx-antwoord wijst meestal naar het verzoek, de credentials of de doelresource. Een 5xx-antwoord wijst meestal naar de applicatie, gateway of upstream-service. Wie eerst de categorie leest, kiest sneller de juiste volgende stap.

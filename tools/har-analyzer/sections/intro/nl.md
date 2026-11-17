## Een HAR-opname openen

Exporteer een HAR-bestand (HTTP Archive) via het netwerkpaneel van je browser nadat je de te onderzoeken verzoeken hebt opgenomen. Open het `.har`- of `.json`-bestand hier, sleep het hiernaartoe of laad het voorbeeld. De limiet is 20 MiB en 20.000 items.

## Trage of mislukte verzoeken vinden

Zoek op URL, methode, status of MIME-type en sorteer vervolgens op starttijd, duur of overdrachtsgrootte. Verzoeken delen één tijdschaal, gemeten vanaf het eerste verzoek. Selecteer een verzoek om headers, cookies, parameters, body's en tijdsfasen te bekijken.

Het filter voor mislukte verzoeken omvat status 0, 4xx en 5xx. Status 0 betekent dat er geen HTTP-antwoord is vastgelegd; het 3xx-filter omvat ook 304-cacheantwoorden. TLS maakt deel uit van de verbindingstijd.

## De vastgelegde gegevens lezen

De verwerking vindt plaats in je browser. De beschikbare details hangen af van de export. Onbekende groottes tellen niet mee in de totalen; de opnameduur is niet beschikbaar als de duur van een verzoek ontbreekt. Het watervaldiagram gebruikt wel de vastgelegde starttijden en bekende eindtijden.

Voorvertoningen van body's behouden de vastgelegde tekst. Voorvertoningen en hun kopieën, evenals afzonderlijke veldwaarden, zijn beperkt tot 100.000 tekens. Gecodeerde body's blijven gecodeerd.

## Een HAR-bestand opschonen

Een HAR-bestand (HTTP Archive) legt de netwerkverzoeken en antwoorden van je browser vast. Het kan sessiecookies, autorisatietokens, URL’s en berichten met privégegevens bevatten. Maak met deze tool een opgeschoonde kopie voor een supportticket, bugmelding of collega. De methode, statuscode en tijdsmetingen van elk verzoek blijven behouden.

1. Open de ontwikkelaarstools van je browser en ga naar **Netwerk**. Reproduceer het probleem en exporteer het logboek als HAR-bestand. Kies in Chrome **Export HAR (sanitized)** voor een kopie waaruit de standaardheaders met inloggegevens al zijn verwijderd.
2. Open het geëxporteerde HAR-bestand hier of sleep het hiernaartoe. Zodra je een bestand kiest, maakt de tool een kopie. Probeer het voorbeeld om te zien wat er verandert bij een testopname.
3. Bekijk de aantallen en kies **Opgeschoond HAR-bestand downloaden**. Het nieuwe bestand eindigt op `.sanitized.har`. Je kunt het importeren in de ontwikkelaarstools of openen met de [HAR-netwerkanalysator](/nl/tools/har-analyzer/). De verwerking gebeurt in je browser.

## Wat wordt verwijderd of gemaskeerd?

De tool verwijdert cookies en gangbare authenticatieheaders, waaronder `Authorization` en `X-API-Key`. Standaard worden ook de waarden van URL-parameters gemaskeerd en wordt de inhoud van verzoeken, antwoorden en opgenomen WebSocket-berichten verwijderd. Zo wordt `?token=example&page=2` in de export `?token=REDACTED&page=REDACTED`. De parameternamen blijven beschikbaar voor foutopsporing. Elk gewijzigd veld telt mee, ook als dezelfde waarde op meerdere plekken voorkomt.

Schakel de bijbehorende optie uit als je de oorspronkelijke parameterwaarden of berichtinhoud nodig hebt om een probleem te reproduceren. Hostnamen, URL-paden, gewone headers en browserspecifieke metadata kunnen nog privégegevens bevatten. Controleer deze velden voordat je het bestand deelt.

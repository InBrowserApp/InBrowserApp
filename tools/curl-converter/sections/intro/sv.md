## Vad är en cURL-omvandlare?

En cURL-omvandlare gör om ett cURL-kommando till färdig kod för många språk och HTTP-klienter. Det är användbart när API-dokumentation, webbläsarens utvecklarverktyg eller terminalhistoriken redan ger dig en fungerande begäran och du vill flytta den till applikationskod utan att manuellt bygga om metod, URL, headers, cookies eller body.

**Kredit**
Drivs av [curlconverter](https://curlconverter.com) av Nick Carneiro.

## När det här verktyget är användbart

- När du utgår från ett fungerande cURL-exempel i API-dokumentation eller terminalhistorik.
- När du vill jämföra samma begäran i `fetch`, Python `requests`, Go, Java, PHP och andra mål innan du bestämmer dig.
- När du snabbt vill skapa en grund och sedan lägga till projektets egen felhantering, retries, auth-förnyelse och konfiguration.

## Vad du bör granska efter konverteringen

- Kontrollera att det valda målet matchar HTTP-biblioteket och runtime-miljön som projektet faktiskt använder.
- Läs varningar noggrant. Vissa shell-regler för citattecken, miljövariabler eller cURL-flaggor som inte stöds kan behöva justeras manuellt.
- Byt ut platshållartokens, hemligheter eller exempel-URL:er innan du checkar in den genererade koden.

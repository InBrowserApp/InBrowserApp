## Hva er en cURL-omformer?

En cURL-omformer gjør en cURL-kommando om til kode som er klar til bruk for mange språk og HTTP-klienter. Den er nyttig når API-dokumentasjon, utviklerverktøy i nettleseren eller terminalhistorikken allerede gir deg en fungerende forespørsel, og du vil flytte den inn i applikasjonskode uten å bygge opp metode, URL, headere, cookies eller body manuelt på nytt.

**Kreditt**
Drevet av [curlconverter](https://curlconverter.com) av Nick Carneiro.

## Når dette verktøyet er nyttig

- Når du starter med et fungerende cURL-eksempel fra API-dokumentasjon eller terminalhistorikk.
- Når du vil sammenligne den samme forespørselen mellom `fetch`, Python `requests`, Go, Java, PHP og andre mål før du velger.
- Når du vil lage et raskt utgangspunkt og deretter legge til prosjektets egen feilhåndtering, gjentatte forsøk, oppfrisking av autentisering og konfigurasjon.

## Hva du bør kontrollere etter konverteringen

- Sørg for at valgt mål passer med HTTP-biblioteket og runtime-miljøet som prosjektet faktisk bruker.
- Les advarsler nøye. Enkelte regler for shell-sitering, miljøvariabler eller cURL-flagg som ikke støttes kan kreve manuell opprydding.
- Bytt ut plassholdertokener, hemmeligheter eller eksempel-URL-er før du committer den genererte koden.

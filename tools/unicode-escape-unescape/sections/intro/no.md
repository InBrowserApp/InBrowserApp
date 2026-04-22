## Hva er Unicode-escaping?

Unicode-escaping konverterer tegn til kodede sekvenser som representerer deres Unicode-kodepunkter. Dette er essensielt når kildekode, konfigurasjonsfiler eller dataformater ikke kan inneholde visse tegn direkte.

**Vanlige escape-formater:**

- `\uXXXX` — JavaScript / JSON, brukes i de fleste programmeringsspråk
- `\u{XXXXX}` — ES6+ JavaScript, støtter tilleggstegn uten surrogatpar
- `&#xXXXX;` / `&#DDDD;` — HTML-entiteter i heksadesimal eller desimal form
- `U+XXXX` — Standard Unicode-notasjon brukt i dokumentasjon
- `\xXX` / `%XX` — UTF-8-koding på bytenivå, vanlig i URL-er og C-lignende språk
- `\UXXXXXXXX` — Python 8-sifret format for ethvert kodepunkt
- `0xXXXX` — Heksadesimal literal-notasjon

## Når bør du bruke dette verktøyet

- Bygge inn ikke-ASCII-tegn i kildekode eller konfigurasjonsfiler som krever ASCII-sikker koding
- Feilsøke forvrengt tekst ved å inspisere de underliggende Unicode-kodepunktene
- Konvertere mellom ulike escape-notasjoner når du porterer mellom språk eller formater
- Forberede tekst for JSON-, HTML- eller URL-kontekster som trenger entitetskodet tegn

## Hvordan det fungerer

Skriv eller lim inn ren tekst på venstre side, og verktøyet escaper ikke-ASCII-tegn med det valgte formatet. Lim inn escaped tekst på høyre side, og det oppdager og dekoder automatisk alle støttede formater samtidig. Alt kjøres lokalt i nettleseren.

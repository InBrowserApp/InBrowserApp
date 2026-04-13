## Vad är Unicode-escapning?

Unicode-escapning konverterar tecken till kodade sekvenser som representerar deras Unicode-kodpunkter. Det är nödvändigt när källkod, konfigurationsfiler eller dataformat inte kan innehålla vissa tecken direkt.

**Vanliga escape-format:**

- `\uXXXX` — JavaScript / JSON, används i de flesta programmeringsspråk
- `\u{XXXXX}` — ES6+ JavaScript, stöder supplementära tecken utan surrogatpar
- `&#xXXXX;` / `&#DDDD;` — HTML-entiteter i hexadecimal eller decimal form
- `U+XXXX` — Unicode-standardnotation som används i dokumentation
- `\xXX` / `%XX` — UTF-8-kodning på bytenivå, vanligt i URL:er och C-liknande språk
- `\UXXXXXXXX` — Pythons 8-siffriga format för alla kodpunkter
- `0xXXXX` — Hexadecimal literalnotation

## När ska du använda det här verktyget

- Infoga icke-ASCII-tecken i källkod eller konfigurationsfiler som kräver ASCII-säker kodning
- Felsöka förvanskad text genom att inspektera underliggande Unicode-kodpunkter
- Konvertera mellan olika escape-notationer vid portering mellan språk eller format
- Förbereda text för JSON, HTML eller URL-kontexter som behöver entitetskodade tecken

## Hur det fungerar

Skriv eller klistra in vanlig text till vänster så escapar verktyget icke-ASCII-tecken med det valda formatet. Klistra in escapad text till höger så identifieras och avkodas alla format som stöds automatiskt. Allt körs lokalt i webbläsaren.

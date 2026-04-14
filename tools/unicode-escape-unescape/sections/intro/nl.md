## Wat is Unicode-escaping?

Unicode-escaping converteert tekens naar gecodeerde reeksen die hun Unicode-codepunten vertegenwoordigen. Dit is essentieel wanneer broncode, configuratiebestanden of dataformaten bepaalde tekens niet direct kunnen bevatten.

**Veelvoorkomende escape-indelingen:**

- `\uXXXX` — JavaScript / JSON, gebruikt in de meeste programmeertalen
- `\u{XXXXX}` — ES6+ JavaScript, ondersteunt supplementaire tekens zonder surrogaatparen
- `&#xXXXX;` / `&#DDDD;` — HTML-entiteiten in hexadecimale of decimale vorm
- `U+XXXX` — Standaard Unicode-notatie gebruikt in documentatie
- `\xXX` / `%XX` — UTF-8-codering op byteniveau, veelvoorkomend in URL's en C-achtige talen
- `\UXXXXXXXX` — Python 8-cijferige indeling voor elk codepunt
- `0xXXXX` — Hexadecimale letterlijke notatie

## Wanneer deze tool gebruiken

- Non-ASCII-tekens insluiten in broncode of configuratiebestanden die ASCII-veilige codering vereisen
- Verminkte tekst debuggen door de onderliggende Unicode-codepunten te inspecteren
- Converteren tussen verschillende escape-notaties bij het overzetten tussen talen of formaten
- Tekst voorbereiden voor JSON-, HTML- of URL-contexten die entiteitsgecodeerde tekens vereisen

## Hoe het werkt

Typ of plak platte tekst aan de linkerkant en de tool escapet non-ASCII-tekens met de geselecteerde indeling. Plak geëscapete tekst aan de rechterkant en het detecteert en decodeert automatisch alle ondersteunde indelingen tegelijkertijd. Alles draait lokaal in de browser.

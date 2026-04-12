## Hva er URL-koding?

URL-koding (også kalt prosentkoding) er en metode for å konvertere spesialtegn til et format som kan overføres trygt over internett. URL-er kan bare inneholde visse tegn, så alle tegn som ikke er tillatt må kodes.

**Hvordan det fungerer:**

- Spesialtegn konverteres til `%` etterfulgt av deres heksadesimale ASCII-kode
- Eksempel: et mellomrom blir `%20`, `@` blir `%40`
- Bare bokstaver (A-Z, a-z), tall (0-9) og noen symboler (- \_ . ~) trenger ikke koding

**Vanlige eksempler:**

- Mellomrom → `%20`
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Hvorfor det er nødvendig:**

- URL-er har reserverte tegn med spesielle betydninger
- Sikrer at data overføres korrekt
- Forhindrer konflikter med URL-struktur
- Påkrevd for webskjemaer og API-kall

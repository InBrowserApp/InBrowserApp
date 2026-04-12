## Vad är URL-kodning?

URL-kodning (även kallad procentkodning) är en metod för att konvertera specialtecken till ett format som kan överföras säkert över internet. URL:er kan bara innehålla vissa tecken, så alla tecken som inte är tillåtna måste kodas.

**Hur det fungerar:**

- Specialtecken konverteras till `%` följt av deras hexadecimala ASCII-kod
- Exempel: ett mellanslag blir `%20`, `@` blir `%40`
- Endast bokstäver (A-Z, a-z), siffror (0-9) och vissa symboler (- \_ . ~) behöver inte kodas

**Vanliga exempel:**

- Mellanslag → `%20`
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Varför det behövs:**

- URL:er har reserverade tecken med speciella betydelser
- Säkerställer att data överförs korrekt
- Förhindrar konflikter med URL-struktur
- Krävs för webbformulär och API-anrop

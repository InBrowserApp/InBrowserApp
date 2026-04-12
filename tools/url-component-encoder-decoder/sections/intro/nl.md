## Wat is URL-codering?

URL-codering (ook wel procentcodering genoemd) is een methode om speciale tekens om te zetten naar een formaat dat veilig over het internet kan worden verzonden. URL's kunnen alleen bepaalde tekens bevatten, dus elk teken dat niet is toegestaan moet worden gecodeerd.

**Hoe het werkt:**

- Speciale tekens worden omgezet naar `%` gevolgd door hun hexadecimale ASCII-code
- Voorbeeld: een spatie wordt `%20`, `{'@'}` wordt `%40`
- Alleen letters (A-Z, a-z), cijfers (0-9) en enkele symbolen (- \_ . ~) hoeven niet gecodeerd te worden

**Veel voorkomende voorbeelden:**

- Spatie → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Waarom het nodig is:**

- URL's hebben gereserveerde tekens met speciale betekenissen
- Zorgt ervoor dat gegevens correct worden verzonden
- Voorkomt conflicten met URL-structuur
- Vereist voor webformulieren en API-aanroepen

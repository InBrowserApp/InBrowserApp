## Vad är NanoID?

NanoID är en kompakt generator för unika ID:n som är säkra för URL:er och utformad för moderna webbappar, API:er och interna verktyg. Standardformatet använder 21 tecken från ett alfabet med 64 tecken, vilket ger ungefär 126 bitars slumpmässighet och ändå håller ID:t tillräckligt kort för URL:er, filnamn och testdata.

Allt i det här verktyget körs lokalt i din webbläsare. Ditt anpassade alfabet och de genererade ID:na lämnar aldrig sidan, vilket gör verktyget praktiskt för snabb prototypframtagning, generering av fixtures och engångsuppgifter i drift.

**Viktiga punkter:**

- **URL-säker**: använder A-Z, a-z, 0-9, - och \_.
- **Anpassningsbar**: justera längd och alfabet efter dina begränsningar.
- **Säker slumpmässighet**: använder kryptografiskt säkra slumpvärden i webbläsaren.
- **Export som ren text**: kopiera eller ladda ner den aktuella batchen när du behöver seeddata, demoinnehåll eller listor som är redo att importeras.

**Praktiska råd:**

- Behåll standardlängden på 21 tecken när du behöver en stark allmän identifierare med mycket låg kollisionsrisk.
- Kortare ID:n fungerar för tillfälliga UI-token eller lokala mockdata, men kollisionsrisken ökar när du kortar längden eller genererar större batcher.
- Ett större alfabet ger mer entropi per tecken, så du kan ofta hålla ID:n kortare utan att förlora lika mycket unikhet.
- Anpassade alfabet bör bara innehålla unika tecken. Dubbletter snedvrider fördelningen, därför blockerar verktyget dem innan resultatet genereras.

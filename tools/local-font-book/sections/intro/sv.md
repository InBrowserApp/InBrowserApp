## Vad är Local Font Access?

Local Font Access är ett webbläsar-API som listar typsnitt installerade på enheten.

Det här verktyget låter dig söka i resultaten, jämföra närliggande varianter och kopiera en CSS-snutt för det valda typsnittet.

Det fungerar bara i säkra kontexter och stödda webbläsare, och kräver användartillstånd (local-fonts).

API:et returnerar FontData med family, fullName, postscriptName och style.

### Viktiga punkter

- Använd det för att bekräfta de exakta namn du behöver för en CSS-`font-family`-stack på den aktuella enheten.
- Anrop måste triggas av en användargest.
- Permissions Policy kan blockera åtkomst på vissa webbplatser.
- Detta verktyg körs lokalt och laddar inte upp typsnitt.

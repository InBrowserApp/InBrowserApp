## Konverter miljøkonfigurasjon

Lim inn en `.env`-fil og velg JSON eller YAML, eller konverter et flatt JSON/YAML-objekt tilbake til `.env`. Importer lokale filer, bytt inndata og utdata, og kopier eller last ned resultatet. Alt kjører i nettleseren din; konfigurasjonen blir aldri lastet opp eller lagret i nettleserloggen eller lokal lagring.

### Verdier og anførselstegn

Miljøvariabler er strenger: `PORT=3000`, `DEBUG=false` og `CODE=0012` forblir `"3000"`, `"false"` og `"0012"`. Tall og boolske verdier i JSON/YAML konverteres til strenger. Null, matriser og nestede objekter krever en eksplisitt strengverdi. Sett YAML-verdier som `0012` i anførselstegn når den nøyaktige skrivemåten er viktig.

Parseren støtter tomme linjer, `#`-kommentarer, et `export`-prefiks og enkle, doble eller bakovervendte anførselstegn med verdier over flere linjer. Bare sekvensene `\n` og `\r` innenfor doble anførselstegn tolkes. Andre anførselstegn og omvendte skråstreker beholdes bokstavelig, i tråd med vanlig dotenv-oppførsel. Nøkler bruker bokstaver, sifre og understreker og kan ikke starte med et siffer. Utdataene velger en type anførselstegn som bevarer verdien.

### Konfigurasjonskontroll

Dupliserte `.env`-nøkler viser linjenumrene sine; den siste definisjonen brukes. Manglende avsluttende anførselstegn, tekst etter avsluttende anførselstegn og ugyldige tilordninger viser feil med lenker til den berørte linjen. Typografiske anførselstegn gir en advarsel. Dupliserte JSON/YAML-nøkler er feil.

Kommentarer, opprinnelig type anførselstegn og formatering blir ikke bevart. Referanser som `${NAME}` og skallkommandoer beholdes bokstavelig og blir aldri kjørt. Ulike `.env`-innlastere har ulike regler; dette verktøyet følger det dokumenterte delsettet i stedet for å tolke skallskript.

Se [Node.js-spesifikasjonen for .env](https://nodejs.org/api/environment_variables.html#dotenv) og [parsingreglene for dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).

## Hva er SQL Formatter & Linter?

SQL Formatter & Linter formaterer SQL-spørringer på nytt i nettleseren din og sjekker dem samtidig for et lite sett med problemer med høy signalverdi. Det er nyttig når du vil ha renere spørringsoppsett, konsistent skrivemåte for nøkkelord og rask tilbakemelding om risikable mønstre som `SELECT *` eller `UPDATE`-setninger uten `WHERE`-klausul.

## Når Bør Du Bruke Det?

Bruk dette verktøyet når du går gjennom SQL skrevet for hånd, rydder opp i limte spørringer før du deler dem, eller sammenligner formatering på tvers av ulike SQL-dialekter. Det passer godt for ad hoc-gjennomgang av spørringer, opprydding i pull requests og ren nettleserbasert formatering uten å sende SQL-en til en server.

## Hva Sjekker Det?

Denne versjonen holder formatteren og linteren separate, men koordinert. Formatering bruker `sql-formatter` med dialektbevisste oppsettsvalg, mens linting viser parserfeil, manglende semikolon, brede `SELECT *`-bruk, usikre mutasjoner, lange linjer og avvik i skrivemåten for nøkkelord.

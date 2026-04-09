## Vad är SQL Formatter & Linter?

SQL Formatter & Linter formaterar om SQL-frågor i webbläsaren och kontrollerar dem samtidigt mot en liten uppsättning högsignalproblem. Det är användbart när du vill ha ett renare frågelayout, konsekvent användning av versaler i nyckelord och snabb återkoppling om riskabla mönster som `SELECT *` eller `UPDATE`-satser utan `WHERE`-villkor.

## När Ska Den Användas

Använd det här verktyget när du granskar SQL skriven för hand, städar upp inklistrade frågor innan du delar dem eller jämför formatering mellan olika SQL-dialekter. Det fungerar bra för ad hoc-granskning av frågor, städning av pull requests och webbläsarbaserad formatering utan att skicka din SQL till en server.

## Vad Den Kontrollerar

Den här versionen håller formateraren och lintern separata men samordnade. Formateringen använder `sql-formatter` med dialektmedvetna layoutalternativ, medan lintningen visar analysfel, saknade semikolon, bred användning av `SELECT *`, osäkra ändringar, långa rader och avvikelser i versal-/gemener för nyckelord.

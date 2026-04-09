## Wat is SQL Formatter & Linter?

SQL Formatter & Linter herschrijft SQL-query's in je browser en controleert ze tegelijk op een kleine set signalerende problemen. Dit is handig wanneer je een schonere querylay-out, consistent hoofdlettergebruik voor trefwoorden en snelle feedback wilt op risicovolle patronen zoals `SELECT *` of `UPDATE`-statements zonder `WHERE`-clausule.

## Wanneer Gebruik Je Het

Gebruik deze tool wanneer je handgeschreven SQL beoordeelt, geplakte query's opschoont voordat je ze deelt, of opmaak vergelijkt tussen verschillende SQL-dialecten. Het werkt goed voor ad-hoc querybeoordeling, opschoning van pull requests en uitsluitend browsergebaseerde opmaak zonder je SQL naar een server te sturen.

## Wat Het Controleert

Deze rewrite houdt de formatter en linter gescheiden maar gecoördineerd. Het formatteren gebruikt `sql-formatter` met dialectbewuste lay-outopties, terwijl linten parsefouten, ontbrekende puntkomma's, veelvuldig `SELECT *`-gebruik, onveilige mutaties, lange regels en afwijkingen in hoofdlettergebruik voor trefwoorden blootlegt.

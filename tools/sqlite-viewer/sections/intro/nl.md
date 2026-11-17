## SQLite-databases verkennen in je browser

Open een SQLite 3-database om tabellen en views te verkennen, kolommen, indexen, externe sleutels en CREATE-instructies te bekijken of een alleen-lezen SQL-query uit te voeren. Probeer de voorbeelddatabase om de werkruimte te ontdekken. Je bestand wordt lokaal verwerkt en nooit gewijzigd.

## Query's uitvoeren en resultaten exporteren

Selecteer een tabel of view om de rijen te laden en bewerk vervolgens de SQL om gegevens te filteren, te sorteren of samen te voegen. Voer één SELECT-, WITH- of EXPLAIN-instructie uit met **Query uitvoeren** of **Ctrl/⌘ + Enter**. Klik op een cel om de volledige waarde te bekijken en te kopiëren.

Kies een resultaatlimiet van 100, 1.000 of 10.000 rijen en bekijk het resultaat met 50 rijen per pagina. Query's hebben een tijdslimiet van 10 seconden en een resultaatgroottelimiet van 5 MiB. CSV- en JSON-exports bevatten alle geladen rijen van alle pagina's.

JSON gebruikt afzonderlijke kolomnamen en rijarrays om dubbele namen en NULL-waarden te behouden. Gehele getallen zijn exacte decimale tekenreeksen en BLOB's bevatten een hexadecimale `$blob`-waarde. CSV bevat een kopregel, gebruikt lege velden voor NULL en plaatst een apostrof voor tekst die op een formule lijkt.

## Ondersteunde SQLite-bestanden

Open een niet-versleuteld `.db`-, `.sqlite`- of `.sqlite3`-bestand van maximaal 50 MiB. Maak bij een database die WAL gebruikt eerst een kopie waarop een checkpoint is uitgevoerd; bijbehorende WAL- en journalbestanden worden niet geladen. Aangepaste SQLite-extensies worden niet ondersteund. Bestanden en query's worden niet automatisch opgeslagen.

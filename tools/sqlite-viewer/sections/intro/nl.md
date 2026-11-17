## SQLite-bestanden lokaal bekijken

Open een SQLite 3-database om tabellen en views te verkennen, kolomdefinities, indexen, externe sleutels en CREATE-instructies te bekijken of een alleen-lezen SQL-query uit te voeren. Probeer de voorbeelddatabase om de werkruimte te verkennen zonder een bestand te kiezen. Bestanden en query's blijven in je browser en worden niet automatisch opgeslagen.

## Query's uitvoeren en resultaten exporteren

Selecteer een tabel om de rijen te bekijken. Bewerk de SQL en gebruik **Query uitvoeren** of **Ctrl/⌘ + Enter** om één SELECT-, WITH- of EXPLAIN-instructie uit te voeren. De resultaatlimiet begrenst het aantal geladen rijen; de paginering toont 50 rijen per pagina. Een query kan ook stoppen wanneer het resultaatbudget van 5 MiB is bereikt of na 10 seconden. Annuleren houdt de interface responsief en laadt de databasemomentopname opnieuw bij de volgende query.

CSV- en JSON-exports bevatten het geladen resultaat, inclusief rijen op andere pagina's. JSON slaat kolomnamen en rijarrays afzonderlijk op, waardoor dubbele namen en NULL-waarden behouden blijven. SQLite-gehele getallen worden exacte decimale tekenreeksen en BLOB's worden objecten met een hexadecimale `$blob`-waarde. CSV gebruikt lege velden voor NULL, plaatst speciale tekens tussen aanhalingstekens en zet een apostrof voor tekst die op een formule lijkt, voor veiliger gebruik in spreadsheets.

## Ondersteunde databases en limieten

Open een niet-versleuteld `.db`-, `.sqlite`- of `.sqlite3`-bestand van maximaal 50 MiB. Het oorspronkelijke bestand wordt nooit gewijzigd. Deze tool laadt een momentopname in het geheugen, waardoor het geheugengebruik groter kan zijn dan de bestandsgrootte. Bijbehorende WAL- en journalbestanden worden niet geïmporteerd; maak eerst met je database-applicatie een schone kopie waarop een checkpoint is uitgevoerd voordat je die hier opent. Versleutelde databases, aangepaste SQLite-extensies en databasebewerking worden niet ondersteund.

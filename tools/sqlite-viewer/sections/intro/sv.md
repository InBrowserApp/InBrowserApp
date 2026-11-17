## Utforska SQLite-databaser i webbläsaren

Öppna en SQLite 3-databas för att bläddra bland tabeller och vyer, granska kolumner, index, främmande nycklar och CREATE-satser eller köra en skrivskyddad SQL-fråga. Prova exempeldatabasen för att utforska arbetsytan. Din fil behandlas lokalt och ändras aldrig.

## Kör frågor och exportera resultat

Välj en tabell eller vy för att läsa in raderna och redigera sedan SQL-koden för att filtrera, sortera eller kombinera data. Kör en SELECT-, WITH- eller EXPLAIN-sats med **Kör fråga** eller **Ctrl/⌘ + Enter**. Klicka på en cell för att granska och kopiera hela värdet.

Välj en resultatgräns på 100, 1 000 eller 10 000 rader och bläddra i resultatet 50 rader åt gången. Frågor har en tidsgräns på 10 sekunder och en resultatstorleksgräns på 5 MiB. CSV- och JSON-exporter innehåller alla inlästa rader från samtliga sidor.

JSON använder separata kolumnnamn och radmatriser för att bevara dubbla namn och NULL-värden. Heltal är exakta decimalsträngar och BLOB-värden innehåller ett hexadecimalt `$blob`-värde. CSV innehåller en rubrikrad, använder tomma fält för NULL och lägger till en apostrof före text som liknar en formel.

## SQLite-filer som stöds

Öppna en okrypterad `.db`-, `.sqlite`- eller `.sqlite3`-fil på högst 50 MiB. För en databas som använder WAL ska du skapa en kopia där en kontrollpunkt har skapats innan du öppnar den; separata WAL- och journalfiler läses inte in. Egna SQLite-tillägg stöds inte. Filer och frågor sparas inte automatiskt.

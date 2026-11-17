## Granska SQLite-filer lokalt

Öppna en SQLite 3-databas för att bläddra bland tabeller och vyer, granska kolumndefinitioner, index, främmande nycklar och CREATE-satser eller köra en skrivskyddad SQL-fråga. Prova exempeldatabasen för att utforska arbetsytan utan att välja en fil. Filer och frågor stannar i webbläsaren och sparas inte automatiskt.

## Kör frågor och exportera resultat

Välj en tabell för att förhandsvisa raderna. Redigera SQL-koden och använd **Kör fråga** eller **Ctrl/⌘ + Enter** för att köra en SELECT-, WITH- eller EXPLAIN-sats. Resultatgränsen begränsar antalet inlästa rader; sidindelningen visar 50 rader åt gången. En fråga kan också stoppas när resultatgränsen på 5 MiB nås eller efter 10 sekunder. Om du avbryter förblir gränssnittet responsivt och databasens ögonblicksbild läses in igen vid nästa fråga.

CSV- och JSON-exporter innehåller det inlästa resultatet, inklusive rader på andra sidor. JSON lagrar kolumnnamn och radmatriser separat, vilket bevarar dubbla namn och NULL-värden. SQLite-heltal blir exakta decimalsträngar och BLOB-värden blir objekt med ett hexadecimalt `$blob`-värde. CSV använder tomma fält för NULL, omsluter specialtecken med citattecken och lägger till en apostrof före text som liknar en formel för säkrare användning i kalkylblad.

## Databaser som stöds och begränsningar

Öppna en okrypterad `.db`-, `.sqlite`- eller `.sqlite3`-fil på högst 50 MiB. Originalfilen ändras aldrig. Verktyget läser in en ögonblicksbild i minnet, så minnesanvändningen kan överstiga filstorleken. Separata WAL- och journalfiler importeras inte; skapa en ren kopia där en kontrollpunkt har skapats i ditt databasprogram innan du öppnar den här. Krypterade databaser, egna SQLite-tillägg och databasredigering stöds inte.

## Konvertera miljökonfiguration

Klistra in en `.env`-fil och välj JSON eller YAML, eller konvertera ett platt JSON/YAML-objekt tillbaka till `.env`. Importera lokala filer, byt plats på indata och utdata och kopiera eller ladda ner resultatet. Allt körs i din webbläsare; konfigurationen laddas aldrig upp och sparas inte i webbläsarhistoriken eller den lokala lagringen.

### Värden och citattecken

Miljövariabler är strängar: `PORT=3000`, `DEBUG=false` och `CODE=0012` förblir `"3000"`, `"false"` och `"0012"`. Tal och booleska värden i JSON/YAML konverteras till strängar. Null, arrayer och nästlade objekt kräver ett uttryckligt strängvärde. Sätt YAML-värden som `0012` inom citattecken när deras exakta skrivsätt är viktigt.

Parsern stöder tomma rader, kommentarer med `#`, ett `export`-prefix samt enkla, dubbla eller bakåtriktade citattecken med värden på flera rader. Endast sekvenserna `\n` och `\r` inom dubbla citattecken expanderas. Övriga citattecken och omvända snedstreck behålls bokstavligt, enligt vanligt dotenv-beteende. Nycklar använder bokstäver, siffror och understreck och får inte börja med en siffra. Utdata väljer en typ av citattecken som bevarar värdet.

### Konfigurationskontroller

Duplicerade `.env`-nycklar visar sina radnummer; den sista definitionen används. Saknade avslutande citattecken, text efter avslutande citattecken och ogiltiga tilldelningar visar fel med länkar till den berörda raden. Typografiska citattecken ger en varning. Duplicerade nycklar i JSON/YAML är fel.

Kommentarer, ursprunglig typ av citattecken och formatering bevaras inte. Referenser som `${NAME}` och skalkommandon behålls som bokstavlig text och körs aldrig. Olika `.env`-laddare har olika regler; det här verktyget följer den dokumenterade delmängden i stället för att tolka skalskript.

Se [Node.js-specifikationen för .env](https://nodejs.org/api/environment_variables.html#dotenv) och [dotenvs tolkningsregler](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).

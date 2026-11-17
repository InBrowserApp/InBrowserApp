## Omgevingsconfiguratie converteren

Plak een `.env`-bestand en kies JSON of YAML, of converteer een vlak JSON/YAML-object terug naar `.env`. Importeer lokale bestanden, wissel de invoer en uitvoer om en kopieer of download het resultaat. Alles werkt in je browser; de configuratie wordt nooit geüpload of opgeslagen in je browsergeschiedenis of lokale opslag.

### Waarden en aanhalingstekens

Omgevingsvariabelen zijn strings: `PORT=3000`, `DEBUG=false` en `CODE=0012` blijven `"3000"`, `"false"` en `"0012"`. Getallen en booleans in JSON/YAML worden naar strings geconverteerd. Null, arrays en geneste objecten hebben een expliciete stringwaarde nodig. Zet YAML-waarden zoals `0012` tussen aanhalingstekens wanneer hun exacte schrijfwijze van belang is.

De parser ondersteunt lege regels, `#`-opmerkingen, een `export`-voorvoegsel en enkele, dubbele of backtick-aanhalingstekens met waarden over meerdere regels. Alleen de reeksen `\n` en `\r` tussen dubbele aanhalingstekens worden omgezet. Aanhalingstekens en backslashes blijven verder letterlijk behouden, volgens gangbaar dotenv-gedrag. Sleutels gebruiken letters, cijfers en underscores en mogen niet met een cijfer beginnen. De uitvoer kiest een soort aanhalingsteken dat de waarde behoudt.

### Configuratiecontroles

Dubbele `.env`-sleutels tonen hun regelnummers; de laatste definitie wordt gebruikt. Ontbrekende afsluitende aanhalingstekens, tekst na afsluitende aanhalingstekens en ongeldige toewijzingen tonen fouten met links naar de betreffende regel. Gekrulde aanhalingstekens geven een waarschuwing. Dubbele sleutels in JSON/YAML zijn fouten.

Opmerkingen, de oorspronkelijke soort aanhalingstekens en opmaak blijven niet behouden. Verwijzingen zoals `${NAME}` en shellcommando's blijven letterlijk behouden en worden nooit uitgevoerd. Verschillende `.env`-laders hanteren verschillende regels; deze tool volgt de beschreven subset in plaats van shellscripts te interpreteren.

Zie de [Node.js-specificatie voor .env](https://nodejs.org/api/environment_variables.html#dotenv) en de [dotenv-parserregels](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).

## Konvertera en binär Plist-fil till JSON

Välj **Öppna binär Plist** eller släpp en binär `.plist`-fil från Apple. Granska formaterad JSON, kopiera den eller ladda ner den som en `.json`-fil. Binära egenskapslistor börjar med signaturen `bplist00` och förekommer i paket för Apple-appar, inställningar och arkiverade data. Exemplet visar hur värden från en egenskapslista återges i JSON.

## Konvertera JSON till Apples binära egenskapslista

Välj **JSON till Plist**, klistra in JSON eller öppna en `.json`-fil och välj sedan **Konvertera till binär Plist**. Ladda ner den färdiga `.plist`-filen. Strängar, booleska värden, tal, arrayer och objekt motsvarar respektive typ i egenskapslistan. Ersätt `null` med ett värde eller utelämna nyckeln. Filer och inklistrad text bearbetas i webbläsaren.

## Bevara datum, byte och stora heltal

JSON har inga egna typer för datum, bytedata eller UID i nyckelbaserade arkiv. Omvandlaren använder uttryckliga `$plist`-markörer för att bevara betydelsen hos värdena vid konvertering åt båda hållen.

| Plist-värde                   | JSON-exempel                                           |
| ----------------------------- | ------------------------------------------------------ |
| Datum i UTC                   | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Byte i Base64                 | `{"$plist":"data","value":"AQID"}`                     |
| Stort heltal som decimal text | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID i nyckelbaserat arkiv     | `{"$plist":"uid","value":42}`                          |

Behåll markörerna när du konverterar tillbaka till Plist. Skriv värden utanför JSON:s säkra heltalsintervall som decimaltal inom citattecken och använd heltalsmarkören. En uppsättning nyckel–värde-par som har samma struktur som en markör omsluts av en `dictionary`-markör för att bevara nycklarna. Omvandlingen bevarar strukturen och de värden som stöds. Ordningen på Plist-objekten, lagringsbredden för tal och de ursprungliga binära byten kan ändras.

[Struktur och typer i Apples egenskapslistor](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)

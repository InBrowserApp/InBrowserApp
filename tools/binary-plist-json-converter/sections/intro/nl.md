## Een binair Plist-bestand naar JSON omzetten

Kies **Binaire Plist openen** of sleep een binair `.plist`-bestand van Apple hierheen. Controleer de opgemaakte JSON, kopieer de tekst of download een `.json`-bestand. Binaire eigenschappenlijsten beginnen met de bestandssignatuur `bplist00`. Je vindt ze in appbundels van Apple, voorkeuren en gearchiveerde gegevens. Het voorbeeld laat zien hoe waarden uit een eigenschappenlijst in JSON worden weergegeven.

## JSON omzetten naar een binaire eigenschappenlijst van Apple

Kies **JSON naar Plist**, plak JSON of open een `.json`-bestand en kies daarna **Converteren naar binaire Plist**. Download het gemaakte `.plist`-bestand. Tekenreeksen, booleaanse waarden, getallen, arrays en objecten worden omgezet naar de bijbehorende typen van de eigenschappenlijst. Vervang `null` door een waarde of laat de bijbehorende sleutel weg. Je browser verwerkt de bestanden en geplakte tekst.

## Datums, bytes en grote gehele getallen behouden

JSON heeft geen eigen typen voor datums, binaire gegevens of UID’s uit archieven met sleutels. De converter gebruikt expliciete `$plist`-tags om de betekenis van deze waarden bij conversie in beide richtingen te behouden.

| Plist-waarde                          | JSON-voorbeeld                                         |
| ------------------------------------- | ------------------------------------------------------ |
| Datum in UTC                          | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bytes als Base64                      | `{"$plist":"data","value":"AQID"}`                     |
| Groot geheel getal als decimale tekst | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID uit een archief met sleutels      | `{"$plist":"uid","value":42}`                          |

Behoud de tags bij het terugzetten naar Plist. Gebruik voor gehele getallen buiten het veilige bereik van JSON de tag voor gehele getallen en zet de decimale waarde tussen aanhalingstekens. Heeft een dictionary dezelfde structuur als een tag, dan plaatst de converter die dictionary in een `dictionary`-tag om de sleutels te behouden. De structuur en ondersteunde waarden blijven bij conversie behouden. De volgorde van Plist-objecten, de opslagbreedte van getallen en de oorspronkelijke bytes kunnen wijzigen.

[Structuur en typen van Apple-eigenschappenlijsten](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)

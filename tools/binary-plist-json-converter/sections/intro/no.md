## Konverter en binær Plist-fil til JSON

Velg **Åpne binær Plist**, eller slipp en binær `.plist`-fil fra Apple. Se gjennom formatert JSON, kopier den, eller last den ned som en `.json`-fil. Binære egenskapslister begynner med signaturen `bplist00` og brukes i Apple-apppakker, innstillinger og arkiverte data. Eksemplet viser hvordan verdier fra egenskapslisten vises i JSON.

## Konverter JSON til en binær egenskapsliste fra Apple

Velg **JSON til Plist**, lim inn JSON eller åpne en `.json`-fil, og velg **Konverter til binær Plist**. Last ned den ferdige `.plist`-filen. Strenger, boolske verdier, tall, matriser og objekter konverteres til de tilsvarende typene i egenskapslisten. Erstatt `null` med en verdi, eller utelat nøkkelen. Filer og tekst du limer inn, behandles i nettleseren.

## Behold datoer, byte og store heltall

JSON har ingen egne typer for datoer, bytedata eller UID-er i nøkkelbaserte arkiver. Omformeren bruker eksplisitte `$plist`-merker, slik at disse verdiene beholder betydningen sin under konvertering begge veier.

| Plist-verdi                    | JSON-eksempel                                          |
| ------------------------------ | ------------------------------------------------------ |
| Dato i UTC                     | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Byte som Base64                | `{"$plist":"data","value":"AQID"}`                     |
| Stort heltall som desimaltekst | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID i nøkkelbasert arkiv       | `{"$plist":"uid","value":42}`                          |

Behold merkene når du konverterer tilbake til Plist. For tall utenfor JSONs sikre heltallsområde bruker du et heltallsmerke med en desimalverdi i anførselstegn. En ordbok med samme struktur som et merke pakkes inn i et `dictionary`-merke for å bevare nøklene. Konverteringen bevarer strukturen og støttede verdier. Rekkefølgen på objektene, antall byte som brukes til å lagre tall, og de opprinnelige binære bytene kan endres.

[Struktur og typer i Apples egenskapslister](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)

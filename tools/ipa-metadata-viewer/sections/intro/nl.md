## Een IPA openen en de metagegevens van de hoofdapp lezen

Sleep een `.ipa`-bestand van iOS hierheen of kies **IPA-bestand openen**. De viewer leest de eigenschappenlijst van de hoofdapp op een pad zoals `Payload/Trail Notes.app/Info.plist`. Open de voorbeeld-IPA om de velden te bekijken voordat je je eigen bestand opent. Je browser pakt het archief uit en leest de eigenschappenlijst.

## Bundel-ID’s, versies en platforms begrijpen

De bundel-ID staat in `CFBundleIdentifier` en identificeert de appbundel. `CFBundleShortVersionString` geeft de uitgebrachte versie aan en `CFBundleVersion` identificeert de build. Met `MinimumOSVersion` en `CFBundleSupportedPlatforms` controleer je de minimale systeemversie en de platformnamen die in het pakket zijn vastgelegd. De weergavenaam komt uit `CFBundleDisplayName` of `CFBundleName`.

## Info.plist bekijken en exporteren

Kies **Info.plist** om de volledige eigenschappenlijst als leesbare XML te bekijken, inclusief sleutels die niet in het overzicht staan. De viewer kan binaire eigenschappenlijsten en XML lezen. Kies **XML kopiëren** om de leesbare versie in een andere tool te gebruiken of **Info.plist downloaden** om het oorspronkelijke bestand ongewijzigd op te slaan. Het getoonde archiefpad geeft aan uit welke appbundel de metagegevens komen.

[Apple-documentatie over Information Property Lists](https://developer.apple.com/documentation/bundleresources/information-property-list)

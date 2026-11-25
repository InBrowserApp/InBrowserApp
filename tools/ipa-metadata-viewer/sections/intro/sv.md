## Öppna en IPA-fil och läs huvudappens metadata

Släpp en `.ipa`-fil för iOS eller välj **Öppna IPA-fil**. Visaren läser huvudappens egenskapslista från en sökväg som `Payload/Trail Notes.app/Info.plist`. Prova IPA-exempelfilen för att se fälten innan du öppnar din egen fil. Arkivet packas upp och egenskapslistan läses i webbläsaren.

## Förstå paketidentifierare, versioner och plattformar

Paketidentifieraren i `CFBundleIdentifier` identifierar appens paket. Versionen i `CFBundleShortVersionString` är versionsnumret för utgåvan, och `CFBundleVersion` identifierar bygget. I `MinimumOSVersion` och `CFBundleSupportedPlatforms` kan du se den lägsta systemversionen och namnen på de plattformar som anges i paketet. Visningsnamnet hämtas från `CFBundleDisplayName` eller `CFBundleName`.

## Granska och exportera Info.plist

Välj **Info.plist** för att se hela egenskapslistan som läsbar XML, inklusive nycklar som inte visas i översikten. Visaren kan läsa både binära egenskapslistor och egenskapslistor i XML-format. Välj **Kopiera XML** för att använda den läsbara versionen i ett annat verktyg, eller **Ladda ner Info.plist** för att spara filen med dess ursprungliga innehåll. Sökvägen i arkivet visar från vilket paket appens metadata hämtades.

[Apples referens för Info.plist](https://developer.apple.com/documentation/bundleresources/information-property-list)

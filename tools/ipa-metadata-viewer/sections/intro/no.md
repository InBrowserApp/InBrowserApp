## Åpne en IPA-fil og les hovedappens metadata

Slipp en iOS-fil med endelsen `.ipa`, eller velg **Åpne IPA-fil**. Viseren leser hovedappens egenskapsliste fra en bane som `Payload/Trail Notes.app/Info.plist`. Prøv IPA-eksempelfilen hvis du vil se feltene før du åpner din egen fil. Arkivet pakkes ut og egenskapslisten leses i nettleseren.

## Forstå pakke-ID, versjoner og plattformer

Pakke-ID-en i `CFBundleIdentifier` identifiserer apppakken. Versjonen i `CFBundleShortVersionString` er utgivelsesversjonen, og `CFBundleVersion` identifiserer bygget. I `MinimumOSVersion` og `CFBundleSupportedPlatforms` finner du den minste systemversjonen og navnene på plattformene som er oppgitt i pakken. Det viste appnavnet kommer fra `CFBundleDisplayName` eller `CFBundleName`.

## Undersøk og eksporter Info.plist

Velg **Info.plist** for å se hele egenskapslisten som lesbar XML, inkludert nøkler som ikke vises i oversikten. Viseren kan lese både binære egenskapslister og egenskapslister i XML-format. Velg **Kopier XML** for å bruke den lesbare versjonen i et annet verktøy, eller **Last ned Info.plist** for å lagre de opprinnelige bytene. Banen i arkivet viser hvilken apppakke metadataene kommer fra.

[Apples referanse for Info.plist](https://developer.apple.com/documentation/bundleresources/information-property-list)

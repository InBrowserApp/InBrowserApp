## Een APK openen en het manifest lezen

Sleep een `.apk`-bestand van Android hierheen of kies **APK of manifest openen**. De viewer opent het meegeleverde `AndroidManifest.xml`-bestand, ook in de gecompileerde binaire XML-vorm die de meeste APK’s gebruiken. Je kunt ook een eerder uitgepakt manifest openen, in binaire vorm of als tekst. Open de voorbeeld-APK om het overzicht en de gedecodeerde XML te bekijken. Je bestanden blijven in je browser.

## De velden voor pakket, versie en SDK begrijpen

De **Pakketnaam** identificeert de Android-app. De versienaam is de aanduiding die gebruikers te zien krijgen. De versiecode is het nummer waarmee Android de volgorde van updates bepaalt. De minimale SDK geeft het oudste in het manifest opgegeven Android-API-niveau aan. De doel-SDK is het API-niveau waarop de app zich richt. Velden die in het manifest ontbreken, worden als niet opgegeven weergegeven.

## Machtigingen bekijken en AndroidManifest.xml exporteren

Het overzicht toont de namen van de machtigingen die het pakket opgeeft. Android bepaalt op het apparaat welke machtigingen worden verleend op basis van de systeemversie, appinstellingen en gebruikerskeuzes. Open **Manifest-XML** om componenten, intentfilters en voorwaardelijke machtigingsdeclaraties te bekijken. Gebruik **XML kopiëren** of **XML downloaden** om het gedecodeerde bestand te bewaren. Verwijzingen naar gecompileerde bronnen kunnen als ID’s verschijnen, bijvoorbeeld `@0x7f010001`.

[Structuur en elementen van het Android-manifest](https://developer.android.com/guide/topics/manifest/manifest-intro)

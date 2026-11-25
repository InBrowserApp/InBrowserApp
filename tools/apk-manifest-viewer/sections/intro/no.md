## Åpne en APK og les manifestet

Slipp en Android-fil med endelsen `.apk`, eller velg **Åpne APK eller manifest**. Viseren åpner pakkens `AndroidManifest.xml`, også kompilert binær XML som finnes i de fleste APK-filer. Du kan også åpne et manifest du allerede har pakket ut, enten det er binært eller i tekstformat. Prøv en eksempel-APK for å se oversikten og den dekodede XML-en. Filene blir i nettleseren din.

## Forstå feltene for pakke, versjon og SDK

**Pakkenavn** identifiserer Android-appen. Versjonsnavnet vises til brukerne, mens versjonskoden er tallet Android bruker til å avgjøre rekkefølgen på oppdateringer. Minste SDK-nivå er det laveste Android-API-nivået manifestet oppgir. Mål-SDK angir API-nivået appen er laget for. Felter som er utelatt fra manifestet, vises som ikke angitt.

## Undersøk tillatelser og eksporter AndroidManifest.xml

Oversikten viser navnene på tillatelsene pakken deklarerer. Android avgjør hvilke tillatelser som tildeles på enheten, basert på operativsystemversjonen, appinnstillingene og brukerens valg. Åpne **Manifest-XML** for å lese komponenter, intent-filtre og betingede tillatelsesdeklarasjoner. Bruk **Kopier XML** eller **Last ned XML** for å ta vare på den dekodede filen. Referanser til kompilerte ressurser kan vises som ID-er, for eksempel `@0x7f010001`.

[Strukturen og elementene i Android-manifestet](https://developer.android.com/guide/topics/manifest/manifest-intro)

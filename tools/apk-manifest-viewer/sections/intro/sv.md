## Öppna en APK och läs dess manifest

Släpp en Android-fil med ändelsen `.apk` eller välj **Öppna APK eller manifest**. Visaren öppnar paketets `AndroidManifest.xml` och kan läsa kompilerad binär XML, som finns i de flesta APK-filer. Du kan också öppna ett redan extraherat manifest i binär- eller textformat. Prova en exempel-APK för att se översikten och den avkodade XML-koden. Filerna stannar i webbläsaren.

## Förstå fälten för paket, version och SDK

**Paketnamn** identifierar Android-appen. Versionsnamnet är det versionsnummer eller den etikett som visas för användaren. Versionskoden är talet som Android använder för att ordna uppdateringar. Lägsta SDK-nivå är den lägsta Android-API-nivå som manifestet anger. Mål-SDK anger den API-nivå som appen riktar sig till. Fält som saknas i manifestet visas som inte angivna.

## Granska behörigheter och exportera AndroidManifest.xml

Översikten listar behörigheterna som paketet deklarerar. Android avgör vilka behörigheter som faktiskt beviljas på enheten utifrån operativsystemets version, appinställningarna och användarens val. Öppna **Manifest-XML** för att granska komponenter, intent-filter och villkorade behörighetsdeklarationer. Välj **Kopiera XML** eller **Ladda ner XML** för att spara den avkodade filen. Referenser till kompilerade resurser kan visas som ID:n, till exempel `@0x7f010001`.

[Android-manifestets struktur och element](https://developer.android.com/guide/topics/manifest/manifest-intro)

## Eine APK öffnen und ihr Manifest lesen

Ziehe eine Android-`.apk`-Datei hierher oder wähle **APK oder Manifest öffnen**. Der Betrachter öffnet die `AndroidManifest.xml` aus der APK, auch wenn sie im üblichen kompilierten binären XML vorliegt. Du kannst auch ein zuvor extrahiertes Manifest als Binär- oder Textdatei öffnen. Mit der Beispiel-APK kannst du die Übersicht und das dekodierte XML erkunden. Deine Dateien bleiben in deinem Browser.

## Paketname, Version und SDK-Angaben verstehen

Der **Paketname** identifiziert die Android-App. Der Versionsname ist die Versionsbezeichnung, die Nutzern angezeigt wird. Android verwendet den numerischen Versionscode, um die Reihenfolge von Updates zu bestimmen. Das Mindest-SDK gibt die niedrigste im Manifest deklarierte Android-API-Ebene an. Das Ziel-SDK bezeichnet die API-Ebene, auf die die App ausgerichtet ist. Felder, die im Manifest fehlen, werden als nicht angegeben angezeigt.

## Berechtigungen prüfen und AndroidManifest.xml exportieren

Die Übersicht listet die Namen der Berechtigungen auf, die das Paket deklariert. Welche Berechtigungen das Gerät tatsächlich erteilt, hängt von der Android-Version, den App-Einstellungen und den Entscheidungen der Nutzer ab. Öffne **Manifest-XML**, um Komponenten, Intent-Filter und bedingte Berechtigungsdeklarationen zu lesen. Mit **XML kopieren** oder **XML herunterladen** kannst du die dekodierte Datei behalten. Verweise auf kompilierte Ressourcen können als IDs wie `@0x7f010001` erscheinen.

[Struktur und Elemente des Android-Manifests](https://developer.android.com/guide/topics/manifest/manifest-intro)

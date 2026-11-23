## Animiertes WebP in GIF umwandeln

Animiertes WebP speichert mehrere Einzelbilder in einer `.webp`-Datei. Wandle
die Datei in ein GIF um, wenn eine Chat-App, eine Dokumentationsseite oder
eine andere Zielanwendung Animationen im GIF-Format erwartet. Der Konverter
verarbeitet verlustbehaftet und verlustfrei komprimierte WebP-Animationen
direkt auf deinem Gerät.

### So wandelst du animiertes WebP in GIF um

1. Wähle **Datei auswählen** oder ziehe ein animiertes WebP in das Tool.
2. Wähle **GIF erstellen**, um die Einzelbilder in Originalgröße umzuwandeln.
3. Prüfe das GIF mit **Abspielen** und speichere es mit **GIF herunterladen**.

### Was passiert mit der Einzelbilddauer und den Wiederholungen?

Die Anzeigedauer jedes Einzelbilds wird auf die 10-ms-Schritte des GIF-Formats
gerundet und beträgt mindestens 20 ms. Folgen auf ein Einzelbild mit 100 ms
weitere 250 ms, bleiben beide Anzeigedauern erhalten. Die in der WebP-Datei
festgelegte Anzahl der Wiedergaben bleibt erhalten. Läuft das WebP in einer
Endlosschleife, tut das auch das GIF.

### Wie verarbeitet GIF Transparenz und Farben?

GIF verwendet eine indizierte Palette mit bis zu 256 Einträgen pro Einzelbild
und einem transparenten Eintrag. WebP kann Teiltransparenz speichern. Deshalb
können halbtransparente Schatten und geglättete Kanten im GIF anders aussehen.
Bei farbreichen Einzelbildern können in Farbverläufen sichtbare Stufen
auftreten. Prüfe die Vorschau auf dem Hintergrund, den du verwenden möchtest.

### Häufig gestellte Fragen

#### Kann ich ein statisches WebP umwandeln?

Das Tool benötigt Einzelbilder einer Animation. Sowohl statische als auch
animierte Bilder verwenden die Endung `.webp`. Wenn du mehrere Standbilder
animieren möchtest, nutze den [GIF-Ersteller](/de/tools/gif-maker/).

#### Warum ist das GIF größer als die WebP-Datei?

WebP komprimiert Farben und sich ändernde Bildbereiche effizient. Ein GIF kann
bei gleichen Abmessungen und Anzeigedauern größer sein. Falls das Ziel eine
Größenbegrenzung für Uploads festlegt, prüfe die Ausgabegröße neben der Vorschau.

### Weitere Animationstools

Verwende [GIF in animiertes WebP umwandeln](/de/tools/gif-to-animated-webp-converter/)
für die umgekehrte Konvertierung oder
[APNG in GIF umwandeln](/de/tools/apng-to-gif-converter/) für animierte PNG-Dateien.

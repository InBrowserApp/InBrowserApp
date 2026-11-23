## Animiertes PNG in GIF umwandeln

APNG speichert mehrere Einzelbilder in einer PNG-Datei. Wandle sie in ein GIF
um, wenn eine Chat-App, ein Forum oder eine Dokumentation Animationen im
GIF-Format erwartet. Animierte Dateien können auf `.apng` oder `.png` enden.
Der Konverter liest die Animation aus der Datei und verarbeitet sie auf deinem
Gerät.

### So wandelst du APNG in GIF um

1. Wähle **Datei auswählen** oder ziehe ein animiertes PNG in das Tool.
2. Wähle **GIF erstellen**, um die Einzelbilder in Originalgröße umzuwandeln.
3. Prüfe das GIF mit **Abspielen** und speichere es mit **GIF herunterladen**.

### Was passiert mit der Einzelbilddauer und den Wiederholungen?

Die Anzeigedauer jedes Einzelbilds wird auf die 10-ms-Schritte des GIF-Formats
gerundet und beträgt mindestens 20 ms. Folgen auf ein Einzelbild mit 100 ms
weitere 250 ms, bleiben beide Anzeigedauern erhalten. Die Anzahl der
Wiedergaben aus der Quelldatei bleibt erhalten, ob die Animation einmal,
mehrmals oder in einer Endlosschleife läuft. Bei einer endlichen Animation
unterstützt GIF insgesamt höchstens 65.536 Wiedergaben.

### Wie verarbeitet GIF Transparenz und Farben?

APNG unterstützt Teiltransparenz und Einzelbilder mit voller Farbtiefe. GIF
verwendet eine indizierte Palette mit bis zu 256 Einträgen pro Einzelbild und
einem transparenten Eintrag. Weiche Kanten und Schatten können härter wirken,
und in Farbverläufen können sichtbare Stufen auftreten. Prüfe die GIF-Vorschau
vor dem Teilen. Wenn die Zielanwendung animierte PNGs unterstützt, bleiben in
der Quelldatei der volle Farbumfang und die Teiltransparenz erhalten.

### Häufig gestellte Fragen

#### Kann ich ein gewöhnliches PNG umwandeln?

Das Tool setzt eine PNG-Datei mit Animationsdaten voraus. Auch eine Datei mit
der Endung `.png` kann animiert sein. Enthält die Animation ein separates
Ersatzbild für statische PNG-Betrachter, beginnt das GIF mit dem ersten
Einzelbild der Animation.

#### Wird das GIF kleiner als die APNG-Datei?

Die Dateigröße hängt von den Bildabmessungen, der Anzahl der Einzelbilder und
den Bilddetails ab. Das GIF kann größer sein, insbesondere wenn das APNG nur
kleine Bereiche speichert, die sich zwischen den Einzelbildern ändern. Die
Ausgabegröße steht bei der GIF-Vorschau.

### Weitere Animationstools

Verwende [GIF in APNG umwandeln](/de/tools/gif-to-apng-converter/) für die
umgekehrte Konvertierung oder
[Animiertes WebP in GIF umwandeln](/de/tools/animated-webp-to-gif-converter/)
für animierte WebP-Dateien.

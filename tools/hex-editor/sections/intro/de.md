## Binärdateien online ansehen und bearbeiten

Öffne eine lokale Datei im Hex-Editor oder lege sie dort ab. Mit **Beispiel ausprobieren** kannst du den Aufbau der Byte-Ansicht erkunden. Prüfe damit einen Datei-Header oder eine Dateisignatur wie `89 50 4E 47` bei einer PNG-Datei, untersuche nicht druckbare Bytes oder ändere einen bekannten Wert an einer bestimmten Position.

## Offsets, Hexadezimalwerte und ASCII lesen

Der Offset links gibt die Position des ersten Bytes in der jeweiligen Zeile an, gezählt ab null. In der Mitte erscheint jedes Byte als zweistelliger Hexadezimalwert von `00` bis `FF`. Die ASCII-Spalte zeigt für dieselben Bytes die druckbaren Zeichen; andere Werte werden als Punkt dargestellt. So erscheinen die Bytes `48 65 6C 6C 6F` beispielsweise als `Hello`.

Gib einen hexadezimalen Offset wie `1A` oder `0x1A` ein, um direkt zum Byte an Position 26 zu springen. Mit den Seitensteuerungen kannst du benachbarte Bytes durchsehen. Der Editor liest jeweils eine Seite, sodass du auch einen kleinen Teil einer großen Datei untersuchen kannst.

## Bytes überschreiben und eine Kopie speichern

Wähle ein Hex-Byte aus und gib zwei Ziffern ein. Der Editor aktualisiert das entsprechende ASCII-Zeichen und springt zum nächsten Byte. Mit den Pfeiltasten wechselst du zwischen Bytes; mit **Rückgängig** oder **Wiederholen** kannst du Änderungen zurücknehmen oder erneut anwenden. Das Überschreiben verändert weder die Dateilänge noch die Positionen der anderen Bytes.

Wähle **Kopie herunterladen**, um das Ergebnis zu speichern. Die ursprüngliche Datei bleibt unverändert; das Lesen und Bearbeiten findet vollständig in deinem Browser statt.

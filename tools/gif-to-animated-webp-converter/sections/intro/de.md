Animiertes WebP kann die Bewegung eines GIFs erhalten und erzeugt für Websites,
Produktvorschauen, Dokumentation und Chat-geeignete Assets häufig kleinere
Dateien. Dieser Konverter läuft lokal und sendet das ursprüngliche GIF bei
beibehaltener Standardskalierung, -geschwindigkeit und
-Schleifeneinstellung vor dem Export von `.webp`-Dateien durch einen
verlustfreien `gif2webp`-Min-Size-Encoder.

## Wann du ihn verwendest

Nutze dieses Tool, wenn du animierte GIFs hast, die ein moderneres Webformat
brauchen, besonders für Seiten, bei denen Dateigröße und Ladegeschwindigkeit
wichtig sind. Animiertes WebP wird von aktuellen großen Browsern unterstützt
und kann Transparenz, Wiedergabezeiten und Schleifenverhalten beibehalten.

## Konvertierungsoptionen

Skalierung ändert jedes Einzelbild vor dem Codieren, was nützlich ist, wenn ein
GIF größer ist als der Bereich, in dem es angezeigt wird. Geschwindigkeit
ändert die Wiedergabezeiten, ohne Einzelbilder zu verwerfen. Das
Schleifenverhalten kann dem Quell-GIF folgen, endlose Wiedergabe erzwingen oder
eine benutzerdefinierte Anzahl für Dateien verwenden, die nach einer bestimmten
Anzahl von Wiedergaben stoppen sollen. Wenn Skalierung bei 100%,
Geschwindigkeit bei 1x und das Schleifenverhalten auf GIF folgen eingestellt
bleiben, wird der standardmäßige verlustfreie Min-Size-Pfad verwendet.

## Datenschutz und Einschränkungen

Die Konvertierung läuft in deinem Browser. Verlustfreies WebP komprimiert
GIF-artige Animationen normalerweise besser, kann aber nicht garantieren, dass
jede Ausgabe kleiner wird; sehr kleine oder bereits optimierte GIFs können
größer werden, weil der WebP-Container weiterhin Overhead hat. Änderungen an
Skalierung, Geschwindigkeit oder Schleifenverhalten erfordern das Decodieren
der Einzelbilder und können bei sehr großen GIFs viel Speicher verwenden. Wenn
das Quell-GIF keine Schleifenmetadaten enthält, wird die Standardausgabe einmal
abgespielt, sofern du nicht endloses oder benutzerdefiniertes Schleifen
auswählst.

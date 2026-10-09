## Comics im Browser lesen

Öffne ein lokales `.cbz`-Comicarchiv oder ziehe es in den Lesebereich. Beginne beim ersten lesbaren Bild, blättere, springe zu einer Seitenzahl oder durchsuche die einklappbare Vorschauleiste. Der Fokusmodus gibt den Zeichnungen mehr Platz. „Ganze Seite“ zeigt das vollständige Bild einschließlich breiter Doppelseiten; „Seitenbreite“ und Zoom helfen beim Betrachten von Schrift und hochauflösenden Zeichnungen.

## Seitenfolge und Leserichtung

Seiten werden nach ihren vollständigen Ordner- und Dateipfaden natürlich sortiert: `chapter2/page2.jpg` kommt vor `chapter2/page10.jpg`, danach folgt `chapter10/page1.jpg`. Die Sortierung nutzt einen festen englischen Vergleich mit numerischer Sortierung; bei Gleichstand entscheiden der exakte Pfad und die Position im Archiv. Versteckte Dateien, `__MACOSX`-Ordner und nicht relevante Metadaten werden ignoriert. ComicInfo und andere Metadaten überschreiben diese Reihenfolge nie. Unlesbare Bilder behalten ihre Seitenzahlen, damit fehlende Zeichnungen das Buch nicht unbemerkt verkürzen.

Wähle unabhängig von der Sprache der Website die Leserichtung von links nach rechts oder von rechts nach links. Fokussiere den Lesebereich, um mit den Pfeiltasten links und rechts in dieser Richtung zu blättern. Bild ab und Bild auf blättern immer vor und zurück; Pos1 und Ende springen zur ersten und letzten Seite. Die Schaltflächen „Vorige Seite“ und „Nächste Seite“ meinen immer die vorherige bzw. nächste nummerierte Seite.

## Unterstützte Bilder und Kompatibilität

JPEG-, PNG-, GIF-, WebP- und BMP-Seiten werden unterstützt; AVIF hängt vom Decoder des Browsers ab. Animierte Formate verwenden die normale Bilddarstellung des Browsers. TIFF, HEIC, JPEG XL, PSD und andere nicht unterstützte Bilddateien bleiben als unlesbare Seiten sichtbar. SVG-Bilder werden bewusst nicht dargestellt. Dateien ohne erkannte Bilddateiendung werden ignoriert. CBR, RAR und andere Archivtypen werden nicht unterstützt.

Passwortgeschützte Einträge lassen sich nicht öffnen. Ein beschädigtes Bild verhindert das Lesen anderer Seiten nicht, solange das ZIP-Verzeichnis lesbar ist. Ein defektes ZIP-Verzeichnis kann verhindern, dass sich der gesamte Comic öffnet. Der Reader prüft die Bilddekodierung beim Öffnen von Seiten und Vorschauen. Daher können während des Lesens weitere Probleme auftreten.

## Datenschutz und Browserressourcen

Das Archiv wird lokal gelesen. Comic-Inhalte werden nicht hochgeladen, Skripte nicht ausgeführt und externe Dokumentressourcen nicht abgerufen. Beim Schließen oder Ersetzen des Comics werden seine Bild-URLs freigegeben. Weder der Comic noch die Leseposition werden automatisch gespeichert.

Es gibt keine vorgegebenen Grenzen für Dateigröße oder Seitenanzahl. Bilddaten werden bei Bedarf extrahiert, und die Vorschauleiste zeigt einen wechselnden Seitenausschnitt, damit auch lange Comics übersichtlich bleiben. Sehr große Archive oder Bilder können dennoch den Browserspeicher oder die Dekodierungsressourcen ausschöpfen. Schließe bei einem Ressourcenfehler andere Tabs oder nutze ein Gerät mit mehr Speicher.

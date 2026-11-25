## Eine 3MF-Datei in STL umwandeln

Wähle **Datei öffnen** oder ziehe eine `.3mf`-Datei in den Konverter. Er liest das Modell auf deinem Gerät und erzeugt eine binäre STL-Datei. Mit **Beispiel ausprobieren** öffnest du ein Druckmodell mit zwei farbigen Montagewinkeln. Wähle danach **STL herunterladen**, um das Ergebnis zu speichern.

## Abmessungen und Druckpositionen beibehalten

Der Konverter gibt die Netzkoordinaten in Millimetern aus. Die Teile behalten ihre Positionen zueinander auf der Druckplatte, auch wenn dasselbe Teil mehrfach platziert ist. Ein Teil, das in der 3MF-Datei einen Zoll breit ist, erstreckt sich in der STL-Datei über 25,4 Koordinateneinheiten. Wenn das Programm beim Import der STL-Datei nach einer Maßeinheit fragt, wähle Millimeter.

## Prüfen, was in der STL-Datei steckt

Die STL-Datei enthält die Oberflächendreiecke. Farben, Materialien und Druckeinstellungen bleiben in der ursprünglichen 3MF-Datei gespeichert. Öffne das Ergebnis im [STL-Betrachter](../stl-viewer/) oder prüfe die Quelldatei im [3MF-Betrachter](../3mf-viewer/). Nutze den [STL-zu-3MF-Konverter](../stl-to-3mf-converter/), wenn du für den nächsten Schritt ein 3MF-Modellpaket brauchst. [Über das 3MF-Format](https://3mf.io/resources/faq/)

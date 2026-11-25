## Eine STL-Datei in 3MF umwandeln

Wähle die **Einheit der STL-Koordinaten** und dann **Datei öffnen** oder ziehe eine `.stl`-Datei in den Konverter. Er unterstützt ASCII- und binäre STL-Dateien. Wähle **Beispiel ausprobieren**, um einen Montagewinkel zu konvertieren, und **3MF herunterladen**, um das Modell zu speichern. Wenn du die Einheit änderst, wird die aktuelle Datei erneut konvertiert.

## Die richtige Größe für den Slicer festlegen

STL speichert Koordinaten ohne Maßeinheit. Wähle die beim Erstellen der Datei verwendete Einheit. Ein Teil, das sich über 2 STL-Koordinateneinheiten erstreckt, ist zum Beispiel 2 Zoll breit, wenn du Zoll wählst, oder 2 Millimeter breit, wenn du Millimeter wählst. 3MF speichert die Einheit ausdrücklich, damit ein kompatibler Slicer das Modell in der vorgesehenen Größe einlesen kann.

## Das 3MF-Modell prüfen oder zurückkonvertieren

Die 3MF-Datei enthält die ursprünglichen Dreiecke. Der Konverter speichert ein Netz nur dann als Volumenkörper, wenn jede Schale geschlossen ist und ihre Flächen nach außen zeigen. Netze, die offen oder inkonsistent sind oder Schalen mit nach innen gerichteten Flächen enthalten, werden als Oberflächen gespeichert. Das gilt auch für die Wände eingeschlossener Hohlräume. Materialien und Druckeinstellungen legst du im Slicer fest. Prüfe die Abmessungen im [3MF-Betrachter](../3mf-viewer/) oder öffne das Original im [STL-Betrachter](../stl-viewer/). Bei Lücken oder anderen Topologieproblemen hilft dir [Netzvolumen und Topologie prüfen](../mesh-inspector/). Für die umgekehrte Richtung nutze den [3MF-zu-STL-Konverter](../3mf-to-stl-converter/). [Über das 3MF-Format](https://3mf.io/resources/faq/)

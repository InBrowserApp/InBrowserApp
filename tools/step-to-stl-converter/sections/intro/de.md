## Eine STEP- oder STP-Datei in STL umwandeln

Wähle **Datei öffnen** oder ziehe eine `.step`- oder `.stp`-Datei in den Konverter. Er zerlegt die CAD-Flächen auf deinem Gerät in Dreiecke und bereitet eine binäre STL-Datei zum Download vor. Mit **Beispiel ausprobieren** kannst du zuerst einen Montagewinkel konvertieren. Wähle anschließend **STL herunterladen**, um das Ergebnis zu speichern.

## Die richtige Größe für den 3D-Druck beibehalten

STEP enthält physikalische Abmessungen. Der Konverter exportiert die Koordinaten in Millimetern und berücksichtigt dabei die Position jedes Bauteils einer Baugruppe. STL speichert keine Maßeinheit. Wähle deshalb beim Öffnen im Slicer Millimeter. Eine Kante, die in STEP einen Zoll misst, ist in STL beispielsweise 25,4 Koordinateneinheiten lang.

## Das exportierte Dreiecksnetz prüfen

Die STL-Datei enthält die in Dreiecke zerlegten Oberflächen der Teile an ihren jeweiligen Positionen in der Baugruppe. Verwende STEP, wenn du bearbeitbare CAD-Flächen, Bauteilnamen und die Baugruppenstruktur benötigst. Öffne die STL-Datei im [STL-Betrachter](../stl-viewer/) oder prüfe ihr eingeschlossenes Volumen und die Topologie unter [Netzvolumen und Topologie prüfen](../mesh-inspector/).

## Das Originalmodell ansehen oder exportieren

Im [STEP-Betrachter](../step-viewer/) kannst du Abmessungen prüfen, das CAD-Modell drehen und es direkt aus der Symbolleiste als STL exportieren. Falls dein Slicer STEP importiert, kannst du das Original öffnen und die Einstellungen für das Dreiecksnetz dort wählen. [Von PrusaSlicer unterstützte Formate](https://help.prusa3d.com/article/supported-file-formats_1772)

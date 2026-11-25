## Eine DXF-Zeichnung in SVG umwandeln

Wähle **DXF-Datei öffnen** oder ziehe eine ASCII-Zeichnung mit der Endung `.dxf` in den Konverter. Mit **Beispiel ausprobieren** lädst du einen Montagewinkel mit Profil, Bohrungen, Mittellinien und Beschriftungen. Das Tool liest die Zeichnung in deinem Browser und zeigt eine Vektorvorschau. Wähle **SVG herunterladen**, um die ausgewählte Geometrie aus dem Modellbereich als eigenständige SVG-Datei zu speichern.

## Layer für den Export auswählen

Wähle unter **Layer** die gewünschten Layer aus. Die Vorschau aktualisiert sich, wenn du Layer hinzufügst oder ausschließt. Exportiere zum Beispiel nur die Kontur und die Bohrungen für eine Illustration oder nimm Mittellinien und Beschriftungen für eine beschriftete Ansicht hinzu. Die SVG-Datei speichert die ausgewählten Layer als separate Vektorgruppen.

## Den Zeichnungsmaßstab beibehalten

Gibt die DXF-Datei eine Längeneinheit wie Millimeter oder Zoll an, speichert die SVG-Datei die tatsächlichen Abmessungen in Millimetern. Die Zeichnungsgeometrie bleibt in der Datei im ursprünglichen Maßstab. Bei DXF-Dateien ohne Maßeinheit verwendet die SVG-viewBox die Zeichnungskoordinaten. Die Vorschau passt sich dem verfügbaren Platz auf dem Bildschirm an. [DXF-Header-Variablen](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Geometrie aus dem Modellbereich exportieren

Der Konverter exportiert unterstützte Linien, Polylinien, Bögen, Kreise, Blöcke und Texte. Kurven werden mit Vektorsegmenten dargestellt. Unterstützte Texte werden mit den verfügbaren Schriftarten in Vektorkonturen umgewandelt. Verschiebe bei Layouts die Geometrie vor dem DXF-Export in den Modellbereich. Im [DXF-Betrachter](../dxf-viewer/) kannst du die Ansicht verschieben, zoomen und Layer ein- oder ausblenden.

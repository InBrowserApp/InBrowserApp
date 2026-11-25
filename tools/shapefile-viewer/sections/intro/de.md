## Ein Shapefile öffnen

Ziehe eine ZIP-Datei mit deinem Esri-Shapefile in den Betrachter. Du kannst auch die .shp-Datei zusammen mit den zugehörigen Dateien auswählen. Enthält das ZIP mehrere Shapefiles, wechsle unter **Layer** zwischen ihnen. Wähle **Beispiel ausprobieren**, um einen Datensatz mit je einem Punkt- und einem Polygonlayer zu erkunden. Deine Dateien werden im Browser gelesen und bleiben auf diesem Gerät.

## Welche Dateien gehören zu einem Shapefile?

Die .shp-Datei enthält die Geometrien und genügt für die Vorschau eines Layers mit geografischen Koordinaten. Wähle die zugehörige .dbf-Datei für Attribute, die .prj-Datei für das Koordinatenreferenzsystem und, falls vorhanden, die .cpg-Datei für die Zeichenkodierung der Attribute mit aus. Die Dateien für denselben Layer gehören zusammen und tragen denselben Grundnamen. Die .shx-Indexdatei kann im ZIP oder in der Dateiauswahl bleiben.

## Die Karte und die Attribute erkunden

Die Offline-Karte passt sich an den aktuellen Layer an. Mit den Kartensteuerelementen kannst du hinein- oder herauszoomen und den Layer erneut einpassen. Wähle eine Geometrie auf der Karte oder in der Liste **Objekte**, um ihre Attribute zu sehen. Anhand einer unterstützten .prj-Datei kann der Betrachter projizierte Koordinaten für die Karte umrechnen. Ohne .prj-Datei interpretiert er Koordinaten im Wertebereich für Längen- und Breitengrade als WGS 84. Benötigt ein Layer eine Projektion, öffne ihn erneut mit seiner .prj-Datei, damit er an der richtigen Stelle erscheint.

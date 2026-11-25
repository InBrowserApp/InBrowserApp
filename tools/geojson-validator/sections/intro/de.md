## Eine GeoJSON-Datei prüfen

Öffne eine .geojson- oder .json-Datei oder füge ein GeoJSON-Dokument ein und wähle **GeoJSON prüfen**. Mit **Beispiel ausprobieren** lädst du eine gültige FeatureCollection. Du kannst die Eingabe bearbeiten und erneut prüfen. Dateien und eingefügter Text bleiben in deinem Browser.

## Was der Validator prüft

Das Werkzeug prüft zuerst die JSON-Syntax und dann die GeoJSON-Struktur. Dazu gehören FeatureCollection, Feature, GeometryCollection und die einzelnen Geometrietypen. Positionen verwenden WGS 84 mit dem Längengrad an erster und dem Breitengrad an zweiter Stelle. Der Validator prüft die Koordinatenbereiche, die Mindestanzahl an Positionen für Linien und Ringe, den Ringschluss, die Eigenschaften von Objekten und die Struktur der Begrenzungsrahmen. Leere FeatureCollections und Objekte mit null als Geometrie sind gültig.

## Einen Fehler finden und beheben

Ein Fehlerpfad wie `$.features[0].geometry.coordinates` verweist auf die Koordinaten des ersten Objekts. Korrigiere das angegebene Feld und prüfe das Dokument erneut. Das Ergebnis bezieht sich auf den Aufbau der Datei. Topologische Eigenschaften wie Selbstüberschneidungen und Überlappungen kannst du separat in einem GIS prüfen. Für eine Sichtprüfung öffnest du die gültige Datei im [GeoJSON-Betrachter](../geojson-viewer/).

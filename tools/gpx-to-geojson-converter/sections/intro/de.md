## GPX zu GeoJSON konvertieren

Öffne eine .gpx-Datei oder füge GPX-XML ein und wähle **Zu GeoJSON konvertieren**. Mit **Beispiel ausprobieren** siehst du im Ergebnis einen Track, eine Route und einen Wegpunkt. Kopiere das GeoJSON oder lade eine .geojson-Datei für dein Karten- oder GIS-Projekt herunter. Die Konvertierung läuft im Browser und die Daten bleiben auf deinem Gerät.

## Wie Tracks, Routen und Wegpunkte umgewandelt werden

Die Ausgabe ist eine GeoJSON-FeatureCollection. Wegpunkte werden zu Punkten und Routen zu Linien. Enthält ein Track mehrere durchgehende Abschnitte, bleiben diese getrennt. Ein Abschnitt oder eine Route mit nur einer Koordinate wird zu einem Punkt. Angaben wie Namen und Notizen bleiben als Eigenschaften der jeweiligen Objekte erhalten.

## Koordinaten, Höhe und Zeit

GeoJSON speichert Positionen mit dem Längengrad an erster und dem Breitengrad an zweiter Stelle. Linien, die den Antimeridian kreuzen, werden für die Darstellung auf Weltkarten bei 180° geteilt. Wenn eine Höhe vorliegt, wird sie als dritte Koordinate in Metern gespeichert. Zeitangaben zu Punkten stehen in den Objekteigenschaften. Entlang von Routen und Trackabschnitten behalten die Zeitangaben die Reihenfolge der Koordinaten bei, damit sie sich den Positionen zuordnen lassen. Du kannst die Ausgabe im [GeoJSON-Betrachter](../geojson-viewer/) öffnen oder die ursprünglichen GPX-Daten im [GPX-Betrachter mit Höhenprofil](../gpx-viewer/) erkunden.

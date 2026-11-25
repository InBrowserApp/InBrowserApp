## Zufällige Breiten- und Längengrade generieren

Wähle **Weltweit**, um Koordinaten auf dem gesamten Globus zu erzeugen, oder **Um einen Punkt**, um sie um einen Mittelpunkt zu generieren. Gib die Anzahl ein und wähle **Generieren**. Kopiere die Liste oder lade eine `UTF-8`-Textdatei mit einem Koordinatenpaar pro Zeile herunter. Die Koordinaten eignen sich etwa für Kartenmarkierungen, Tests von Standortfeldern oder Geodaten-Testdaten.

## Koordinaten um einen Punkt generieren

Gib den Breiten- und Längengrad des Mittelpunkts und anschließend den Radius in Kilometern ein. Gib zum Beispiel `37.774900` und `-122.419400` für einen Mittelpunkt in San Francisco ein und verwende einen Radius von `25` km für nahe gelegene Punkte. Der Breitengrad reicht von `-90` bis `90`, der Längengrad von `-180` bis `180`. Ein negativer Breitengrad liegt südlich des Äquators, ein negativer Längengrad westlich des Nullmeridians.

## Dezimalkoordinaten lesen

In jeder Zeile steht zuerst der Breitengrad und danach, durch ein Komma getrennt, der Längengrad. Ein Paar sieht so aus: `37.774900, -122.419400`. Die Ausgabe verwendet in jeder Seitensprache sechs Nachkommastellen und einen Dezimalpunkt. Behalte die Reihenfolge beim Einfügen in ein anderes Tool bei und prüfe dessen Feldbeschriftungen, falls es den Längengrad zuerst erwartet.

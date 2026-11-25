## Ein STL- oder OBJ-Netz online prüfen

Wähle **Datei öffnen** oder ziehe ein `.stl`- oder `.obj`-Modell in den Prüfbereich. Das Tool liest das Netz auf deinem Gerät und zeigt den Oberflächeninhalt, das eingeschlossene Volumen und Topologieprobleme an. Mit **Beispiel ausprobieren** kannst du zuerst einen geschlossenen Montagewinkel prüfen.

## Oberflächeninhalt und Volumen ablesen

STL und OBJ legen keine einheitliche physikalische Maßeinheit für die Koordinaten fest. Wähle unter **Einheit der Koordinaten** die Einheit aus, die du beim Export des Modells verwendet hast. Die Werte erscheinen in Quadrat- beziehungsweise Kubikeinheiten. Die Auswahl ändert die Beschriftung der gespeicherten Koordinaten, ihre Werte bleiben gleich. Der Beispielwinkel hat ein Volumen von 16.016 mm³, wenn seine Koordinaten in Millimetern angegeben sind.

Wenn das Netz die Topologieprüfungen besteht, berechnet das Tool das Volumen anhand der Ausrichtung der Flächen. Selbstüberschneidungen sowie falsch orientierte oder überlappende Schalen können die Schätzung weiterhin beeinflussen. Vergleiche wichtige Ergebnisse mit dem ursprünglichen Volumenmodell.

## Topologieergebnisse verstehen

- Eine **Randkante** gehört zu genau einem Dreieck. Randkanten markieren offene Ränder, etwa an Löchern.
- Eine **nicht mannigfaltige Kante** gehört zu mehr als zwei Dreiecken. An einem **nicht mannigfaltigen Eckpunkt** treffen getrennte Flächengruppen im selben Eckpunkt zusammen.
- Bei **uneinheitlicher Flächenorientierung** durchlaufen zwei Dreiecke ihre gemeinsame Kante in derselben Richtung. Korrekt ausgerichtete Nachbarflächen durchlaufen sie in entgegengesetzten Richtungen.
- **Degenerierte Flächen** haben einen Flächeninhalt von null. **Doppelte Flächen** wiederholen dasselbe Dreieck.

Genau übereinanderliegende Positionen zählen als ein Eckpunkt. Die Netzprüfung zählt Schalen anhand der Kanten, die sich ihre Dreiecke teilen. Bei Topologiefehlern zeigt sie weiterhin den Oberflächeninhalt und die Anzahl der gefundenen Probleme. An diesen Zahlen erkennst du, was du vor der Volumenbestimmung reparieren solltest.

## Das Modell ansehen oder konvertieren

Im [STL-Betrachter](../stl-viewer/) oder [OBJ-Betrachter](../obj-viewer/) kannst du das Modell in 3D und als Drahtgitter betrachten. Nutze den [OBJ-zu-STL-Konverter](../obj-to-stl-converter/), wenn das nächste Programm eine STL-Datei erwartet.

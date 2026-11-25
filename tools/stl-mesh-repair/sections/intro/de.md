## Eine STL-Datei online reparieren

Wähle **Datei öffnen** oder ziehe eine ASCII- oder binäre `.stl`-Datei in das Tool. Die Reparatur läuft auf deinem Gerät. Wähle **Beispiel ausprobieren**, um ein kleines Netz mit doppelten Flächen, Flächen mit einem Flächeninhalt von null und umgekehrten Flächen zu sehen. Vergleiche die Ergebnisse und wähle **STL herunterladen**, um eine neue binäre Datei mit unveränderter Größe und unveränderten Koordinaten zu speichern.

## Was die Netzreparatur ändert

Das Tool entfernt exakt doppelte Dreiecke und Dreiecke mit einem Flächeninhalt von null. Es vergleicht die Ausrichtung benachbarter Flächen. Sind zwei einheitliche Ausrichtungen möglich, wählt es diejenige, für die weniger Flächen umgekehrt werden müssen. Die Eckpunkte behalten ihre Positionen. Offene Ränder, uneindeutige Flächenausrichtungen und nicht mannigfaltige Verbindungen können eine manuelle Reparatur erfordern. Löcher, fast zusammenfallende Eckpunkte und Überschneidungen bleiben erhalten. [Häufige Netzprobleme beim 3D-Druck](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Die Topologie vor und nach der Reparatur vergleichen

Prüfe die Anzahl der Dreiecke, doppelten und degenerierten Flächen. Der Bericht zeigt auch verbleibende Kanten mit uneinheitlicher Flächenausrichtung, offene Ränder sowie nicht mannigfaltige Kanten und Eckpunkte. Öffne die heruntergeladene Datei im [STL-Betrachter](../stl-viewer/), um sie in 3D anzusehen. Oberflächeninhalt und eingeschlossenes Volumen findest du unter [Netzvolumen und Topologie prüfen](../mesh-inspector/). Wenn die Prüfung einer STL-Datei Topologieprobleme meldet, kannst du direkt im Bericht **STL reparieren** wählen.

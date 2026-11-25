## Ein glTF-Modell in eine einzige GLB-Datei umwandeln

Wähle **Dateien öffnen**, um das `.gltf`-Modell zusammen mit seinen `.bin`-Puffern und Texturen auszuwählen. Liegen Texturen in Unterordnern, nutze **Ordner öffnen**, damit der Konverter den Pfaden im Modell folgen kann. Auch glTF-Dateien mit bereits eingebetteten Daten lassen sich öffnen. Wähle **Beispiel ausprobieren**, um eine animierte Pyramide zu verpacken, und danach **GLB herunterladen**. Die Dateien werden in deinem Browser verarbeitet.

## Einen fehlenden Puffer oder eine fehlende Textur hinzufügen

Eine `.gltf`-Datei im JSON-Format kann auf Ressourcen wie `model.bin` oder `textures/albedo.png` verweisen. Der Konverter listet fehlende Pfade auf. Wähle **Dateien hinzufügen**, um die fehlenden Ressourcen zu ergänzen, während das Modell geöffnet bleibt. Behalte die ursprünglichen Dateinamen bei. Gibt es gleichnamige Dateien in verschiedenen Unterordnern, wähle den Ordner mit dem Modell und allen zugehörigen Dateien aus, damit der Konverter ihre Pfade kennt.

## Die GLB-Datei teilen und prüfen

Die GLB-Datei enthält Geometrie, unterstützte Texturen und andere Standarddaten, auf die das Modell verweist. Netze, Materialien und Animationsclips bleiben erhalten. Die ursprüngliche Texturkodierung und Netzkomprimierung bleiben beim Verpacken erhalten. Das Zielprogramm muss daher die verwendeten Formate unterstützen. PNG- und JPEG-Texturen sind mit den meisten glTF-Anwendungen kompatibel. Öffne die heruntergeladene Datei im [GLB- und glTF-Betrachter](../gltf-viewer/), um Größe, Materialien und Animation ohne Begleitdateien zu prüfen. [glTF-2.0-Dateiformat](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)

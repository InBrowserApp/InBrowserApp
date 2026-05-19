## Browser-Audio offline aufnehmen

Verwende den Audiorecorder, um schnell eine Sprachnotiz, einen Mikrofontest, einen Entwurf für eine Erzählung oder ein Klangbeispiel aufzunehmen, ohne den Browser zu verlassen. Das Tool fragt erst dann nach Mikrofonzugriff, wenn du eine Aufnahme startest, und lässt dich die Aufnahme anschließend pausieren, fortsetzen, stoppen, anhören und herunterladen.

## Praktische Einsatzbereiche

Er ist nützlich, um zu prüfen, ob ein Mikrofon funktioniert, eine gesprochene Erinnerung festzuhalten, ein vorläufiges Aussprachebeispiel aufzunehmen oder einen kurzen Clip für einen anderen Arbeitsablauf zu erstellen. Da der Recorder clientseitig läuft, ist er auch praktisch, wenn du für eine einfache Aufnahme keine Desktop-Audio-App installieren möchtest.

## Datenschutz und Browser-Formate

Die Aufnahme erfolgt über die MediaRecorder API des Browsers. Audio bleibt während der Aufnahme und Vorschau lokal auf der Seite; InBrowser.App lädt den Mikrofonstream nicht hoch. Der endgültige Dateityp hängt von der Browserunterstützung ab, sodass ein Browser WebM oder OGG herunterladen kann, während ein anderer M4A erzeugt.

## Tipps für saubere Aufnahmen

Nutze eine ruhige Umgebung, halte den Mikrofoneingangspegel angemessen und mache eine kurze Testaufnahme, bevor du etwas Wichtiges aufnimmst. Wenn die Seite keine Aufnahme starten kann, prüfe, ob die Website über HTTPS oder localhost geöffnet ist und ob die Mikrofonberechtigung für den aktuellen Browser-Tab erlaubt ist.

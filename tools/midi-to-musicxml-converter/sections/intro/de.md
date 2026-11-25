## MIDI in bearbeitbare Noten umwandeln

Wähle eine .mid- oder .midi-Datei und ein Quantisierungsraster. Klicke dann auf **MusicXML herunterladen**. Öffne die Partitur in einem Notensatzprogramm wie MuseScore Studio, Dorico oder Sibelius, um sie zu bearbeiten oder auszudrucken. Im [MusicXML-Betrachter](/de/tools/musicxml-viewer/) kannst du das Ergebnis auch direkt im Browser prüfen.

## Ein Rhythmusraster wählen

MIDI speichert, wann Noten beginnen und enden. Beim Einspielen können Noten etwas vor oder nach dem Taktschlag liegen. Die Quantisierung richtet Notenanfänge und -enden am Raster aus, damit sich der Rhythmus notieren lässt. Beginne mit Sechzehntelnoten (1/16). Für eine einfachere Melodie kannst du Achtelnoten (1/8) wählen. Verwende Zweiunddreißigstelnoten (1/32), wenn kurze Noten in einer Stimme unterscheidbar bleiben sollen.

## Was die umgewandelte Partitur enthält

Der Konverter erzeugt nach Stimmen gegliedertes MusicXML (Partwise) aus MIDI-Dateien mit musikalischer Zeitbasis (Format 0 oder 1). Er ordnet die Stimmen, fasst gleichzeitig erklingende Noten zusammen und übernimmt Tempo, Taktart- und Tonartangaben. General-MIDI-Schlagzeugnoten werden als Schlagwerk ohne bestimmte Tonhöhe notiert. MIDI liefert die Noten und ihre Zeitpunkte. Prüfe daher Details wie Auftakte, Triolen und andere N-tolen, Fingersätze und die enharmonische Schreibung im Notensatzprogramm. Die Datei wird lokal im Browser verarbeitet.

# Kalenderdateien direkt im Browser erstellen

Dieses Tool erzeugt standardisierte `.ics`-Ereignisdateien direkt in Ihrem Browser. Sie können zeitgebundene oder ganztägige Termine definieren, eine Zeitzonenstrategie wählen, Erinnerungen hinzufügen und den fertigen Kalendereintrag exportieren, ohne Daten an einen Server zu synchronisieren.

## Warum es sinnvoll ist

- Es ist passend, wenn Sie nur eine Kalenderdatei brauchen und keinen vollständigen Kalenderkonto-Workflow.
- Empfindliche Terminpläne bleiben lokal, während trotzdem ein standardkonformer Anhang erzeugt wird.
- Wiederholungsregeln und Erinnerungen lassen sich zuerst abstimmen, bevor Sie die endgültige `.ics`-Datei herunterladen.

## Empfohlener Ablauf

1. Tragen Sie Titel, Ort, Notizen und optional eine Referenz-URL für das Ereignis ein.
2. Wählen Sie den Zeitraum und entscheiden Sie anschließend, ob Sie `UTC`-Zeitstempel exportieren oder die ursprüngliche Zeitzone mit `TZID` beibehalten möchten.
3. Fügen Sie nur dann Wiederholungen und Erinnerungen hinzu, wenn sie gebraucht werden, laden Sie danach die Datei herunter und hängen Sie sie dort an, wo Sie den Termin teilen.

## Hinweise

- `UTC`-Ausgabe ist meist die sicherste Wahl, wenn Sie eine breite Kalenderkompatibilität möchten.
- `TZID`-Ausgabe erhält den ursprünglichen Planungskontext für Clients, die benannte Zeitzonen verstehen.
- Bei ganztägigen Ereignissen bleibt das Enddatum im Formular inklusive, auch wenn die ICS-Datei es als exklusives Enddatum speichert.

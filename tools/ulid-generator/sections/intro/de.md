Erzeuge ULIDs lokal in deinem Browser für Datensätze, Ereignisse, Protokolle, Fixtures und verteilte Systeme, die kompakte Identifikatoren mit zeitlich sortierbaren Präfixen benötigen. Jeder Wert wird auf diesem Gerät erstellt und kann kopiert oder heruntergeladen werden, ohne den Batch an einen anderen Dienst zu senden.

## Warum ULID verwenden

ULID steht für Universally Unique Lexicographically Sortable Identifier. Es kombiniert einen 48-Bit-Unix-Millisekunden-Zeitstempel mit 80 Bit Zufall und codiert das Ergebnis anschließend als 26-stellige Crockford Base32-Zeichenfolge. Diese Form macht ULIDs URL-sicher, datenbankfreundlich und nach Erstellungszeit natürlich sortierbar.

## Aktuelle oder benutzerdefinierte Zeit

Verwende die aktuelle Zeit für normale Anwendungsdatensätze, Importschlüssel und Testdaten, die widerspiegeln sollen, wann sie erstellt wurden. Wechsle zu einem benutzerdefinierten Zeitstempel, wenn du deterministisch wirkende Beispiele, nachträglich eingefügte Zeilen, wiedergegebene Ereignisse oder Fixtures benötigst, die um einen bestimmten Zeitpunkt herum sortiert werden sollen.

## Monotone Batches

Wenn der monotone Batch-Modus aktiviert ist, erhöhen IDs, die für dieselbe Millisekunde erzeugt werden, ihr zufälliges Segment, sodass der Batch von oben nach unten lexikografisch sortiert bleibt. Deaktiviere ihn, wenn jede Zeile stattdessen ein neues zufälliges Segment verwenden soll. Beide Modi lassen den Zeitstempel in den ersten zehn Zeichen sichtbar.

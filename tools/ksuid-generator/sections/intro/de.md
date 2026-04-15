Generiere KSUIDs lokal in deinem Browser, ohne den aktuellen Stapel an einen anderen Dienst zu senden. Dieses Tool eignet sich, wenn du Identifikatoren brauchst, die in verteilten Systemen eindeutig bleiben und sich gleichzeitig ungefähr nach Erstellungszeit sortieren lassen, etwa für Logs, Feeds, Importe oder geordnete Datensätze.

## Warum KSUID Verwenden

KSUID kombiniert einen 32-Bit-Zeitstempel mit 128 Bit Zufallsdaten und kodiert das Ergebnis als 27-stellige Base62-Zeichenfolge. Dadurch bleibt jede ID kompakt, URL-freundlich und leicht zu speichern, während der eingebettete Zeitstempel dafür sorgt, dass neuere Werte im Allgemeinen hinter älteren einsortiert werden.

## Aktuelle Oder Benutzerdefinierte Zeit Wählen

Verwende die aktuelle Zeit, wenn du neue IDs für Produktionsdaten, Demos oder die normale Batch-Erzeugung brauchst. Wechsle zu einem benutzerdefinierten Zeitstempel, wenn du reproduzierbare Fixtures, nachträglich importierte Datensätze, Migrationsbeispiele oder Testfälle brauchst, die aus einem bestimmten Zeitpunkt stammen sollen.

## Was Du Vor Dem Export Wissen Solltest

KSUID speichert nur Sekundenpräzision. Eingaben mit Millisekunden werden also auf den Beginn dieser Sekunde abgerundet. IDs, die in derselben Sekunde erzeugt werden, bleiben eindeutig, ihre endgültige Reihenfolge hängt jedoch auch vom Zufallsteil ab. KSUID ist daher zeitlich sortierbar, aber nicht streng fortlaufend.

UUID v7 ist ein modernes UUID-Format, das einen Unix-Zeitstempel in Millisekunden an den Anfang der Kennung setzt und die übrigen Bits mit Zufall füllt. Dadurch sind die Werte in der Praxis global eindeutig und bleiben zugleich auf natürliche Weise nach Erstellungszeit sortierbar.

## Was dieses Tool macht

Dieser Generator erstellt UUID v7-Werte vollständig in deinem Browser. Du kannst eine einzelne Kennung oder einen Stapel von bis zu 100 erzeugen und die Liste anschließend kopieren oder als Textdatei für Initialdaten, Datenbankeinträge, Ereignis-Testdaten oder Testnutzlasten herunterladen.

## Aktuelle oder benutzerdefinierte Zeit

Verwende die aktuelle Zeit für normale Anwendungsdatensätze, Importschlüssel und Testdaten, die widerspiegeln sollen, wann sie erstellt wurden. Wechsle zu einem benutzerdefinierten Zeitstempel, wenn du deterministisch wirkende Beispiele, nachträglich eingefügte Zeilen, wiedergegebene Ereignisse oder Fixtures benötigst, die um einen bestimmten Zeitpunkt herum sortiert werden sollen.

## Wann UUID v7 hilft

UUID v7 ist nützlich, wenn du nicht sprechende Kennungen brauchst, die sich trotzdem gut in Datenbanken, Logs, Warteschlangen und verteilten Ereignisströmen sortieren lassen. Im Vergleich zu zufälligen UUID v4-Werten reduziert UUID v7 die Bewegung in Indexen, weil neuere Datensätze meist nahe am Ende eines sortierten Schlüsselraums erscheinen.

## Hinweise zur Sortierbarkeit und Sicherheit

Der Zeitstempelanteil zeichnet Millisekunden auf, keinen privaten oder geheimen Wert. Wenn eine Kennung die ungefähre Erstellungszeit nicht preisgeben soll, verwende stattdessen ein vollständig zufälliges Format. Innerhalb eines erzeugten Stapels hält dieses Tool Werte für dieselbe Millisekunde monoton, während die UUID v7-Versions- und Variantenbits erhalten bleiben.

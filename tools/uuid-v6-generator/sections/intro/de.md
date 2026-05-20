Der UUID-v6-Generator erstellt zeitbasierte UUIDs, die die vertraute UUID-Form beibehalten und den Zeitstempel für eine natürliche lexikalische Sortierung an den Anfang stellen. Er läuft vollständig in deinem Browser, sodass erzeugte Kennungen und optionale Node-Werte die Seite nie verlassen.

## Wann UUID v6 hilft

Verwende UUID v6, wenn du Kennungen brauchst, die mit UUID-Werkzeugen weitgehend kompatibel bleiben, sich aber in Protokollen, Datenbankindizes, Ereignisstreams oder Migrationsskripten auch nahe an der Erstellungsreihenfolge sortieren lassen. UUID v6 ist semantisch UUID v1 am ähnlichsten: Sie verwendet einen gregorianischen Zeitstempel, eine Clock Sequence und ein 48-Bit-Node-Feld, ordnet die Zeitstempel-Bits aber so um, dass neuere IDs nach älteren IDs sortiert werden.

## Node-IDs und Datenschutz

Klassische UUID-v1-Generatoren verwenden als Node-Feld häufig eine echte MAC-Adresse. Dieses Tool verwendet standardmäßig für jede erzeugte UUID eine zufällige, lokal verwaltete Node-ID, sodass keine Hardwareadresse offengelegt wird. Wechsle nur dann zu einem benutzerdefinierten Node, wenn du bewusst v1-kompatible Ausgaben für Testdaten, Interoperabilitätsprüfungen oder kontrollierte Systeme benötigst.

## Clock Sequence und benutzerdefinierte Zeit

Die Clock Sequence hilft, Kollisionen zu vermeiden, wenn sich Zeitstempel wiederholen oder Uhren zurückspringen. Die standardmäßige zufällige Sequenz ist für normale Nutzung am sichersten. Benutzerdefinierte Zeitstempel, Node-IDs und Clock Sequences sind für deterministische Beispiele nützlich, wiederholte benutzerdefinierte Werte sollten in Produktionsdaten jedoch mit Vorsicht verwendet werden.

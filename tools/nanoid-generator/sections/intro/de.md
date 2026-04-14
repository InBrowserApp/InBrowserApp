## Was ist NanoID?

NanoID ist ein kompakter, URL-sicherer Generator für eindeutige IDs, der für moderne Web-Apps, APIs und interne Tools entwickelt wurde. Das Standardformat verwendet 21 Zeichen aus einem Alphabet mit 64 Zeichen und liefert damit ungefähr 126 Bit Zufälligkeit, bleibt aber trotzdem kurz genug für URLs, Dateinamen und Testdaten.

Alles in diesem Tool läuft lokal in deinem Browser. Dein benutzerdefiniertes Alphabet und die erzeugten IDs verlassen die Seite nicht, was das Tool praktisch für schnelles Prototyping, das Erstellen von Testdaten und einmalige operative Aufgaben macht.

**Wichtige Punkte:**

- **URL-sicher**: verwendet A-Z, a-z, 0-9, - und \_.
- **Anpassbar**: Länge und Alphabet lassen sich an deine Vorgaben anpassen.
- **Sichere Zufälligkeit**: verwendet kryptografisch sichere Zufallswerte im Browser.
- **Klartext-Export**: Du kannst die aktuelle Charge kopieren oder herunterladen, wenn du Seed-Daten, Demo-Inhalte oder importierbare Listen brauchst.

**Praktische Hinweise:**

- Behalte die Standardlänge von 21 Zeichen bei, wenn du eine starke Allzweck-ID mit sehr geringer Kollisionswahrscheinlichkeit brauchst.
- Kürzere IDs eignen sich für temporäre UI-Tokens oder lokale Mock-Daten, aber das Kollisionsrisiko steigt, je kürzer die IDs werden oder je größer die erzeugte Menge ist.
- Ein größeres Alphabet liefert mehr Entropie pro Zeichen, sodass du IDs oft kürzer halten kannst, ohne so viel Eindeutigkeit zu verlieren.
- Benutzerdefinierte Alphabete sollten nur eindeutige Zeichen enthalten. Doppelte Zeichen verzerren die Verteilung, daher blockiert dieses Tool sie vor der Generierung.

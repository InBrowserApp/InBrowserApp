## Was ist Unicode-Escaping?

Unicode-Escaping wandelt Zeichen in kodierte Sequenzen um, die ihre Unicode-Codepunkte darstellen. Dies ist notwendig, wenn Quellcode, Konfigurationsdateien oder Datenformate bestimmte Zeichen nicht direkt enthalten können.

**Gängige Escape-Formate:**

- `\uXXXX` — JavaScript / JSON, in den meisten Programmiersprachen verwendet
- `\u{XXXXX}` — ES6+ JavaScript, unterstützt ergänzende Zeichen ohne Surrogatpaare
- `&#xXXXX;` / `&#DDDD;` — HTML-Entitäten in hexadezimaler oder dezimaler Form
- `U+XXXX` — Standard-Unicode-Notation in Dokumentationen
- `\xXX` / `%XX` — UTF-8-Byte-Level-Kodierung, verbreitet in URLs und C-ähnlichen Sprachen
- `\UXXXXXXXX` — Python-8-Zeichen-Format für beliebige Codepunkte
- `0xXXXX` — Hexadezimale Literalnotation

## Wann dieses Tool verwenden

- Einbetten von Nicht-ASCII-Zeichen in Quellcode oder Konfigurationsdateien, die ASCII-sichere Kodierung erfordern
- Debuggen von fehlerhaftem Text durch Überprüfung der zugrunde liegenden Unicode-Codepunkte
- Konvertieren zwischen verschiedenen Escape-Notationen beim Portieren zwischen Sprachen oder Formaten
- Vorbereiten von Text für JSON-, HTML- oder URL-Kontexte, die entity-kodierte Zeichen benötigen

## Funktionsweise

Geben Sie auf der linken Seite Klartext ein oder fügen Sie ihn ein – das Tool escapt Nicht-ASCII-Zeichen im ausgewählten Format. Fügen Sie auf der rechten Seite escapeten Text ein und alle unterstützten Formate werden automatisch erkannt und gleichzeitig dekodiert. Alles läuft lokal im Browser.

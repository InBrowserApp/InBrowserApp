## Was ist ein UUID-Validator?

Ein UUID-Validator prüft, ob eine Kennung in der standardmäßigen UUID-Form mit 36 Zeichen geschrieben ist, zum Beispiel `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Das ist nützlich, wenn du IDs aus Logs, APIs, Datenbanken, Test-Fixtures oder Benutzereingaben verifizieren musst, bevor du dich im Code auf sie verlässt.

### Unterstützte Eingabe

Dieses Tool validiert kanonischen UUID-Text mit fünf hexadezimalen Gruppen im Layout `8-4-4-4-12`. Großbuchstaben werden akzeptiert und in Kleinbuchstaben normalisiert. Die Nil-UUID (`00000000-0000-0000-0000-000000000000`) und die Max-UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) werden als gültige Sonderwerte behandelt.

### Validierungsdetails

Bei Standard-UUIDs prüft der Validator das Versions-Nibble und die Variantenbits. Die Versionen 1 bis 8 werden erkannt und decken ältere UUIDs nach RFC 4122 sowie neuere Layouts nach RFC 9562 wie UUID v6, v7 und v8 ab. Das Ergebnisfeld zerlegt die UUID außerdem in ihre fünf Segmente, damit du die exakt validierten Bytes prüfen kannst.

### Datenschutz

Die Validierung läuft vollständig in deinem Browser. Die eingefügte UUID wird nicht hochgeladen, daher kannst du das Tool sicher mit internen Kennungen, Datenbankschlüsseln und Beispiel-Produktionslogs verwenden, die lokal bleiben sollen.

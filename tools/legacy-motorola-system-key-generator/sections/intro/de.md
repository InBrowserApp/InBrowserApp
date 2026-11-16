## Was ist ein Motorola-Systemschlüssel im Legacy-Format?

Ein Software-Systemschlüssel ist eine `.KEY`-Datei, mit der kompatible Motorola-Programmiersoftware die Bearbeitung geschützter Einstellungen eines Bündelfunksystems ermöglicht. Dieser Generator bildet für eine System-ID das von BatLabs abgeleitete Legacy-Format nach. Ein Systemschlüssel unterscheidet sich von einem Schlüssel zur Verschlüsselung des Funkverkehrs und gewährt allein keinen Zugang zu einem Funknetz.

## So verwenden Sie diesen Generator

1. Geben Sie eine System-ID mit 1–4 Hexadezimalziffern (`0–9`, `A–F`) ohne das Präfix `0x` ein. Kleinbuchstaben werden akzeptiert, und kurze IDs werden mit führenden Nullen aufgefüllt: Aus `ab` wird `00AB`.
2. Prüfen Sie die normalisierte ID, den Dateinamen und die hexadezimale Vorschau.
3. Laden Sie die binäre `.KEY`-Datei herunter und laden Sie sie in kompatible ältere Programmiersoftware. Die Datei ist 27 Bytes groß; die System-ID `1234` erzeugt `SYS01234.KEY`.

## Kompatibilitätsgrenzen

Dieses Tool folgt einem veröffentlichten Legacy-Format; die Kompatibilität hängt von der Programmiersoftware ab. Es unterstützt weder ASTRO 25 Portable CPS (einschließlich XTS5000) noch APX CPS oder Advanced System Keys (ASK). Die Übereinstimmung mit dem Byteformat der Referenz belegt keine Kompatibilität mit einem bestimmten Funkgerät oder einer bestimmten CPS-Version.

## Datenschutz

Erstellung, Validierung und Dateivorschau erfolgen lokal in Ihrem Browser. Ihre System-ID und der erzeugte Schlüssel werden nicht an einen Server gesendet.

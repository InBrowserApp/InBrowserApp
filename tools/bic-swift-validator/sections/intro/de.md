## Was ist BIC/SWIFT?

BIC (Bank Identifier Code), auch SWIFT-Code genannt, identifiziert Finanzinstitute bei internationalen Zahlungen.

### BIC-Struktur

Ein BIC hat 8 oder 11 Zeichen: Bankcode (4 Buchstaben), Ländercode (2 Buchstaben), Standortcode (2 alphanumerisch) und optionaler Filialcode (3 alphanumerisch).

### Validierungsregeln

Die Validierung prüft Länge, Zeichensatz und ISO-3166-Ländercodes.

1. Leerzeichen und Bindestriche entfernen
2. Prüfen, ob das Format 8 oder 11 Zeichen hat
3. Bank-, Länder-, Standort- und Filialcode parsen

Der Filialcode "XXX" oder ein 8-stelliger BIC kennzeichnet die Hauptstelle.

Das zweite Zeichen des Standortcodes 0 kennzeichnet einen Test-BIC; 1 kennzeichnet einen passiven Teilnehmer.

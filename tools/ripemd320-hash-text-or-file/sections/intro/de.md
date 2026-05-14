## Was ist RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) ist eine kryptografische Hash-Funktion, die einen 320-Bit-Hashwert (40 Byte) erzeugt, der typischerweise als 80-stellige Hexadezimalzahl dargestellt wird. Sie gehört zur RIPEMD-Familie, die in Europa als Alternative zu MD4/MD5 entwickelt wurde.

Verwenden Sie dieses Tool, wenn Sie einen RIPEMD-320-Digest für eingefügten Text, kopierte Konfigurationsdaten oder eine lokale Datei berechnen müssen. Die Berechnung läuft in Ihrem Browser, sodass der Dateiinhalt nicht auf einen Server hochgeladen werden muss.

**Hauptmerkmale:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Schnelle Berechnung**: Für jede gegebene Eingabe schnell zu berechnen
- **Lawineneffekt**: Kleine Änderungen an der Eingabe erzeugen deutlich andere Ausgaben
- **Feste Ausgabelänge**: Erzeugt unabhängig von der Eingabegröße immer einen 320-Bit-Hash
- **Einweg**: Es ist rechnerisch nicht praktikabel, die ursprüngliche Eingabe aus dem Hash zurückzugewinnen

**Häufige Verwendungen:**

- Datenintegritätsprüfungen
- Fingerprinting und Deduplizierung
- Kompatibilität mit Altsystemen

**Sicherheitshinweis:**

RIPEMD-320 ist hauptsächlich dann sinnvoll, wenn ein Protokoll, Archiv, eine Prüfsummenliste oder ein Altsystem es bereits vorgibt. Für neue sicherheitssensible Designs sollten Sie einen aktuell standardisierten Hash wie SHA-256, SHA-512, SHA-3 oder BLAKE3 bevorzugen, sofern keine RIPEMD-Kompatibilität erforderlich ist.

## Was ist RIPEMD-256?

RIPEMD-256 (RACE Integrity Primitives Evaluation Message Digest) ist eine kryptografische Hash-Funktion, die einen 256-Bit (32-Byte) Hash-Wert erzeugt, der typischerweise als 64-stellige Hexadezimalzahl dargestellt wird. Sie gehört zur in Europa entwickelten RIPEMD-Familie als Alternative zu MD4/MD5.

**Hauptmerkmale:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Schnelle Berechnung**: Schnell zu berechnen für jede gegebene Eingabe
- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben
- **Feste Ausgabelänge**: Erzeugt immer einen 256-Bit-Hash unabhängig von der Eingabegröße
- **Einweg**: Rechnerisch nicht machbar, die ursprüngliche Eingabe aus dem Hash abzuleiten

**Häufige Verwendungen:**

- Datenintegritätsprüfungen
- Fingerprinting und Deduplizierung
- Kompatibilität mit Altsystemen

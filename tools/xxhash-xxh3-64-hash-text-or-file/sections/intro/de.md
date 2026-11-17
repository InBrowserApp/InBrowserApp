## Was ist xxHash (XXH3 64)?

XXH3 ist ein moderner xxHash-Algorithmus, der auf sehr hohe Geschwindigkeit und eine ausgezeichnete Verteilung ausgelegt ist. XXH3 64 erzeugt einen 64-Bit-Hashwert (8 Byte), der üblicherweise als 16-stellige Hexadezimalzeichenfolge dargestellt wird. Es handelt sich um einen nicht kryptografischen Hash; optional kann ein Seed für reproduzierbare Hashes verwendet werden.

**Wichtige Eigenschaften:**

- **Extrem schnell**: Für hohe Leistung bei großen Eingaben optimiert
- **Deterministisch**: Dieselbe Eingabe und derselbe Seed erzeugen stets denselben Hash
- **Nicht kryptografisch**: Für Sicherheitszwecke ungeeignet
- **Gute Verteilung**: Eignet sich für Hashtabellen und Indizierung
- **Mit Seed**: Ein optionaler Seed kann die Hash-Ausgaben variieren

**Typische Anwendungen:**

- Hashtabellen und Datenstrukturen
- Datei-Integritätsprüfungen (ohne Sicherheitsanspruch)
- Datendeduplizierung und Aufteilung in Blöcke
- Cache-Schlüssel und Datenbankindizierung
- Datenpipelines mit hohem Durchsatz

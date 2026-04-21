## Was ist xxHash (XXH3 128)?

XXH3 ist der moderne xxHash-Algorithmus, der für sehr hohe Geschwindigkeit und eine ausgezeichnete Verteilung entwickelt wurde. XXH3 128 erzeugt einen 128-Bit-Hashwert (16 Byte), der typischerweise als 32-stellige Hexadezimalzeichenfolge dargestellt wird. Es handelt sich um einen nicht-kryptographischen Hash mit optionalem Seed für reproduzierbare Ergebnisse.

**Hauptmerkmale:**

- **Extrem schnell**: Für hohe Leistung bei großen Eingaben optimiert
- **Deterministisch**: Dieselbe Eingabe mit demselben Seed erzeugt immer denselben Hash
- **Nicht-kryptographisch**: Nicht für Sicherheitszwecke geeignet
- **Gute Verteilung**: Nützlich für Hash-Tabellen und Indizierung
- **Mit Seed**: Ein optionaler Seed hilft dabei, Hash-Ausgaben zu unterscheiden

**Häufige Verwendungen:**

- Hash-Tabellen und Datenstrukturen
- Datei-Integritätsprüfungen (nicht sicherheitsrelevant)
- Datendeduplizierung und Chunking
- Cache-Schlüssel und Datenbankindizierung
- Datenpipelines mit hohem Durchsatz

## Was ist xxHash (XXH64)?

xxHash ist ein extrem schneller nicht-kryptographischer Hash-Algorithmus, der sich auf Geschwindigkeit und Leistung konzentriert, während er gute Verteilungseigenschaften beibehält. XXH64 ist die 64-Bit-Variante, die einen 64-Bit (8-Byte) Hash-Wert erzeugt, der typischerweise als 16-stellige Hexadezimalzahl angezeigt wird.

**Hauptmerkmale:**

- **Extrem schnell**: Für Geschwindigkeit optimiert, viel schneller als kryptographische Hash-Funktionen
- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Gute Verteilung**: Bietet exzellente Hash-Verteilung für Hash-Tabellen
- **Nicht-kryptographisch**: Nicht für Sicherheitszwecke geeignet, für Leistung entwickelt
- **Größere Ausgabe**: 64-Bit Hash bietet bessere Kollisionsresistenz als 32-Bit Varianten
- **Plattform-optimiert**: Verwendet SIMD-Anweisungen wenn verfügbar für maximale Geschwindigkeit

**Häufige Verwendungen:**

- Hash-Tabellen und Datenstrukturen
- Datei-Integritätsprüfungen (nicht-sicherheit)
- Datendeduplizierung
- Prüfsummen für Datenübertragung
- Leistungskritische Anwendungen
- Datenbankindizierung
- Cache-Schlüssel-Generierung

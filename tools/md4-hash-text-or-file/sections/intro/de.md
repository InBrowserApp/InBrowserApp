## Was ist MD4?

MD4 (Message Digest Algorithm 4) ist eine weit verbreitete kryptographische Hash-Funktion, die einen 128-Bit (16-Byte) Hash-Wert erzeugt, der typischerweise als 32-stellige Hexadezimalzahl dargestellt wird. Es wurde 1990 von Ron Rivest entworfen.

**Hauptmerkmale:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Schnelle Berechnung**: Schnell zu berechnen für jede gegebene Eingabe
- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben
- **Feste Ausgabegröße**: Erzeugt immer einen 128-Bit Hash unabhängig von der Eingabegröße
- **Kollisionsvulnerabel**: Bekannte Schwachstellen machen es möglich, Kollisionen zu finden

**Sicherheitsstatus:**
⚠️ **MD4 ist kryptographisch gebrochen und sollte nicht für sicherheitskritische Anwendungen verwendet werden**. Kollisionsangriffe wurden 1995 demonstriert, und praktische Kollisionsgenerierung wurde mit moderner Rechenleistung machbar.

**Häufige Verwendungen (aktuell und historisch):**

- Datei-Integritätsprüfung (nicht sicherheitskritisch)
- Prüfsummen zur Erkennung von Datenkorruption
- Legacy-Systeme, die MD4 erfordern
- Datenbank-Schlüsselgenerierung (nicht kryptographisch)
- Einige ältere Protokolle und Systeme

**Empfohlene Alternativen:**

- SHA-256 oder SHA-3 für neue Anwendungen
- SHA-512 für hohe Sicherheitsanforderungen
- BLAKE2 für Hochleistungsanwendungen

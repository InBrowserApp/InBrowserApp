## Was ist RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) ist eine kryptographische Hash-Funktion, die einen 160-Bit (20-Byte) Hash-Wert erzeugt, der typischerweise als 40-stellige Hexadezimalzahl dargestellt wird. Es wurde 1996 von Hans Dobbertin, Antoon Bosselaers und Bart Preneel als Teil des europäischen RACE-Projekts entwickelt.

**Hauptmerkmale:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Schnelle Berechnung**: Angemessen schnell zu berechnen für jede gegebene Eingabe
- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben
- **Feste Ausgabegröße**: Erzeugt immer einen 160-Bit Hash unabhängig von der Eingabegröße
- **Zwei-Linien-Parallelstruktur**: Verwendet zwei parallele Berechnungslinien für erhöhte Sicherheit

**Sicherheitsstatus:**
✅ **RIPEMD-160 gilt als kryptographisch sicher** ohne bekannte praktische Angriffe. Es bietet eine gute Sicherheitsmarge und wird immer noch für kryptographische Anwendungen empfohlen, wo ein 160-Bit Hash ausreichend ist.

**Häufige Verwendungen:**

- Bitcoin-Adressgenerierung (Base58Check-Kodierung)
- Digitale Signaturen und Zertifikate
- Datenintegritätsprüfung
- Kryptographische Protokolle, die 160-Bit Hashes erfordern
- Alternative zu SHA-1 bei Bedarf

**Vergleich mit anderen Algorithmen:**

- Sicherer als MD5 und SHA-1
- Kleinere Ausgabe als SHA-256 (160-Bit vs 256-Bit)
- Gute Leistungsmerkmale
- Gut untersucht und vertrauenswürdig in der kryptographischen Gemeinschaft

**Empfohlen für:**

- Anwendungen, die 160-Bit Hash-Sicherheit erfordern
- Bitcoin-bezogene kryptographische Operationen
- Legacy-System-Kompatibilität, wo RIPEMD-160 spezifiziert ist

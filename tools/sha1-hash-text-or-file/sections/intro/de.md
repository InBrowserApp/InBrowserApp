## Was ist SHA-1?

SHA-1 (Secure Hash Algorithm 1) ist eine kryptographische Hash-Funktion, die einen 160-Bit (20-Byte) Hash-Wert erzeugt, der typischerweise als 40-stellige Hexadezimalzahl dargestellt wird. Es wurde von der NSA entworfen und 1995 vom NIST als Teil des Digital Signature Standards veröffentlicht.

**Hauptmerkmale:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Schnelle Berechnung**: Schnell zu berechnen für jede gegebene Eingabe
- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben
- **Irreversibel**: Rechnerisch nicht machbar, den Hash umzukehren, um die ursprüngliche Eingabe zu finden
- **Kollisionsvulnerabel**: Bekannte Schwachstellen machen es möglich, Kollisionen zu finden

**Sicherheitsstatus:**
⚠️ **SHA-1 ist kryptographisch gebrochen und sollte nicht für sicherheitskritische Anwendungen verwendet werden**. Theoretische Angriffe wurden 2005 demonstriert, und praktische Kollisionsangriffe wurden 2017 erreicht.

**Häufige Verwendungen (historisch):**

- Digitale Signaturen und Zertifikate (veraltet)
- Git-Versionskontrollsystem (aus Kompatibilitätsgründen)
- Legacy-Systeme, die SHA-1 erfordern
- Datei-Integritätsprüfung (nicht sicherheitskritisch)
- Proof-of-Work-Algorithmen (einige ältere Kryptowährungen)

**Empfohlene Alternativen:**

- SHA-256 oder SHA-3 für neue Anwendungen
- SHA-512 für hohe Sicherheitsanforderungen

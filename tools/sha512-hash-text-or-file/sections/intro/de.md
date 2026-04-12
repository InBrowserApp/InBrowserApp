## Was ist SHA-512?

SHA-512 (Secure Hash Algorithm 512-Bit) ist eine kryptographische Hash-Funktion, die einen 512-Bit (64-Byte) Hash-Wert erzeugt, der typischerweise als 128-stellige Hexadezimalzahl dargestellt wird. Es ist Teil der SHA-2-Familie von Hash-Funktionen, die von der NSA entworfen und vom NIST veröffentlicht wurden.

**Hauptmerkmale:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Schnelle Berechnung**: Schnell zu berechnen für jede gegebene Eingabe
- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben
- **Irreversibel**: Rechnerisch nicht machbar, den Hash umzukehren, um die ursprüngliche Eingabe zu finden
- **Kollisionsresistent**: Sehr schwierig, zwei verschiedene Eingaben zu finden, die denselben Hash erzeugen

**Häufige Verwendungen:**

- Digitale Signaturen und Zertifikate
- Blockchain und Kryptowährungen (Bitcoin verwendet SHA-256, aber SHA-512 wird in anderen Systemen verwendet)
- Passwort-Speicherung (mit angemessenem Salting)
- Datei-Integritätsprüfung
- Proof-of-Work-Algorithmen

## Was ist SHA-512/224 (FIPS 180-4)?

SHA-512/224 (FIPS 180-4) ist eine kryptografische Hashfunktion aus der SHA-2-Familie. Sie erzeugt einen 224-Bit-Digest (28 Byte), der üblicherweise als 56-stellige Hexadezimalzeichenfolge dargestellt wird. Sie basiert auf SHA-512, verwendet jedoch andere Anfangswerte und eine gekürzte Ausgabe. So entsteht ein kürzerer Digest bei gleicher interner Struktur wie SHA-512.

**Wichtige Eigenschaften:**

- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash.
- **Schnelle Berechnung**: Lässt sich für jede Eingabe rasch berechnen.
- **Lawineneffekt**: Kleine Änderungen an der Eingabe führen zu stark veränderten Ausgaben.
- **Nicht umkehrbar**: Es ist rechnerisch praktisch unmöglich, den Hash umzukehren und die ursprüngliche Eingabe zu finden.
- **Kollisionsresistent**: Es ist sehr schwierig, zwei verschiedene Eingaben mit demselben Hash zu finden.

**Typische Anwendungen:**

- Digitale Signaturen und Zertifikate
- Integritätsprüfungen und Prüfsummen
- HMAC-Konstruktionen
- Dateiüberprüfung und Datenpipelines
- Protokolle, die 224-Bit-Hashes erfordern

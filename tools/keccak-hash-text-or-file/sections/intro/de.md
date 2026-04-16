## Was ist Keccak?

Keccak ist eine Familie kryptographischer Hash-Funktionen, die als Grundlage für den SHA-3 (Secure Hash Algorithm 3) Standard dient. Entwickelt von Guido Bertoni, Joan Daemen, Michaël Peeters und Gilles Van Assche, gewann es 2012 den NIST Hash-Funktions-Wettbewerb.

**Hauptmerkmale:**

- **Schwamm-Konstruktion**: Verwendet ein innovatives Schwamm-Funktions-Design mit Absorptions- und Auspress-Phasen
- **Variable Ausgabelänge**: Kann Hash-Ausgaben jeder gewünschten Länge produzieren
- **Hohe Sicherheitsmarge**: Mit erheblichen Sicherheitsreserven entwickelt
- **Anders als SHA-1/SHA-2**: Basiert auf völlig anderen mathematischen Prinzipien
- **Keccak[c=2d] Variante**: Diese Implementierung verwendet die ursprüngliche Keccak-Spezifikation mit Kapazität c = 2d (wobei d die Ausgabelänge ist)

**Unterschiede zwischen Keccak und SHA-3 (FIPS 202):**
🔍 **Wichtige Unterscheidung**: Das ursprüngliche Keccak und das standardisierte SHA-3 sind **nicht identisch**:

- **Ursprüngliches Keccak**: Verwendet Kapazität c = 2d und anderes Padding (Keccak-Padding: 0x01)
- **FIPS 202 SHA-3**: Verwendet Kapazität c = 2d aber anderes Padding (SHA-3-Padding: 0x06)
- **Domain-Trennung**: Der Padding-Unterschied stellt sicher, dass Keccak und SHA-3 unterschiedliche Ausgaben für dieselbe Eingabe produzieren
- **Dieses Tool implementiert**: Die **ursprüngliche Keccak-Spezifikation** mit Keccak[c=2d] Parametrisierung

**Sicherheitsstatus:**
✅ **Keccak gilt als hochsicher** ohne bekannte praktische Angriffe. Es bietet exzellente Sicherheitsmargen und Widerstand gegen verschiedene kryptoanalytische Techniken.

**Häufige Verwendungen:**

- Ethereum-Blockchain (verwendet ursprüngliches Keccak-256)
- Akademische Forschung und kryptographische Protokolle
- Anwendungen, die Hash-Ausgaben variabler Länge benötigen
- Systeme, die Alternativen zur SHA-2-Familie benötigen
- Blockchain- und Kryptowährungs-Implementierungen

**Vorteile gegenüber traditionellen Hashes:**

- Grundlegend anderes Design reduziert Risiko verwandter Angriffe
- Flexible Ausgabelänge (nicht auf feste Größen beschränkt)
- Starke theoretische Sicherheitsgrundlage
- Widerstand gegen Längenerweiterungs-Angriffe
- Exzellente Leistung auf verschiedenen Plattformen

**Technischer Hinweis:**

- **Keccak-256**: Produziert 256-Bit-Ausgabe (häufigste Variante)
- **Kapazitäts-Formel**: c = 2d stellt angemessenes Sicherheitsniveau sicher
- **Ethereum-Verwendung**: Ethereum verwendet spezifisch ursprüngliches Keccak-256, nicht SHA3-256

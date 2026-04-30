## Was ist die JWK ↔ PEM-Konvertierung?

JWK (JSON Web Key) ist ein JSON-basiertes Format für kryptografische Schlüssel, das in JOSE/JWT-Systemen verwendet wird. Es kann RSA-, EC- oder OKP-Schlüssel darstellen und in einem JWK Set (JWKS) enthalten sein.

PEM ist ein Base64-kodierter ASN.1/DER-Schlüssel mit Kopfzeilen wie BEGIN PUBLIC KEY oder BEGIN PRIVATE KEY und ist in TLS, OpenSSL und vielen SDKs üblich.

Dieses Tool konvertiert Schlüssel in beide Richtungen und bewahrt das Schlüsselmaterial, während öffentliche (SPKI) oder private (PKCS8) Ausgaben gewählt werden. Unterstützte Formate sind RSA, EC (P-256/384/521) und OKP-Schlüsselcontainer, alles lokal im Browser.

Wählen Sie JWK → PEM, wenn eine Bibliothek, ein Gateway oder eine CLI OpenSSL-ähnliche Schlüsseldateien erwartet. Wählen Sie PEM → JWK, wenn Sie einen Schlüssel in ein JWKS einbetten, über JSON-basierte Konfiguration weitergeben oder in Browser- bzw. Serverless-Umgebungen verwenden müssen. Bei privaten Schlüsseln bleibt das private Material erhalten, teilen Sie also nur die öffentliche Ausgabe, wenn mehr nicht nötig ist.

- Nutzen Sie einen JWK/JWKS-Schlüssel in Systemen, die nur PEM akzeptieren.
- Exportieren Sie PEM-Schlüssel für JWT-Bibliotheken, API-Gateways oder die Schlüsselverteilung.
- Teilen Sie öffentliche Schlüssel sicher, ohne private Schlüsseldaten preiszugeben.

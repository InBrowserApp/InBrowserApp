## Was ist die JWK ↔ PEM-Konvertierung?

JWK (JSON Web Key) ist JSON-förmiges Schlüsselmaterial für JOSE/JWT, JWKS-Endpunkte sowie Serverless- und Browser-Konfigurationen. Es ist für Software leicht lesbar, wird aber von CLIs und Infrastruktur, die Schlüsseldateien erwarten, seltener akzeptiert.

PEM umschließt DER-Schlüsseldaten mit BEGIN/END-Zeilen. Genau dieses Format verlangen OpenSSL, TLS-Werkzeuge, API-Gateways und viele SDKs typischerweise.

Dieser Konverter überbrückt beide Formate lokal in deinem Browser. Er verarbeitet RSA-, EC- (P-256/384/521) und OKP-Schlüsselcontainer, erzeugt aus JWK wahlweise öffentliche SPKI- oder private PKCS8-PEM-Ausgabe und kann unterstützte PEM-Blöcke wieder in formatiertes oder kompaktes JWK-JSON umwandeln.

Nutze öffentliche Ausgabe, wenn du nur Verifikation oder Verteilung brauchst. Private Konvertierungen zeigen privates Schlüsselmaterial auf dem Bildschirm und in Downloads, behandle das Ergebnis daher wie ein Geheimnis und schließe den Tab danach.

- Verschiebe Schlüssel zwischen JWKS/JSON-Konfiguration und OpenSSL-artigen PEM-Dateien.
- Extrahiere einen öffentlichen Schlüssel, bevor du ihn mit JWT-Prüfern, Gateways oder Clients teilst.
- Konvertiere lokal, ohne Schlüsselmaterial auf einen Server hochzuladen.

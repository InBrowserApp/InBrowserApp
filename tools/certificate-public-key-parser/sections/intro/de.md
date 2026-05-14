## Was ist ein X.509 Zertifikat-Parser?

Ein X.509 Zertifikat ist ein signiertes Dokument, das einen Public Key an eine Identität wie eine Domain, einen Dienst, eine Organisation oder eine Person bindet. TLS-Zertifikate, Certificate-Chain-Dateien und viele S/MIME- oder Signatur-Workflows verwenden dieses Format.

Dieser Parser liest Zertifikats- und Public-Key-Material direkt in deinem Browser. Er kann PEM-Blöcke, binäre DER-Dateien und base64 DER-Text prüfen und anschließend Subject, Issuer, Seriennummer, Gültigkeitszeitraum, Signaturalgorithmus, Public-Key-Algorithmus, Fingerprints und gängige Erweiterungen anzeigen.

Verwende ihn, wenn du einen Zertifikats-Fingerprint vergleichen, prüfen musst, ob ein Zertifikat zum erwarteten Host gehört, Subject Alternative Names inspizieren, Key Usage bestätigen oder Public-Key-Details beim Debuggen von TLS- und Deployment-Problemen extrahieren möchtest.

Das Tool validiert keine Trust Chains und kontaktiert keine Certificate Authorities. Es zeigt, was im bereitgestellten Zertifikat oder Public Key kodiert ist. Verwende daher einen dedizierten TLS-Scanner, wenn du Revocation-, Chain-, Hostname- oder Live-Endpoint-Validierung benötigst.

- Vergleiche SHA-256 oder SHA-1 Fingerprints, bevor du Zertifikate installierst oder rotierst.
- Prüfe SAN, Key Usage, Extended Key Usage und Basic Constraints, ohne Zertifikatsmaterial hochzuladen.
- Inspiziere eigenständige SPKI Public Keys, wenn ein Dienst dir nur eine Public-Key-PEM- oder DER-Datei bereitstellt.

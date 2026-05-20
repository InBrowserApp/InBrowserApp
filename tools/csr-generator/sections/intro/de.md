## Was ist ein CSR?

Eine Certificate Signing Request (CSR) ist ein kleines PKCS#10-Dokument, das eine Zertifizierungsstelle (CA) benötigt, um ein TLS- oder Code-Signing-Zertifikat auszustellen. Es enthält die öffentliche Hälfte eines Schlüsselpaares, die Identität, die die CA bestätigen soll (das Subject), sowie zusätzliche Bezeichner wie DNS-Namen oder IP-Adressen (die Subject Alternative Names, kurz SAN) – alles signiert mit dem zugehörigen Privatschlüssel.

Dieses Tool erstellt den CSR vollständig in Ihrem Browser mithilfe der Web Crypto API und [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Weder Ihr Schlüssel noch Ihre Anfrage werden an einen Server übertragen.

## Wann dieses Tool verwenden

- Ein TLS-Zertifikat bei einer öffentlichen CA (Let's Encrypt, DigiCert, ZeroSSL, Sectigo usw.) anfordern, wenn deren Ablauf das Einfügen eines eigenen CSR erfordert.
- Einen CSR für eine interne Zertifizierungsstelle – ACME-basiert, smallstep, EJBCA, AD CS – generieren, ohne einem gehosteten Formular vertrauen zu müssen.
- Ein Zertifikat mit demselben Privatschlüssel neu ausstellen, indem ein vorhandener PKCS#8-PEM-Schlüssel importiert und lediglich ein neuer CSR signiert wird.

## Formular ausfüllen

- **Schlüsselquelle** — _Neu generieren_ wählen, um ein neues Schlüsselpaar zu erstellen, oder _Vorhandenen importieren_, um einen unverschlüsselten PKCS#8-PEM-Schlüssel einzufügen. Verschlüsselte Schlüssel sowie `RSA PRIVATE KEY`- und `EC PRIVATE KEY`-Blöcke im Legacy-Format werden nicht akzeptiert; diese zuerst mit `openssl pkcs8 -topk8 -nocrypt` konvertieren.
- **Algorithmus** — RSA bietet die breiteste Kompatibilität als Standard. ECDSA erzeugt kleinere Signaturen und wird von modernen CAs und TLS-Clients weitgehend unterstützt.
- **Subject** — Die meisten öffentlichen CAs ignorieren alles außer dem Common Name und verwenden die DNS-SAN-Liste als maßgeblich, private CAs können jedoch einen vollständigen DN erfordern.
- **SAN-Einträge** — Die Hostnamen, IP-Adressen, E-Mail-Adressen oder URIs auflisten, die das Zertifikat abdecken soll. Ein Eintrag pro Zeile oder kommagetrennt.

## Wichtige Hinweise

- Der neben dem CSR angezeigte Privatschlüssel wird lokal generiert und verlässt niemals den Browser. Vor dem Schließen des Tabs speichern – ohne den passenden Privatschlüssel ist das signierte Zertifikat unbrauchbar.
- Öffentliche CAs verlangen, dass der Common Name (oder mindestens ein SAN-Eintrag) ein DNS-Name ist, den sie validieren können. IP-Adressen als SAN sind hauptsächlich für interne Zertifikate nützlich.
- Der generierte Privatschlüssel ist unverschlüsselt. Falls erforderlich, vor der Ablage eine Passphrase mit `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` hinzufügen.
- Nur RSA (2048/3072/4096) und ECDSA (P-256/P-384/P-521) werden unterstützt. EdDSA wurde bewusst weggelassen, da die Browser- und CA-Unterstützung noch uneinheitlich ist.

## Was ist BLAKE3?

BLAKE3 ist eine moderne kryptographische Hash-Funktion, die von BLAKE2 abgeleitet ist. Sie ist für sehr hohe Leistung und Parallelität ausgelegt und bietet dabei starke Sicherheit. Sie erzeugt standardmäßig einen 256-Bit-Hash und unterstützt eine erweiterbare Ausgabelänge (XOF).

**Hauptmerkmale:**

- **Erweiterbare Ausgabelänge**: Kann Hashes beliebiger Länge erzeugen
- **Hohe Leistung**: Schnell und auf modernen CPUs parallelisierbar
- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash
- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben
- **Irreversibel**: Rechnerisch nicht machbar, den Hash umzukehren, um die ursprüngliche Eingabe zu finden
- **Kollisionsresistent**: Sehr schwierig, zwei unterschiedliche Eingaben mit demselben Hash zu finden
- **Schlüssel-Hash**: Unterstützt einen optionalen 32-Byte-Schlüssel für MAC-Funktionalität
- **Schlüsselableitung**: Kann Unterschlüssel aus Schlüsselmaterial und Kontext ableiten

**Häufige Verwendungen:**

- Datei-Integritätsprüfung
- Inhaltsadressierte Speicherung und Deduplizierung
- Digitale Signaturen und Zertifikate
- Passwortspeicherung und Authentifizierung
- Kryptographische Protokolle und Systeme

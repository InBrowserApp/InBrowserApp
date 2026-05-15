Die Hash-Tools-Sammlung bündelt die migrierten Hashing-Werkzeuge, damit du den passenden Algorithmus auswählen kannst, bevor du ein einzelnes Tool öffnest. Sie deckt alltägliche Datei-Digests, Legacy-Kompatibilitätsprüfungen, schlüsselbasierte Nachrichtenauthentifizierung, Subresource-Integrity-Zeichenfolgen, Passwort-Hashing, Passwortverifizierung und schnelle nicht-kryptografische Prüfsummen ab.

## Wann diese Tools sinnvoll sind

Nutze die kryptografischen Digest-Tools, wenn du einen wiederholbaren Fingerabdruck für Text oder eine Datei brauchst, zum Beispiel um ein heruntergeladenes Archiv mit einer veröffentlichten SHA-256-Prüfsumme zu vergleichen. Nutze HMAC, wenn das Ergebnis belegen muss, dass jemand mit einem gemeinsamen Geheimnis die Nachricht erstellt oder autorisiert hat. Nutze Argon2, bcrypt, PBKDF2 oder scrypt für Passwort- und Schlüsselableitungs-Workflows, bei denen konfigurierbare Kosten wichtiger sind als reine Geschwindigkeit.

## Sicher auswählen

Nicht jeder Hash eignet sich für Sicherheit. MD4, MD5 und SHA-1 sind für Legacy-Systeme und Kompatibilitätsprüfungen nützlich, sollten aber nicht für neue sicherheitsrelevante Integritätskonzepte verwendet werden. CRC, Adler-32, MurmurHash, CityHash und xxHash sind schnelle Prüfsummen oder Bucketing-Hashes, keine manipulationssicheren Signaturen. Wenn du unsicher bist, bevorzuge SHA-256 für öffentliche Prüfsummen, HMAC-SHA-256 für schlüsselbasierte Verifizierung und Argon2id oder bcrypt für die Passwortspeicherung.

## Datenschutz und Workflow

Die einzelnen Tools in dieser Sammlung laufen im Browser. Text und Dateien werden lokal vom ausgewählten Tool verarbeitet, sofern dieses Tool nicht ausdrücklich eine öffentliche Lookup-Funktion dokumentiert; die Hash-Tools brauchen das nicht. Lösche bei sensiblem Material erzeugte Werte nach der Verwendung und vermeide es, Geheimnisse in geteilte oder aufgezeichnete Browsersitzungen einzufügen.

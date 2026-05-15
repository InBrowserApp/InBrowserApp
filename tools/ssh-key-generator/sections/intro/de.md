## Was ist ein SSH-Schlüsselpaar?

Ein SSH-Schlüsselpaar besteht aus einem öffentlichen und einem privaten Schlüssel, mit denen du dich bei Servern, Git-Hosts, Deployment-Systemen und anderen SSH-basierten Diensten authentifizierst. Der öffentliche Schlüssel kann geteilt werden. Der private Schlüssel muss geheim bleiben.

Dieser Generator erstellt Ed25519- oder RSA-Schlüssel im OpenSSH-Format vollständig in deinem Browser. Er zeigt auch den SHA-256-Fingerabdruck an, also den kompakten Wert, den OpenSSH beim Prüfen eines Schlüssels üblicherweise anzeigt.

## Wann du dieses Tool verwenden solltest

- Erstelle einen Entwicklungsschlüssel für einen Testserver, ein Git-Remote, einen Container oder eine temporäre Laborumgebung.
- Erzeuge einen Ed25519-Schlüssel, wenn du einen modernen, kompakten Standard für neuen SSH-Zugriff brauchst.
- Erzeuge einen RSA-Schlüssel, wenn ein älterer Dienst Ed25519 nicht unterstützt.
- Kopiere einen öffentlichen Schlüssel nach `authorized_keys` und behalte den privaten Schlüssel auf deinem Gerät.

## So wählst du einen Algorithmus aus

Ed25519 ist für die meisten neuen SSH-Schlüssel die beste Voreinstellung, weil es klein, schnell und von aktuellen OpenSSH-Versionen breit unterstützt wird. RSA ist nützlich für Kompatibilität mit älteren Appliances, Legacy-Git-Servern oder Richtlinien, die weiterhin RSA-Schlüssel erwarten.

Für RSA sind 4096 Bit eine konservative Voreinstellung. Kleinere 2048-Bit-Schlüssel sind schneller und weiterhin verbreitet, aber viele Teams bevorzugen für neue langlebige Schlüssel inzwischen 3072 oder 4096 Bit.

## Was du beachten solltest

- Der hier erzeugte private Schlüssel ist unverschlüsselt. Füge mit `ssh-keygen -p -f <key-file>` eine Passphrase hinzu, falls du eine brauchst.
- Speichere den privaten Schlüssel mit restriktiven Berechtigungen, zum Beispiel `chmod 600 <key-file>`.
- Füge private Schlüssel nicht in Tickets, Chats, Logs oder unbekannte Webseiten ein.
- Wechsle Schlüssel aus, wenn ein Laptop, ein CI-Secret oder ein Backup mit dem privaten Schlüssel möglicherweise offengelegt wurde.

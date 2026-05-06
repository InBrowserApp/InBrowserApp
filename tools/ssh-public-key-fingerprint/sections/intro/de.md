## Was ist ein SSH-Public-Key-Fingerprint?

Ein SSH-Public-Key-Fingerprint ist ein kurzer Digest des Public-Key-Blobs. Er liefert Ihnen einen kompakten Wert, den Sie vergleichen können, bevor Sie einem Key in `authorized_keys`, einem Serverinventar oder einem Deployment-Workflow vertrauen.

OpenSSH zeigt häufig SHA-256-Fingerprints wie `SHA256:...` an. Ältere Dokumentation und einige Audits verwenden weiterhin durch Doppelpunkte getrennte MD5-Fingerprints. Dieses Tool zeigt beides, damit Sie moderne SSH-Ausgaben und Legacy-Einträge abgleichen können, ohne den Key irgendwohin zu senden.

Fügen Sie einen einzelnen Public Key, mehrere `authorized_keys`-Zeilen oder einen SSH2-Public-Key-Block ein. Der Parser überspringt Kommentare und authorized_keys-Optionen, liest den eigentlichen SSH-Key-Blob und berechnet die Fingerprints lokal in Ihrem Browser.

- Prüfen Sie, ob ein kopierter Public Key mit dem von einem Teammitglied geteilten Fingerprint übereinstimmt.
- Vergleichen Sie `authorized_keys`-Einträge mit einer Server-Zugriffsliste.
- Prüfen Sie Key-Typ, Key-Größe, Kurve und Kommentar, bevor Sie einen Fingerprint kopieren.

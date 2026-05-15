## Was ist Argon2-Verifizierung?

Die Argon2-Verifizierung prüft, ob ein Klartextpasswort denselben kodierten Argon2-Hash erzeugt, der zuvor gespeichert wurde. Der kodierte Hash enthält die Argon2-Variante, Kostenparameter, Salt und Digest, sodass ein Verifizierer dieselbe Arbeit wiederholen kann, ohne separate Einstellungen zu benötigen.

## Wann dieses Tool verwenden?

- Bestätige, dass ein kopiertes Passwort und ein gespeicherter Argon2-Hash zusammengehören
- Debugge Login- oder Migrationsprobleme beim Verschieben von Passwortdatensätzen zwischen Systemen
- Prüfe die Variante und Kostenparameter in einem kodierten Argon2-Hash
- Teste Hashes, die ein optionales serverseitiges secret verwenden, oft pepper genannt

## Sicher verifizieren

1. Füge das Passwort ein, das du prüfen möchtest.
2. Füge den vollständigen kodierten Hash ein, zum Beispiel einen String, der mit `$argon2id$` beginnt.
3. Gib das secret nur ein, wenn der ursprüngliche Hash mit einem erstellt wurde.
4. Starte die Verifizierung und lies das Ergebnis für Treffer, Nichtübereinstimmung oder ungültigen Hash.

## Sicherheitshinweise

Die Verifizierung findet lokal in deinem Browser statt, aber eingefügte Passwörter und Hashes können trotzdem im Browserspeicher bleiben, bis du das Formular zurücksetzt oder den Tab schließt. Vermeide es, Produktionszugangsdaten auf gemeinsam genutzten Geräten zu verwenden. Für neue Passwortspeichersysteme ist Argon2id normalerweise die bevorzugte Argon2-Variante, weil sie Seitenkanal- und GPU-Resistenz ausbalanciert.

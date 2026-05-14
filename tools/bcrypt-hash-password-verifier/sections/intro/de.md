## Was dieses Tool tut

Prüfen Sie, ob ein Klartextpasswort zu einem bcrypt-Passwort-Hash passt. Das ist hilfreich, wenn Sie Anmeldecode debuggen, importierte Benutzerdatensätze prüfen oder bestätigen, dass eine Passwortmigration kompatible Hashes beibehalten hat.

## Akzeptierte Eingabe

Fügen Sie einen standardmäßigen bcrypt-Hash wie `$2b$10$...` ein und geben Sie das Passwort ein, das Sie testen möchten. Der Prüfer akzeptiert die Präfixe `$2a$`, `$2b$` und `$2y$` mit Kostenfaktoren von `04` bis `31`.

## Ergebnis lesen

Ein passendes Ergebnis bedeutet, dass bcrypt das Passwort für diesen Hash akzeptiert hat, einschließlich des Salts und des Kostenfaktors, die in der Hash-Zeichenfolge eingebettet sind. Eine Nichtübereinstimmung bedeutet, dass das Passwort nicht verifiziert wurde; sie beweist nicht, dass der Hash selbst unsicher ist. Fehler bei ungültigen Hashes bedeuten normalerweise, dass Präfix, Kostenfaktor, Länge oder bcrypt-Base64-Zeichen fehlerhaft formatiert sind.

## Datenschutz- und Sicherheitshinweise

- Die Prüfung läuft lokal in Ihrem Browser.
- Passwörter und Hashes werden nicht im lokalen Speicher gespeichert.
- bcrypt ist für die Passwortspeicherung konzipiert, nicht für allgemeine Datei-Prüfsummen.
- Verwenden Sie dieses Tool zum Debuggen und Validieren, nicht als einzige Prüfung eines produktiven Authentifizierungssystems.

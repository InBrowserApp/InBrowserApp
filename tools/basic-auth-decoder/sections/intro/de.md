## Was das Tool macht

Dekodieren Sie den HTTP Basic Authorization Header, um Benutzername und Passwort aus Base64 zu extrahieren. Nützlich zum Debuggen und API-Tests.

## Akzeptierte Eingaben

Füge einen Header wie diesen ein: Basic dXNlcjpwYXNz
Das Tool akzeptiert auch eine vollständige `Authorization: Basic ...`-Zeile.

## Hinweise

- Base64 kodiert Zugangsdaten lediglich; es schützt sie nicht.
- Der Decoder trennt am ersten `:` und behandelt den Rest als Passwort.
- Alles läuft lokal in deinem Browser.

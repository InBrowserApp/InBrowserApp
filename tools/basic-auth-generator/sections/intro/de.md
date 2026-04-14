## Was ist Basic Auth?

Basic Auth legt `username:password` nach einer Base64-Kodierung in den `Authorization`-Header. Es ist einfach und weit verbreitet, aber Base64 ist nur eine Kodierung und keine Verschlüsselung.

## Was dieses Tool erzeugt

- Einen `Authorization: Basic ...`-Header zum Einfügen in API-Clients.
- Ein direkt nutzbares `curl`-Beispiel für schnelle Tests.
- Alles läuft lokal im Browser.

## Was du beachten solltest

- Verwende HTTPS, sobald du Basic-Auth-Zugangsdaten sendest.
- Jeder, der den Header sieht, kann Benutzername und Passwort wieder dekodieren.
- Basic Auth eignet sich für interne Tools, Staging-Umgebungen und schnelle API-Prüfungen.

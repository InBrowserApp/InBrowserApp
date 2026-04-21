## Was analysiert dieses Tool?

Füge entweder einen Cookie-Request-Header oder eine oder mehrere Set-Cookie-Response-Zeilen ein. Der Parser extrahiert Namen, Werte und fehlerhafte Fragmente als strukturiertes JSON für eine schnelle Prüfung.

## Cookie vs. Set-Cookie

Verwende Cookie für den Header, den ein Browser an den Server zurücksendet. Verwende Set-Cookie für Response-Header mit Attributen wie Path, Max-Age, SameSite, Secure oder HttpOnly.

## Tipps für sauberere Ergebnisse

- Du kannst vollständige Header-Zeilen oder rohe Cookie-Paare einfügen.
- Mehrere Set-Cookie-Zeilen werden unterstützt.
- Ungültige Fragmente werden separat aufgeführt, damit fehlerhafte Paare oder Attribute leicht auffallen.

## Was ist HMAC?

HMAC (Hash-based Message Authentication Code) ist ein kryptografischer Mechanismus, der einen geheimen Schlüssel mit einer Hash-Funktion kombiniert, um sowohl die Datenintegrität als auch die Authentizität einer Nachricht zu verifizieren.

**Wie es funktioniert:**

1. Der geheime Schlüssel wird mit der Nachricht kombiniert
2. Eine Hash-Funktion (wie SHA-256) verarbeitet die kombinierten Daten
3. Das Ergebnis ist ein Authentifizierungscode fester Größe

**Häufige Anwendungsfälle:**

- **API-Authentifizierung**: Signierung von API-Anfragen zur Überprüfung des Absenders
- **JWT-Tokens**: Verwendet in HS256/HS384/HS512-Algorithmen
- **Nachrichtenverifizierung**: Sicherstellen, dass Daten nicht manipuliert wurden
- **Webhook-Signaturen**: Validierung von Webhook-Payloads

**Sicherheitshinweise:**

- Verwenden Sie immer einen starken, zufälligen geheimen Schlüssel
- Halten Sie Ihren geheimen Schlüssel vertraulich
- SHA-256 oder höher wird für neue Anwendungen empfohlen
- SHA-1 gilt als schwach und sollte für sicherheitskritische Zwecke vermieden werden

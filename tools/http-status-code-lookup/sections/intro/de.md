## Was ist ein HTTP-Statuscode?

HTTP-Statuscodes sind dreistellige Antwortcodes, die ein Server zurueckgibt, um zu zeigen, was mit einer Anfrage passiert ist. Man sieht sie haeufig in Browser-Entwicklertools, API-Antworten, Server-Logs, Uptime-Pruefungen und Reverse-Proxy-Dashboards.

### So liest du die wichtigsten Statuscode-Gruppen

- **1xx Informativ:** Der Server hat die Anfrage erhalten und die Verarbeitung laeuft noch.
- **2xx Erfolg:** Die Anfrage wurde erfolgreich abgeschlossen.
- **3xx Umleitung:** Der Client muss einem anderen Ziel folgen oder ein gecachtes Ergebnis wiederverwenden.
- **4xx Client-Fehler:** Die Anfrage selbst hat ein Problem, etwa eine fehlende Ressource, ungueltige Eingaben oder fehlgeschlagene Authentifizierung.
- **5xx Server-Fehler:** Der Server oder ein Upstream-Dienst ist bei der Verarbeitung einer gueltigen Anfrage fehlgeschlagen.

### Wann dieses Lookup hilfreich ist

Nutze dieses Tool, wenn du die Bedeutung eines Codes bestaetigen, aehnliche Codes wie 401 und 403 oder 502 und 504 vergleichen oder nach einem Ausdruck aus einer Fehlermeldung suchen willst. Die Suche funktioniert nach Code, Statusname und lokalisierter Beschreibung.

### Warum die richtige Einordnung wichtig ist

Beim Debuggen ist der Statuscode oft der schnellste Hinweis. Eine 4xx-Antwort zeigt meist auf die Anfrage, Zugangsdaten oder die Zielressource. Eine 5xx-Antwort zeigt eher auf die Anwendung, ein Gateway oder einen Upstream-Service. Wer zuerst die Kategorie liest, waehlt den naechsten Schritt schneller.

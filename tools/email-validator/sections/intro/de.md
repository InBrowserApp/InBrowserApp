## Was ist E-Mail-Validierung?

Die E-Mail-Validierung prüft, ob eine Adresse gängigen Syntaxregeln für den lokalen Teil, das `@`-Zeichen, Domain-Labels und die Top-Level-Domain folgt. Sie eignet sich für Formular-Tests, die Bereinigung von Beispieldaten und das Erkennen offensichtlicher Tippfehler vor dem Absenden.

### Was dieser Validator prüft

- Ein einzelnes `@`, das lokalen Teil und Domain trennt
- Längenlimits für die gesamte Adresse, den lokalen Teil und die Domain
- Erlaubte Zeichen, Punktplatzierung, Bindestrichregeln und TLD-Struktur
- Ein normalisiertes Ergebnis mit kleingeschriebener Domain zum Vergleichen

### Beispiele

- Gültig: `name@example.com`
- Gültig: `first.last+news@example.co.uk`
- Ungültig: `name..dots@example.com`
- Ungültig: `user@-example.com`

Internationalisierte Domains sollten in Punycode-ASCII eingegeben werden, zum Beispiel `user@xn--bcher-kva.example`.

### Was dieses Tool nicht prüft

- Ob das Postfach existiert oder E-Mails empfangen kann
- DNS-, MX-, SMTP- oder Wegwerf-Anbieter-Prüfungen
- Ob eine Website die Adresse nach ihren eigenen Geschäftsregeln akzeptiert

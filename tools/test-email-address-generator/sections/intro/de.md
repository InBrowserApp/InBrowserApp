## Eine Liste mit Test-E-Mail-Adressen generieren

Wähle eine Domain, gib die Anzahl ein und wähle **Generieren**. Mit **Beliebige Beispieldomain** mischst du Domains in einer Liste. Jede Adresse erscheint pro Liste nur einmal. Kopiere die Ergebnisse in ein Formular oder eine Tabelle oder lade eine UTF-8-Textdatei mit einer Adresse pro Zeile für deine Testdaten herunter.

## Welche E-Mail-Domains kann ich verwenden?

Faker.js generiert Adressen mit `example.com`, `example.net` und `example.org`. Diese [reservierten Beispieldomains](https://www.iana.org/help/example-domains) werden in Dokumentationen und Beispieldaten verwendet. In `alex.morgan42@example.com` ist der Teil vor `@` der lokale Teil und `example.com` die Domain. Verwende eine Domain, wenn dein Test einen festen Wert erwartet, oder mische Domains, um Filter und Importe zu testen.

## Was kann ich mit diesen Adressen testen?

Mit diesen Beispielen kannst du Eingaben in Registrierungsformularen, E-Mail-Formate, Kontolisten oder die Deduplizierung in einer Datenbank testen. Der Generator erzeugt nur Adresstext und erstellt keine Postfächer. Für Tests der Zustellung oder von Bestätigungslinks verwende ein Postfach, das du kontrollierst, oder die Mail-Sandbox deiner Entwicklungsumgebung.

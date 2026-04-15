## Wofür dieses Tool gedacht ist

Verwenden Sie diesen Konverter, um ein lokales Datum und eine lokale Uhrzeit in einer IANA-Zeitzone in die entsprechende Ortszeit einer anderen Zeitzone umzuwandeln. Das ist hilfreich, wenn Sie Zeitpläne zwischen Städten vergleichen müssen, ohne Offsets manuell zu addieren oder raten zu müssen, ob die Sommerzeit aktiv ist.

## Häufige Anwendungsfälle

- Prüfen, ob ein Termin in Tokio in New York oder London auf denselben Kalendertag fällt.
- Offsets prüfen, bevor Sie Zeitpläne, Warnmeldungen oder Supportzeiten veröffentlichen.
- Die passenden ISO 8601-, UTC- oder Unix-Zeitstempelwerte für Logs und APIs kopieren.

## So funktioniert dieser Konverter

- Geben Sie auf einer der beiden Seiten ein lokales Datum mit Uhrzeit im Format `YYYY-MM-DD HH:mm:ss.SSS` ein und wählen Sie anschließend Quell- und Zielzeitzone.
- Die zuletzt bearbeitete Seite wird zur Referenz. Das Tool wandelt diesen Zeitpunkt intern zuerst in UTC um und zeigt dann die entsprechende Ortszeit in der anderen Zeitzone an.
- Mit `Now` füllen Sie schnell die aktuelle Zeit ein, mit `Swap` kehren Sie die Vergleichsrichtung um. Rund um Sommerzeitwechsel können sich Offsets ändern.

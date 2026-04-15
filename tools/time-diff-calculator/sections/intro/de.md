## Wofür dieses Tool gedacht ist

Mit diesem Rechner misst du die genaue verstrichene Zeit zwischen zwei
lokalen Datums- und Zeitwerten, auch wenn sie zu unterschiedlichen IANA
Zeitzonen gehören. Das ist hilfreich, wenn du eine verlässliche Antwort
brauchst, ohne Offsets manuell umzurechnen oder die Wirkung der
Sommerzeit zu erraten.

## Häufige Anwendungsfälle

- Eine Startzeit in einer Stadt mit einer Endzeit in einer anderen
  Stadt vergleichen.
- Die verstrichene Zeit zwischen Logs, Vorfällen, Flügen oder
  Supportfenstern messen, die in verschiedenen Zeitzonen erfasst
  wurden.
- Prüfen, ob zwei Zeitstempel Mitternacht, ein Wochenende oder eine
  Sommerzeitumstellung überschreiten.

## So funktioniert dieser Rechner

- Gib Start- und Enddatum mit lokaler Uhrzeit im Format
  `YYYY-MM-DD HH:mm:ss.SSS` ein und wähle dann für jede Seite die
  Zeitzone.
- Das Tool wandelt beide Zeitstempel intern in UTC um und zeigt dann
  die vorzeichenbehaftete Dauer, die absolute Dauer, die ISO 8601
  Dauer sowie die Summen von Millisekunden bis Tagen an.
- Verwende `Now`, um schnell die aktuelle Zeit einzusetzen, oder
  `Swap`, um den Vergleich umzudrehen. Offsets können sich rund um
  Sommerzeitwechsel ändern.

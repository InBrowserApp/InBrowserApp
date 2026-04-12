## Wofuer dieses Tool gedacht ist

Mit diesem Tool vergleichst du die Uhr deines Geraets mit einer Zeitangabe aus
dem Netzwerk. Es ruft einen Zeitstempel vom Cloudflare-Trace-Endpunkt ab,
schaetzt den Mittelpunkt der Anfragelatenz und zeigt daraus die Netzwerkzeit
im Browser an.

## Wo es hilft

- Zu pruefen, ob deine lokale Systemuhr vor- oder nachgeht.
- Zeitdrift zu bestaetigen, bevor du TLS, Tokens, Scheduler oder Logs
  untersuchst.
- Schnell eine netzwerkbasierte Referenzzeit zu erhalten, ohne NTP-Werkzeuge
  zu installieren.

## Worauf du achten solltest

- Der angezeigte Versatz ist eine Schaetzung und haengt von der
  Netzwerklatenz ab.
- Wenn die Trace-Anfrage fehlschlaegt, faellt das Tool bis zur naechsten
  erfolgreichen Synchronisierung auf deine lokale Uhr zurueck.
- Fuer eine praezise systemweite Korrektur solltest du die Zeitsynchronisation
  deines Geraets oder die NTP-Konfiguration anpassen.

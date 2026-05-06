## Cron-Zeitpläne verstehen, bevor sie produktiv laufen

Cron-Ausdrücke sind kompakt, aber ein kleiner Fehler in einem Feld kann dazu führen, dass ein Job deutlich häufiger oder deutlich seltener läuft als beabsichtigt. Dieser Parser validiert den Ausdruck in Ihrem Browser, erklärt den Zeitplan in verständlicher Sprache, schlüsselt jedes Feld auf und zeigt kommende Ausführungszeiten in der Vorschau an.

### Wann Sie es verwenden sollten

- Prüfen Sie einen Zeitplan für Deployment, Backup, Bereinigung oder Benachrichtigung, bevor Sie ihn einem Server, CI-System oder Task-Runner hinzufügen.
- Vergleichen Sie einen kopierten Cron-Ausdruck mit dem Zeitplan, den Sie tatsächlich erwarten.
- Lernen oder debuggen Sie Cron-Syntax, indem Sie jeweils ein Feld ändern und beobachten, wie die Erklärung aktualisiert wird.

### Unterstütztes Format

Das Tool unterstützt standardmäßige Unix-Cron-Ausdrücke mit fünf Feldern: Minute, Stunde, Tag des Monats, Monat und Wochentag. Es akzeptiert außerdem einen Ausdruck mit sechs Feldern und vorangestellten Sekunden für Scheduler, die sekundengenaue Präzision unterstützen.

### Ergebnis lesen

Die Zusammenfassung liefert eine Beschreibung in verständlicher Sprache, während die Feldtabelle zeigt, wie der Roh-Ausdruck aufgeteilt wird. Die kommenden Ausführungszeiten verwenden die lokale Zeitzone Ihres Browsers. Vergleichen Sie sie daher mit der Zeitzone des Schedulers, der den Job ausführen wird.

### Hinweise

- Wochentagswerte verwenden häufig `0` oder `7` für Sonntag; Namen wie `MON` oder `FRI` werden ebenfalls akzeptiert.
- Monatsnamen wie `JAN` oder `DEC` können Produktionszeitpläne leichter überprüfbar machen.
- Wenn Ihr Scheduler einen anderen Cron-Dialekt verwendet, prüfen Sie spezielle Tokens wie `?`, `L`, `W` oder `#` in der Dokumentation dieses Schedulers.

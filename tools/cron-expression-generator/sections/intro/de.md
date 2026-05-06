## Cron-Zeitpläne visuell erstellen

Cron-Ausdrücke sind kompakt, aber eine kleine Änderung im falschen Feld kann einen Job von "an Werktagmorgen" zu "jede Minute" verschieben. Dieser Generator gibt jedem Feld eigene Steuerelemente, damit Sie einen standardmäßigen Ausdruck mit fünf Feldern erstellen können, ohne jede Syntaxregel auswendig zu kennen.

### Wann es hilft

- Erstellen Sie Zeitpläne für CI-Jobs, Backups, Cache-Warmer, Berichte und andere wiederkehrende Aufgaben.
- Beginnen Sie mit einer bekannten Voreinstellung und passen Sie jeweils ein Feld gezielt an.
- Sehen Sie sich kommende lokale Ausführungszeiten an, bevor Sie den Ausdruck in einen Scheduler einfügen.

### So verwenden Sie es

1. Wählen Sie eine schnelle Voreinstellung oder behalten Sie den Standardausdruck bei und bearbeiten Sie jedes Feld manuell.
2. Wählen Sie, ob jedes Feld bei jedem Wert, einem Intervall, bestimmten Werten oder einem Bereich ausgeführt werden soll.
3. Prüfen Sie den generierten Ausdruck und die Vorschau der nächsten Ausführungen, kopieren Sie ihn dann in Ihren Scheduler.

### Hinweise

- Dieses Tool generiert standardmäßige Cron-Ausdrücke mit fünf Feldern: Minute, Stunde, Tag des Monats, Monat und Wochentag.
- Sonntag wird als `0` angezeigt, was von gängigen Cron-Schedulern im Unix-Stil akzeptiert wird.
- Wenn sowohl Tag des Monats als auch Wochentag eingeschränkt sind, führen viele Cron-Implementierungen die Aufgabe aus, sobald eines der Felder übereinstimmt. Einige Systeme verhalten sich anders. Prüfen Sie diese Kombination deshalb in Ihrem Ziel-Scheduler.

## Unix-Zeitstempel in ein Datum umrechnen

Fügen Sie einen Zeitstempel ein, um Datum und Uhrzeit in der Zeitzone Ihres Geräts, als UTC und im ISO-8601-Format zu sehen. Außerdem zeigt der Konverter den zeitlichen Abstand zum aktuellen Zeitpunkt an. Zum Beispiel ergeben `1704067200` Sekunden und `1704067200000` Millisekunden beide den ISO-8601-Wert `2024-01-01T00:00:00.000Z`.

## Datum in einen Unix-Zeitstempel umrechnen

Ändern Sie **Datum und Uhrzeit**, um einen lokalen Zeitpunkt in einen Unix-Zeitstempel in der gewählten Einheit umzurechnen. Mit **Jetzt** erhalten Sie den aktuellen Zeitstempel. Für Protokolle und APIs können Sie den ISO-8601-Wert mit abschließendem `Z` verwenden, wenn Sie eine eindeutige UTC-Zeit brauchen.

## Sekunden, Millisekunden oder Nanosekunden wählen

Unix-Zeitstempel geben die Zeit seit dem 1. Januar 1970 um 00:00:00 UTC an. **Auto** liest bis zu 10 Ziffern als Sekunden, 11 bis 13 als Millisekunden und längere Werte als Nanosekunden. Wenn Sie das Quellformat kennen, können Sie die Einheit manuell wählen. Das hilft bei älteren Millisekundenwerten oder wenn das angezeigte Datum unerwartet ist. Die Anzeige löst Zeitpunkte bis auf die Millisekunde auf.

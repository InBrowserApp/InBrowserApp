Erzeuge UUID-v1-Bezeichner lokal in deinem Browser, wenn du Werte benötigst, die Erstellungszeit und einen Node-Bezeichner enthalten. Dieses Tool ist nützlich für Legacy-Integrationen, Datenbankimporte, sortierbare Fixtures und Systeme, die weiterhin RFC-4122-Version-1-UUIDs erwarten.

## Wann UUID v1 Hilft

UUID v1 speichert einen Zeitstempel, eine Clock Sequence und einen 48-Bit-Node-Wert in einer standardmäßigen 36-Zeichen-UUID-Zeichenfolge. Dadurch sind erzeugte IDs grob nach Erstellungszeit sortierbar und passen dennoch in Systeme, die normale UUID-Spalten, URLs, Logs und API-Payloads akzeptieren.

## Datenschutz Und Node-Bezeichner

Die klassische UUID-v1-Erzeugung verwendete die MAC-Adresse einer echten Netzwerkkarte, wodurch Hardwareinformationen offengelegt werden können. Dieses Tool beginnt stattdessen mit einer lokal verwalteten zufälligen MAC-Adresse. Du kannst einen bestimmten Node-Wert eingeben, wenn du ein Legacy-System abgleichen musst, solltest aber echte Hardwareadressen in öffentlichen Beispielen oder geteilten Daten vermeiden.

## Clock Sequence Und Batch-Erzeugung

Die Clock Sequence ist ein 14-Bit-Wert, der Kollisionen vermeidet, wenn derselbe Node zur selben Zeit IDs erzeugt. Die Batch-Erzeugung hält alle IDs in derselben Millisekunde und erhöht den 100-Nanosekunden-Tick für jede Zeile, sodass jeder Wert im Ergebnis eindeutig bleibt.

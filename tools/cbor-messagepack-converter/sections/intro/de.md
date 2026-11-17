## Binäre API-Nutzdaten untersuchen

CBOR und MessagePack sind kompakte binäre Serialisierungsformate für strukturierte Daten. Mit diesem Konverter können Sie API-Antworten, WebSocket-Nachrichten oder zwischengespeicherte Werte als JSON untersuchen oder aus JSON binäre Nutzdaten zur Fehlersuche erstellen. Alles wird in Ihrem Browser verarbeitet; Eingaben werden weder hochgeladen noch gespeichert.

## JSON kodieren oder Bytes dekodieren

Wählen Sie das Binärformat und die Umwandlungsrichtung. Zum Kodieren geben Sie JSON ein und wählen Hex, Base64 oder Base64URL für die Ausgabe. Zum Dekodieren fügen Sie Bytes ein und wählen deren Eingabekodierung. Wenn Sie die Eingabekodierung ändern, wird der bereits im Editor vorhandene Text neu interpretiert.

Öffnen Sie beim Kodieren eine JSON-Datei oder beim Dekodieren eine rohe `.cbor`-, `.msgpack`- oder `.bin`-Datei. Kodierter Text wie Hex oder Base64 sollte in den Editor eingefügt werden. Wandeln Sie die Eingabe um und kopieren Sie anschließend den angezeigten Text oder laden Sie das Ergebnis herunter. Binäre Downloads enthalten die tatsächlichen Bytes und können erneut importiert werden.

## Werte erhalten und Grenzen verstehen

Ganzzahlliterale behalten innerhalb des vom Format unterstützten 64-Bit-Bereichs jede Ziffer. Werte, die JSON nicht darstellen kann, etwa Binärfelder, CBOR-Tags und MessagePack-Erweiterungen, erscheinen als explizite typisierte Wrapper. Aktivieren Sie Erweitertes JSON, um diese Wrapper zurück in Binärdaten zu kodieren. Lassen Sie es für gewöhnliche JSON-Objekte deaktiviert, die zufällig Wrapper-Schlüssel verwenden.

Wenn Erweitertes JSON aktiviert ist, kodiert `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` beispielsweise eine exakte Ganzzahl und zwei binäre Bytes.

Jede Umwandlung verarbeitet einen Wert mit einer Eingabegrenze von 1 MiB. Formatierte JSON-Bytes zählt das angezeigte, eingerückte JSON statt der ursprünglichen Eingabe. Erneutes Kodieren erhält unterstützte Werte, kann jedoch die Reihenfolge von Map-Einträgen oder die Wahl der Binärkodierung ändern. Öffnen Sie oben „Formate und Typerhaltung“, um die Wrapper-Syntax und nicht unterstützte Typen nachzulesen.

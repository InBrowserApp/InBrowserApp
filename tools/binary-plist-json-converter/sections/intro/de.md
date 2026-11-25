## Eine binäre Plist-Datei in JSON konvertieren

Wähle **Binäre Plist öffnen** oder ziehe eine binäre `.plist`-Datei von Apple hierher. Prüfe das formatierte JSON, kopiere es oder lade es als `.json`-Datei herunter. Binäre Eigenschaftslisten beginnen mit der Signatur `bplist00` und kommen in Apple-App-Paketen, Einstellungen und archivierten Daten vor. Das Beispiel zeigt, wie die Werte einer Eigenschaftsliste in JSON dargestellt werden.

## JSON in eine binäre Apple-Eigenschaftsliste konvertieren

Wähle **JSON zu Plist**, füge JSON ein oder öffne eine `.json`-Datei und wähle anschließend **In binäre Plist konvertieren**. Lade die erzeugte `.plist`-Datei herunter. Zeichenketten, boolesche Werte, Zahlen, Arrays und Objekte werden in die entsprechenden Typen der Eigenschaftsliste umgewandelt. Ersetze `null` durch einen Wert oder lass den zugehörigen Schlüssel weg. Dateien und eingefügter Text werden in deinem Browser verarbeitet.

## Datumswerte, Bytes und große Ganzzahlen erhalten

JSON hat keine eigenen Typen für Datumswerte, Binärdaten und UIDs aus Archiven mit Schlüsseln. Der Konverter kennzeichnet sie ausdrücklich mit `$plist`-Tags, damit ihre Bedeutung bei der Konvertierung in beide Richtungen erhalten bleibt.

| Plist-Wert                          | JSON-Beispiel                                          |
| ----------------------------------- | ------------------------------------------------------ |
| Datum in UTC                        | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bytes als Base64                    | `{"$plist":"data","value":"AQID"}`                     |
| Große Ganzzahl als Dezimaltext      | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID aus einem Archiv mit Schlüsseln | `{"$plist":"uid","value":42}`                          |
| Große Gleitkommazahl                | `{"$plist":"real","value":"1e+100"}`                   |

Behalte die Tags bei, wenn du zurück in Plist konvertierst. Für Werte außerhalb des sicheren Ganzzahlbereichs von JSON verwende den Ganzzahl-Tag und schreibe den Dezimalwert in Anführungszeichen. Entspricht ein Dictionary genau der Struktur eines Tags, wird es in einen `dictionary`-Tag eingebettet, damit seine Schlüssel erhalten bleiben. Die Konvertierung erhält die Struktur und die unterstützten Werte. Die Reihenfolge der Plist-Objekte, der Zahlentyp von Gleitkommazahlen mit ganzzahligem Wert wie `1.0` und die ursprünglichen Binärdaten können sich ändern.

[Struktur und Typen von Apple-Eigenschaftslisten](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)

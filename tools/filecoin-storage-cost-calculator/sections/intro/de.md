## Speicherkosten in Filecoin Onchain Cloud schätzen

Geben Sie die Datengröße, die **Speicherdauer (Tage)** und die Anzahl der **Kopien** ein. Der Rechner schätzt die Kosten für die Speicherung eines neuen Datensatzes pro Kopie mit Filecoin Warm Storage Service. Er zeigt den monatlichen Tarif für Speicher und Nachweise, die Ausgaben für die gewählte Laufzeit und die Gebühren für das Anlegen der Datensätze und das Hinzufügen von Pieces. Die Beträge werden in USDFC angegeben. Ein Abrechnungsmonat bei Filecoin umfasst 30 Tage.

## Wie die Speicherkosten berechnet werden

Für jeden aktiven Datensatz fällt ein von der Größe abhängiger Speichertarif sowie eine Pauschalgebühr für den Datennachweis (Proof of Data Possession, PDP) an. Bei einem Speichertarif von 2,50 USDFC pro TiB und einer Nachweisgebühr von 0,12 USDFC pro Kopie kostet die Speicherung von einem TiB mit zwei Kopien etwa 5,24 USDFC je 30 Tage. Die Schätzung verwendet die eingegebene Datengröße. Filecoin ermittelt die genau abgerechnete Größe anhand der Blattknoten, die Daten enthalten. Dadurch können bis zu 31 Bytes pro Piece hinzukommen.

## Upload-Gebühren und erstattungsfähige Rücklage einplanen

Öffnen Sie **Upload-Details**, um die Anzahl der Pieces und Upload-Stapel pro Kopie einzugeben. Die Schätzung geht zunächst von einem Upload-Stapel pro Kopie aus. Lassen Sie die Anzahl der Pieces leer, um die Mindestanzahl anhand des Uploadlimits von 63,5 GiB im Synapse SDK zu schätzen, oder geben Sie die tatsächlichen Anzahlen ein. Für jede Kopie fällt eine eigene Gebühr für das Anlegen des Datensatzes an. Beim Hinzufügen von Pieces gibt es eine Grundgebühr pro Stapel und eine Gebühr pro Piece. Der Dienst behält über den Lebenszyklus des Datensatzes eine Rücklage ein, um Vorgänge abzudecken. Die angezeigte Rücklage wird separat von den geschätzten Ausgaben ausgewiesen. Ungenutzte Mittel werden nach der Abrechnung freigegeben. Die Schätzung deckt einen neuen Upload und dessen Speicherdauer ab. Für den Abruf und spätere Vorgänge fallen eigene Gebühren an. Weitere Informationen finden Sie unter [Größenbeschränkungen des Synapse SDK](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## Woher die Filecoin-Tarife stammen

Die Seite rechnet mit den Referenztarifen, die mit Datum neben dem Ergebnis stehen. Wählen Sie **Mainnet-Tarife aktualisieren**, um den Preisvertrag von Warm Storage über einen öffentlichen Filecoin-RPC abzufragen. Der Browser verwendet die zurückgegebenen Tarife und zeigt den Block an, aus dem sie stammen. Sie können auch dann mit den Referenztarifen rechnen, wenn die Abfrage nicht verfügbar ist.

Die genau abgerechneten Datengrößen, den kontospezifischen Finanzierungsbedarf und die vollständige Gebührenübersicht finden Sie im [Filecoin-Leitfaden zu Speicherkosten](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/).

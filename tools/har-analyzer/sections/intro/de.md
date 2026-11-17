## HAR-Aufzeichnung öffnen

Exportiere eine HAR-Datei (HTTP Archive) aus dem Netzwerkbereich deines Browsers, nachdem du die zu untersuchenden Anfragen aufgezeichnet hast. Öffne die `.har`- oder `.json`-Datei hier, ziehe sie hierher oder lade das Beispiel. Es gelten Obergrenzen von 20 MiB und 20.000 Einträgen.

## Langsame oder erfolglose Anfragen finden

Suche nach URL, Methode, Status oder MIME-Typ und sortiere dann nach Startzeit, Dauer oder Übertragungsgröße. Alle Anfragen verwenden dieselbe Zeitskala, gemessen ab der frühesten Anfrage. Wähle eine Anfrage aus, um Header, Cookies, Parameter, Inhalte und Zeitphasen zu prüfen.

Der Filter für fehlgeschlagene Anfragen umfasst Status 0, 4xx und 5xx. Status 0 bedeutet, dass keine HTTP-Antwort aufgezeichnet wurde; der 3xx-Filter umfasst auch 304-Antworten zur Cache-Validierung. TLS ist Teil der Verbindungszeit.

## Aufgezeichnete Daten lesen

Die Verarbeitung erfolgt in deinem Browser. Welche Details verfügbar sind, hängt vom Export ab. Unbekannte Größen werden in den Gesamtwerten ausgelassen; die Aufzeichnungsdauer ist nicht verfügbar, wenn die Dauer einer Anfrage fehlt. Der Wasserfall verwendet weiterhin aufgezeichnete Startzeiten und bekannte Endzeiten.

Die Inhaltsvorschau bewahrt den aufgezeichneten Text. Vorschauen und ihre Kopien sowie einzelne Feldwerte sind auf 100.000 Zeichen begrenzt. Kodierte Inhalte bleiben kodiert.

## So bereinigst du eine HAR-Datei

Eine HAR-Datei (HTTP Archive) enthält aufgezeichnete Netzwerkanfragen und Antworten des Browsers. Dazu können Sitzungscookies, Zugriffstokens, URLs und Inhalte mit privaten Daten gehören. Erstelle eine bereinigte Kopie für den Support, einen Fehlerbericht oder dein Team. HTTP-Methode, Statuscode und Zeitangaben jeder Anfrage bleiben erhalten.

1. Öffne die Entwicklertools deines Browsers und wechsle zu **Netzwerk**. Stelle das Problem nach und exportiere das Protokoll als HAR-Datei. Wähle in Chrome **HAR exportieren (bereinigt)**, um eine Kopie zu erhalten, aus der die üblichen Header mit Anmeldedaten bereits entfernt wurden.
2. Öffne die exportierte HAR-Datei oder ziehe sie hierher. Sobald du die Datei auswählst, erstellt das Tool eine Kopie. Am Beispiel kannst du sehen, was sich in einer Aufzeichnung ändert.
3. Prüfe die Anzahl der Änderungen und wähle **Bereinigte HAR-Datei herunterladen**. Der Name der neuen Datei endet auf `.sanitized.har`. Du kannst sie in die Entwicklertools oder die [HAR-Netzwerkanalyse](/de/tools/har-analyzer/) importieren. Die Verarbeitung erfolgt in deinem Browser.

## Welche Daten werden entfernt oder maskiert?

Das Tool entfernt Cookies und gängige Authentifizierungsheader wie `Authorization` und `X-API-Key`. Standardmäßig maskiert es die Werte von URL-Parametern und entfernt die Inhalte von Anfragen, Antworten und aufgezeichneten WebSocket-Nachrichten. So wird etwa `?token=example&page=2` im Export zu `?token=REDACTED&page=REDACTED`. Die Parameternamen bleiben für die Fehlersuche erhalten. Jedes geänderte Feld zählt einzeln, auch wenn derselbe Wert in mehreren Feldern steht.

Deaktiviere die entsprechende Option, wenn du für die Fehlersuche die ursprünglichen Werte oder Inhalte brauchst. Hostnamen, URL-Pfade, andere Header und browserspezifische Metadaten können weiterhin private Informationen enthalten. Prüfe diese Felder, bevor du die Datei weitergibst.

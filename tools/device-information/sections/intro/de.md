## Was dieses Tool zeigt

Geräteinformationen erfasst die für den Browser sichtbaren Details des Geräts, das Sie gerade verwenden. Die Ergebnisse werden in Bereiche für Browser, Anzeige, Hardware, Netzwerk, Speicher und Funktionen gruppiert, damit Sie schnell sehen, was eine Website erkennen kann, ohne Diagnosesoftware zu installieren.

## Wann es hilft

Nutzen Sie es, wenn Sie responsive Layouts debuggen, Support-Tickets reproduzieren, Browser vergleichen, bestätigen müssen, ob Cookies oder Local Storage verfügbar sind, Anzeigeabmessungen prüfen oder einen kompakten JSON-Snapshot für einen Fehlerbericht erfassen möchten. Es ist außerdem hilfreich vor dem Testen von Canvas-, WebGL-, Zwischenablage-, Service-Worker- oder speicherabhängigen Funktionen.

## Hinweise zu Datenschutz und Genauigkeit

Das Tool läuft vollständig in Ihrem Browser und lädt den Snapshot nicht hoch. Browser blenden einige Werte absichtlich aus oder runden sie, insbesondere Details zu Speicher, CPU, GPU, Netzwerk und User Agent. Fehlende Werte bedeuten meist, dass der Browser diese API nicht bereitstellt, die Seite nicht in einem sicheren Kontext läuft oder eine Datenschutzeinstellung den Zugriff blockiert.

## So lesen Sie die Ergebnisse

Behandeln Sie die Daten als aktuelle Sicht des Browsers auf Ihre Umgebung, nicht als garantiertes Hardwareinventar. Ändern Sie die Fenstergröße oder drehen Sie das Gerät und aktualisieren Sie dann den Snapshot, um Viewport-, Ausrichtungs- und Anzeigewerte zu aktualisieren. Verwenden Sie die JSON-Kopieraktion, wenn Sie die exakt beobachteten Werte mit einem Entwickler oder Supportteam teilen müssen.

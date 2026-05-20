# PDF-Dateien in Ihrem Browser zusammenfügen

Verwenden Sie diesen PDF Merger, wenn Sie aus mehreren Quell-PDFs ein Dokument erstellen müssen, etwa um gescannte Seiten zu kombinieren, unterschriebene Formulare zusammenzufügen oder Berichte für die Weitergabe zu bündeln. Fügen Sie zwei oder mehr Dateien hinzu, prüfen Sie deren Seitenzahlen und ordnen Sie dann die Warteschlange an, bevor Sie die endgültige PDF erstellen.

## So funktioniert die Zusammenführungsreihenfolge

Das Tool hängt jede Seite der ersten PDF an, danach jede Seite der nächsten PDF, und setzt dies entlang der Warteschlange fort. Sie können Dateien mit den Pfeilsteuerungen neu anordnen, Zeilen auf dem Desktop ziehen, Fehler entfernen und jede Quelldatei vor dem Zusammenfügen in der Vorschau ansehen.

## Datenschutz und Dateiverarbeitung

Die gesamte Analyse und Zusammenführung erfolgt lokal in Ihrem Browser mit `pdf-lib` und einem Hintergrundworker. Ihre Dateien werden nicht zu InBrowser.App hochgeladen, und der erzeugte Download-Link existiert nur in der aktuellen Browsersitzung.

## Bekannte Grenzen

Verschlüsselte oder beschädigte PDFs lassen sich nicht zuverlässig zusammenfügen. Wenn eine Datei durch ein Eigentümerpasswort geschützt ist, entfernen Sie zuerst diese Beschränkung und fügen Sie die entsperrte PDF erneut hinzu. Sehr große Dateien können länger dauern, weil der Browser jede Seite in ein neues Dokument kopieren muss.

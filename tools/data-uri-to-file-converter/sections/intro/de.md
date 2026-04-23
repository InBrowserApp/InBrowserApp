## Warum Data-URIs auftauchen

Data-URIs verpacken eine Datei und ihre Metadaten in einer einzigen Zeichenfolge. Deshalb tauchen sie oft in HTML, CSS, SVG, E-Mail-Vorlagen, API-Antworten und Browser-Exporten auf. Für kleine Assets ist das praktisch, aber schwer zu prüfen, wenn man nur noch den kodierten Wert vor sich hat.

## Was dieser Konverter zeigt

Fügen Sie eine vollständige `data:`-URI ein, um sie lokal im Browser zu dekodieren. Das Werkzeug zeigt den MIME-Typ, markiert Base64 oder URL-Kodierung, kann Text, Bilder, Audio oder Video direkt vorab anzeigen und schlägt anhand des Medientyps einen Dateinamen für den Download vor.

## Was Sie vor dem Speichern prüfen sollten

Auch eine gültige Data-URI kann den falschen MIME-Typ oder eine irreführende Dateiendung tragen. Vergleichen Sie das Detailfeld mit Ihrer Erwartung, prüfen Sie die Vorschau und benennen Sie die Datei vor dem Download um, wenn Sie eine andere Endung oder einen anderen Namen brauchen.

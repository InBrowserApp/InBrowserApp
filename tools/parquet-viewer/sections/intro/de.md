## Parquet-Dateien im Browser prüfen

Öffnen Sie eine `.parquet`-Datei oder legen Sie sie hier ab, um ihre Daten durchzusehen und den physischen Typ, die logische Annotation und die Wiederholung jedes Felds zu prüfen. Verschachtelte Gruppen bleiben im Schema sichtbar. Die Zusammenfassung zeigt Zeilenanzahl, Spalten, Zeilengruppen, Komprimierung und, falls verfügbar, den Ersteller der Datei. Sie können das enthaltene Beispiel ausprobieren, ohne eine Datei auszuwählen.

## Daten durchsehen und CSV oder JSON exportieren

Die Daten werden seitenweise geladen. Navigieren Sie mit den Seitensteuerelementen durch die Datei und wählen Sie eine Zelle aus, um ihren vollständigen Wert zu lesen. Wechseln Sie zu **Schema**, um die Felder zu prüfen. Unter **Daten exportieren** können Sie die aktuelle Seite oder alle Zeilen als UTF-8-CSV oder JSON-Array herunterladen. Exporte der gesamten Datei werden in Stapeln vorbereitet und lassen sich abbrechen.

CSV enthält Spaltennamen und setzt Werte mit Kommas, Anführungszeichen oder Zeilenumbrüchen in Anführungszeichen. null-Werte werden zu leeren CSV-Feldern und bleiben in JSON `null`. Verschachtelte Werte verwenden JSON; Binärwerte verwenden Hexadezimaltext. Damit 64-Bit-Ganzzahlen erhalten bleiben, schreibt JSON sie als Zeichenfolgen. Datumsangaben und Zeitstempel verwenden ISO-Text mit Millisekundengenauigkeit. Dezimalzahlen folgen der numerischen Genauigkeit des Readers. Dieser Betrachter ermöglicht daher keine verlustfreie Konvertierung hochpräziser Dezimalzahlen oder Zeitstempel.

## Lokale Verarbeitung

Ihre Datei wird lokal in einem Hintergrund-Worker gelesen und niemals hochgeladen. Der Betrachter liest zuerst die Metadaten am Dateiende und anschließend nur die zum Durchsehen benötigten Zeilenbereiche. Das Dekodieren von Parquet-Zeilengruppen kann dennoch viel Arbeitsspeicher erfordern; die Exportgröße ist durch den verfügbaren Speicher Ihres Browsers begrenzt. Unkomprimierte Daten sowie die Codecs Snappy, Gzip, Brotli, Zstandard und LZ4 werden von hyparquet und dessen Komprimierungspaket unterstützt. Verschlüsselte Parquet-Dateien werden nicht unterstützt.

## OpenDocument-Text lokal konvertieren

Öffne ein OpenDocument-Dokument im Format `.odt` oder eine `.ott`-Vorlage, konvertiere die Datei in PDF, prüfe die entstandenen Seiten und lade dieselbe PDF herunter, die in der Vorschau angezeigt wird. Zum Lesen ohne Konvertierung verwende den [ODT-Betrachter](../odt-viewer/).

## PDF-Darstellung und Kompatibilität

Die Konvertierungs-Engine setzt Seitenvorlagen, Papierformate, Ausrichtung, Kopf- und Fußzeilen, Spalten, Tabellen und eingebettete Bilder um. Die Seiten behalten ihre gerenderte Reihenfolge, einschließlich der durch Seitenvorlagen eingefügten Leerseiten. Unterstützter Text bleibt auswählbar; gescannter Text wird nicht durch OCR erkannt. Fehlende Schriftarten werden durch mitgelieferte Schriftarten ersetzt. Dadurch können sich Zeilenumbrüche, Abstände und die Seitenaufteilung ändern. Komplexe Layouts können von der ursprünglichen Anwendung abweichen. Prüfe jede Seite, bevor du dich auf die PDF verlässt.

Die PDF ist ein statischer Export. Formularsteuerelemente erscheinen wie im Ausdruck. Kommentare, Makros und digitale Signaturen werden weder erhalten noch überprüft. Eingebettete Objekte, Medien und externe Dokumentressourcen werden nicht unterstützt. Geschützte Dokumente, beschädigte Pakete oder erkannte fehlende Inhalte führen zu einem Fehler, ohne dass eine unvollständige Datei zum Herunterladen angeboten wird. Das Umbenennen der Dateiendung ändert nicht das zugrunde liegende Format.

## Datenschutz und Browserressourcen

Die Konvertierung läuft auf deinem Gerät. Bei der ersten Konvertierung werden etwa 90 MB an Engine- und Schriftdateien heruntergeladen, die dein Browser zwischenspeichern kann; das Dokument selbst wird niemals hochgeladen. Die Engine wird erst geladen, nachdem du eine Datei ausgewählt hast. Ein aktueller Browser mit Unterstützung für WebAssembly und gemeinsam genutzten Speicher ist erforderlich. Große oder komplexe Dokumente können Zeit und Arbeitsspeicher benötigen. Du kannst die Konvertierung abbrechen oder die Datei schließen oder ersetzen. Es gibt keine feste Begrenzung für Dateigröße oder Seitenzahl.

## Rich Text lokal konvertieren

Öffne ein lokales `.rtf`-Dokument, konvertiere es in PDF, prüfe die entstandenen Seiten und lade genau die PDF herunter, die in der Vorschau angezeigt wird. Zum Lesen ohne Konvertierung verwende den [RTF-Betrachter](../rtf-viewer/).

## PDF-Darstellung und Kompatibilität

Die Konvertierungs-Engine stellt Seitengrößen, Ausrichtung, Kopf- und Fußzeilen, Seitenumbrüche, Tabellen und unterstützte eingebettete PNG-/JPEG-Bilder dar. Unterstützter Text bleibt auswählbar. Die ursprünglichen RTF-Zeichenkodierungen und Unicode-Escapesequenzen werden an die Engine übergeben; gescannter Text wird nicht per OCR erkannt. Fehlende Schriftarten werden durch mitgelieferte Schriftarten ersetzt, wodurch sich Zeilenumbrüche, Abstände und die Seitenaufteilung ändern können. Komplexe Layouts können von der ursprünglichen Anwendung abweichen. Prüfe jede Seite, bevor du dich auf die PDF verlässt.

Die PDF ist ein statischer Export. Formularsteuerelemente werden in ihrer Druckdarstellung übernommen. Kommentare, Makros und digitale Signaturen werden weder erhalten noch überprüft. Eingebettete Objekte, externe Dokumentressourcen, nicht unterstützte Bildformate und nicht unterstützte Feldanweisungen werden abgelehnt. Beschädigte oder unlesbare Dateien führen zu einem Fehler, ohne dass ein unvollständiger Download bereitgestellt wird. Eine umbenannte Dateiendung ändert das zugrunde liegende Format nicht.

## Datenschutz und Browserressourcen

Die Konvertierung erfolgt auf deinem Gerät. Bei der ersten Konvertierung werden etwa 90 MB an Engine- und Schriftdateien heruntergeladen, die dein Browser zwischenspeichern kann; das Dokument selbst wird niemals hochgeladen. Die Engine wird erst geladen, nachdem du eine Datei ausgewählt hast. Erforderlich sind aktuelle Browser mit Unterstützung für WebAssembly und gemeinsam genutzten Speicher. Große oder komplexe Dokumente können Zeit und Arbeitsspeicher beanspruchen. Du kannst die Konvertierung abbrechen oder die Datei schließen oder ersetzen. Es gibt keine feste Begrenzung für Dateigröße oder Seitenzahl.

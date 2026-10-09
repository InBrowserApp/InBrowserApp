## Texte und Logs lokal lesen

Öffnen Sie eine .txt-, .text- oder .log-Datei, um sie mit Zeilennummern, anpassbarer Textgröße, optionalem Zeilenumbruch und Lesemodus zu lesen. Springen Sie zu einer Zeile, zum Dateianfang oder -ende oder durchsuchen Sie mit „Text suchen“ die gesamte Datei. Gesucht wird nach exaktem Text unter Beachtung der Groß- und Kleinschreibung; die Suche nach dem nächsten oder vorherigen Treffer wird am jeweils anderen Dateiende fortgesetzt.

## Große Dateien und lange Zeilen

Der Betrachter zeigt jeweils einen Abschnitt an, damit große Dateien gut nutzbar bleiben. Jeder Abschnitt bleibt zugänglich, einschließlich der Fortsetzung sehr langer Zeilen. Die Textauswahl und die Suchfunktion Ihres Browsers erfassen den aktuellen Abschnitt; „Text suchen“ im Betrachter durchsucht die gesamte dekodierte Datei, einschließlich Treffern über Abschnittsgrenzen hinweg. Es gibt keine festgelegte Obergrenze für Dateigröße oder Zeilenanzahl. Der verfügbare Arbeitsspeicher des Browsers setzt jedoch eine praktische Grenze.

Leerzeilen, Tabulatoren, gemischte CRLF/CR/LF-Zeilenenden und Unicode-Text bleiben erhalten. Zeilenenden werden als Zeilenumbrüche angezeigt. Markup und Terminal-Escape-Sequenzen bleiben inaktiver Text. Einige Steuerzeichen haben kein sichtbares Schriftzeichen; bei Dateien mit NUL-Zeichen erscheint ein Hinweis auf eine mögliche Binärdatei.

## Die richtige Zeichenkodierung wählen

Der automatische Modus erkennt Byte-Reihenfolgemarkierungen von UTF-8 und UTF-16 und verwendet andernfalls striktes UTF-8. Sie können UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 oder Shift JIS wählen. Ein Dekodierungsfehler stoppt die Vorschau, statt unlesbare Zeichen stillschweigend zu ersetzen. Versuchen Sie eine andere Kodierung, wenn die Datei unlesbar ist oder fehlerhafte Zeichen zeigt; der Betrachter kann die ursprüngliche Kodierung nicht für jede Datei bestimmen.

Dateien werden auf Ihrem Gerät verarbeitet, ohne Uploads, externe Ressourcen oder automatische Speicherung. Beim Schließen oder Ersetzen einer Datei wird ihre Lesesitzung freigegeben. Dieser Betrachter bearbeitet keine Dateien, interpretiert weder HTML noch Terminalbefehle und verfolgt keine laufend aktualisierten Logs.

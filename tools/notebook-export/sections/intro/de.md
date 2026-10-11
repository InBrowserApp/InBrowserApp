## Ein gespeichertes Jupyter-Notebook exportieren

Öffne ein IPYNB-Notebook und wähle HTML, Markdown oder Code. HTML und Markdown erhalten die gespeicherte Reihenfolge der Zellen samt unterstützten gespeicherten Ausgaben. Alles bleibt in deinem Browser. Es werden weder Kernel noch Code oder eine Widget-Laufzeit gestartet.

## Ein passendes Ausgabeformat wählen

HTML ist eine eigenständige Lesekopie mit auswählbarem Text, unterstützten enthaltenen Bildern und lesbaren Tabellen. Markdown liefert weiterverwendbare Dokumentinhalte. Tabellen können sicheres HTML enthalten, und Bilder verwenden eingebettete Daten-URLs, die manche Markdown-Anwendungen nicht anzeigen. Das ursprüngliche Layout und die Formatierung können sich ändern.

Der Code-Export erhält die Reihenfolge der Codezellen und lässt Markdown, Rohtextzellen und gespeicherte Ausgaben aus. Eine erkannte Notebook-Sprache bestimmt die Dateiendung des Skripts; bei unbekannten Sprachen wird TXT verwendet. Notebook-Magics und Shell-Syntax bleiben unverändert. Der exportierte Code kann daher manuelle Anpassungen oder den ursprünglichen Notebook-Kernel erfordern. Ein Notebook ohne Codezellen erzeugt eine leere Codedatei.

## Gespeicherte Ergebnisse und Kompatibilität

Der Konverter liest Notebook-Format 4. Ergebnisse stammen aus der gespeicherten Datei und können veraltet sein. Nicht unterstützte reichhaltige Inhalte und nicht verfügbare Bilder werden gekennzeichnet. Externe Ressourcen werden nicht abgerufen; Skripte, Widgets, Audio und Video werden nicht ausgeführt. LaTeX bleibt Quelltext, und Rohtextzellen oder unbekannte Zelltypen erscheinen in Dokumentexporten als lesbarer Text.

Die Ressourcen des Browsers bestimmen die praktischen Grenzen. Es gibt keine feste Begrenzung der Dateigröße oder Zellenzahl. Zum Betrachten des ursprünglichen Notebooks verwende den [Jupyter-Notebook-Betrachter](/tools/notebook-viewer/).

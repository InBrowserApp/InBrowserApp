## Wann eignen sich BibTeX, RIS und CSL JSON?

Wählen Sie ein Format, das Ihre Zielanwendung importieren kann.

- **BibTeX (`.bib`)** eignet sich für LaTeX-Projekte in Overleaf oder einem lokalen Editor.
- **RIS (`.ris`)** eignet sich, um Literaturangaben aus einer Datenbank oder einem anderen Literaturverwaltungsprogramm in Zotero oder EndNote zu importieren.
- **CSL JSON (`.json`)** enthält strukturierte Literaturangaben für Zitationsprozessoren und andere Tools, die Daten für die Citation Style Language verarbeiten.

## Wie konvertiere und prüfe ich meine Literaturangaben?

Fügen Sie die Literaturangaben ein oder wählen Sie **Datei öffnen**. Lassen Sie **Eingabeformat** auf **Automatisch erkennen** stehen oder wählen Sie das Format selbst, falls die Erkennung fehlschlägt. Wählen Sie das **Ausgabeformat** und dann **Konvertieren und prüfen**. Anschließend können Sie das Ergebnis kopieren oder die Datei herunterladen. Die Konvertierung läuft in Ihrem Browser.

Öffnen Sie zum Beispiel einen RIS-Export aus Zotero, wählen Sie BibTeX und laden Sie für Ihr Overleaf-Projekt eine `.bib`-Datei herunter. Wenn Sie nur ein formatiertes Literaturverzeichnis aus Word haben, exportieren Sie die einzelnen Einträge zuerst aus dem Literaturverwaltungsprogramm, mit dem Sie das Verzeichnis erstellt haben. Hinweise zum Import der konvertierten Datei finden Sie in der [Importanleitung von Zotero](https://www.zotero.org/support/kb/importing_standardized_formats).

## Was bedeutet ein mögliches Duplikat?

Der Bericht gruppiert Einträge mit derselben DOI. Dabei erkennt er auch DOI-Angaben in Form eines `doi.org`-Links. Fehlt eine DOI, vergleicht der Bericht Titel und Erscheinungsjahr sowie den Nachnamen und den ersten Buchstaben des Vornamens der zuerst genannten Person. Die Nummern entsprechen der Reihenfolge in der Eingabe. Wählen Sie **Beispiel laden**, um zu sehen, wie der Bericht zwei Einträge für denselben Artikel anzeigt. Prüfen Sie jede Gruppe, bevor Sie die Einträge in Ihrer Literaturverwaltung zusammenführen. Die heruntergeladene Datei enthält alle Einträge.

## Welche Felder bleiben erhalten?

Gängige Felder wie Titel, Namen der Verfassenden, Erscheinungsjahr und DOI bleiben bei der Konvertierung in der Regel erhalten. Benutzerdefinierte Felder können entfallen, und eine neu erstellte BibTeX-Datei kann andere Zitierschlüssel enthalten, um Konflikte zu vermeiden. Bewahren Sie den ursprünglichen Export auf, wenn Sie diese Angaben benötigen. Wenn Sie mögliche Duplikate prüfen und dabei die ursprünglichen Felder beibehalten möchten, wählen Sie dasselbe Eingabe- und Ausgabeformat.

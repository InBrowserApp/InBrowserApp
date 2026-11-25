## So wandelst du ein Jupyter Notebook in PDF um

Öffne eine gespeicherte `.ipynb`-Datei aus Jupyter, Google Colab oder VS Code oder ziehe sie hierher. Prüfe die Notebook-Vorschau, wähle A4 oder US Letter und klicke auf **Als PDF speichern**. Wähle im Druckdialog des Browsers **Als PDF speichern** als Ziel. Dort kannst du auch einen Drucker auswählen. So wird zum Beispiel aus `analysis.ipynb` ein PDF, das du per E-Mail versenden oder mit einem Bericht einreichen kannst.

## Was das PDF enthält

Das PDF übernimmt die Reihenfolge der Notebook-Zellen. Es enthält Markdown-Überschriften und -Tabellen, Quellcode und unterstützte gespeicherte Ausgaben wie Konsolentext, Tabellen und eingebettete Diagrammbilder. Lange Codezeilen werden an das Papierformat angepasst umgebrochen. Lange Zellen können auf der nächsten Seite fortgesetzt werden; der Text bleibt im Browser auswählbar.

Speichere das Notebook vor der Umwandlung mit seinen Ausgaben, wenn du die neuesten Ergebnisse benötigst. Der Konverter liest die gespeicherte Datei lokal und führt keine Zellen aus. Widgets benötigen eine gespeicherte statische Darstellung, um angezeigt zu werden. LaTeX-Quelltext bleibt Text; Bilder und andere Ressourcen aus dem Internet werden nicht geladen.

## Weitere Möglichkeiten für dein Notebook

Mit dem [Jupyter Notebook Viewer](../notebook-viewer/) kannst du Zellen und gespeicherte Ausgaben interaktiv lesen. Nutze den [Jupyter Notebook Converter](../notebook-export/), wenn du HTML, Markdown oder ein Code-Skript benötigst.

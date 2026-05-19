Entferne Besitzerpasswort-Beschränkungen aus einer PDF direkt in deinem Browser. Das Tool erstellt eine neue PDF, die keine Berechtigungsflags für Bearbeiten, Drucken, Kopieren oder Seitenextraktion mehr enthält.

## Wann du es verwenden solltest

Verwende es, wenn du bereits eine PDF hast, die sich normal öffnen lässt, das Dokument aber übliche Aktionen wie Drucken, Kopieren von Text, Bearbeiten von Seiten oder Zusammenstellen von Seiten in einem anderen PDF-Tool blockiert. Das kommt häufig bei Formularen, exportierten Berichten, alten Rechnungen und Dokumenten vor, die mit restriktiven PDF-Berechtigungseinstellungen erstellt wurden.

## Wie es funktioniert

Lade eine PDF hoch, prüfe die ausgewählte Datei und führe dann den Entfernungsschritt aus. Das Tool führt qpdf in einem Browser-Worker mit der PDF-Operation `--decrypt` aus und gibt eine neue PDF-Datei zum Herunterladen zurück. Die Originaldatei bleibt unverändert, damit du die Ausgabe vergleichen oder verwerfen kannst, falls sie nicht die benötigte Version ist.

## Datenschutz und Einschränkungen

Die PDF bleibt in dieser Browser-Sitzung und wird nicht auf einen Server hochgeladen. Dieses Tool entfernt Besitzerpasswort-Berechtigungsbeschränkungen aus PDFs, die bereits geöffnet werden können. Es stellt kein verlorenes Benutzer-/Öffnungspasswort wieder her und kann beschädigte Dateien oder Verschlüsselungsmodi, die vom browserseitigen qpdf-Build nicht unterstützt werden, nicht entsperren.

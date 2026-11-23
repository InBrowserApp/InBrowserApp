Öffne ein 7z-, RAR-, ZIP- oder TAR-Archiv, um seine Ordner vor dem Entpacken zu durchsuchen. Wähle eine Datei aus, um sie in der Vorschau anzusehen oder einzeln herunterzuladen.

## Wann du ihn verwenden solltest

Verwende ihn, wenn du ein komprimiertes Paket erhältst und einen schnellen Blick hineinwerfen möchtest, ohne das gesamte Archiv zu entpacken. Er ist nützlich zum Prüfen von Release-Paketen, heruntergeladenen Vorlagen, Log-Paketen, Quellcode-Snapshots oder einem einzelnen `.gz`-Anhang.

## Datenschutz und Dateiverarbeitung

Archivinhalte werden lokal in deiner Browsersitzung gelesen. Die Datei wird nicht zu InBrowser.App hochgeladen. Große Texteinträge werden in der Vorschau begrenzt, damit die Seite reaktionsschnell bleibt; lade den Eintrag herunter, wenn du die vollständige Datei prüfen musst.

## Unterstützte Archivformate

Der Archivbetrachter öffnet ZIP, 7z, RAR4 und RAR5, TAR, CPIO, AR (einschließlich `.deb`-Paketen), CAB, ISO 9660 und LHA. Er öffnet auch Einzeldateien und TAR-Archive, die mit GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA oder UNIX compress (`.Z`) komprimiert wurden. Öffne zum Beispiel ein `.tar.zst`-Release-Paket, um seine Ordner zu durchsuchen, oder ein `.zst`-Protokoll, um die entpackte Datei herunterzuladen.

Verwende ein Archivprogramm auf deinem Computer für verschlüsselte Dateien, mehrteilige Archive, solide RAR4-Archive oder Einträge über 512 MiB in den neu unterstützten Formaten. Bei großen soliden Archiven kann das Öffnen oder Entpacken länger dauern, da der Decoder möglicherweise zuerst die vorherigen Einträge verarbeiten muss.

## Vorschauverhalten

Textähnliche Dateien wie JSON, Markdown, Logs, Quellcode, CSV, XML, YAML und TOML können mit Syntaxhervorhebung in der Vorschau angezeigt werden, wenn eine passende Sprache verfügbar ist. Gängige Bilddateien können visuell in der Vorschau angezeigt werden, und PDF-Dokumente werden im integrierten PDF-Betrachter des Browsers geöffnet, wenn er verfügbar ist. Andere Binärdateien bleiben herunterladbar, aber das Tool versucht nicht, sie darzustellen.

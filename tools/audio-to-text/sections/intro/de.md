## So wandelst du eine Audioaufnahme in Text um

Ziehe eine Meetingaufnahme, ein Interview, einen Vortrag, einen Podcast oder eine Sprachnotiz in das Tool. Lass die Sprache automatisch erkennen oder wähle die gesprochene Sprache selbst aus. Wähle ein Whisper-Modell und klicke auf **Audio transkribieren**. Sobald das Transkript fertig ist, kannst du über die Zeitstempel direkt zu den entsprechenden Stellen springen. Korrigiere bei Bedarf Namen, Satzzeichen oder falsch erkannte Wörter und kopiere oder lade den Text anschließend herunter.

Das Tool verarbeitet Audioformate, die dein Browser lesen kann. Dazu zählen gängige Aufnahmen in MP3, WAV, M4A, FLAC, OGG und WebM. Welche Codecs unterstützt werden, hängt vom Browser ab. Falls sich eine Datei nicht öffnen lässt, exportiere die Aufnahme möglichst als WAV oder MP3.

## Welches Transkriptionsmodell passt zu meiner Aufnahme?

Für eine klare Sprachnotiz oder einen ersten Entwurf eignet sich **Schnell (Whisper Base)**. **Ausgewogen (Whisper Small)** kann bei Akzenten und Gesprächen bessere Ergebnisse liefern. **Höchste Genauigkeit (Whisper Large V3 Turbo)** ist das leistungsfähigste Modell für schwer verständliche Aufnahmen. Es braucht einen größeren Download und mehr Arbeitsspeicher. Alle drei Modelle unterstützen mehrere Sprachen und geben die gesprochenen Wörter in der Originalsprache wieder.

Whisper nutzt WebGPU, wenn Browser und Grafikhardware es unterstützen. Die Verarbeitung ist auch über die CPU mit WebAssembly möglich. Beim ersten Start wird das gewählte Modell heruntergeladen. Dateien, die der Browser im Cache behält, können wiederverwendet werden. Downloadgröße und Verarbeitungszeit hängen vom Modell und Gerät ab. Deine Aufnahme wird auf deinem Gerät gelesen und transkribiert. Beim Modelldownload wird keine Aufnahme übertragen.

## Transkript mit Zeitstempeln oder Untertitel exportieren

- **TXT** gibt für jeden Textabschnitt die Startzeit an. So verweist etwa `[00:02:15.320] Schauen wir uns die Tagesordnung an.` auf eine Stelle gut zwei Minuten nach Aufnahmebeginn. Das ist praktisch für Besprechungsnotizen, Interviewzitate oder durchsuchbaren Text.
- **SRT (SubRip)** enthält für jeden nummerierten Untertitel eine Start- und Endzeit. Das Format ist in Videobearbeitungsprogrammen weit verbreitet.
- **VTT (WebVTT)** enthält ebenfalls Start- und Endzeiten und funktioniert mit HTML-Videoplayern, die Untertitelspuren unterstützen.

Whisper schätzt, wann ein gesprochener Abschnitt beginnt und endet. Höre wichtige Zitate noch einmal an und überprüfe vor dem Teilen, ob die Untertitel zur Aufnahme passen. Hintergrundgeräusche und gleichzeitig sprechende Personen können das Ergebnis beeinflussen. Das Transkript ist in zeitliche Abschnitte gegliedert.

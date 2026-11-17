## Was dieser Betrachter anzeigt

Der Medieninfo-Betrachter liest die technischen Metadaten lokaler Audio- und
Videodateien, darunter MP4, MOV, MKV, WebM, AVI, MP3, FLAC und WAV. Damit kannst du
die Spezifikationen eines Exports oder die Sprachangaben der Audiospuren eines
Films prüfen und einen technischen Bericht zur Fehlersuche zusammenstellen.
Die Analyse beginnt, sobald du eine Datei auswählst oder im Dateibereich ablegst.

## Details zu Datei, Video, Audio und Untertiteln

- **Dateiübersicht:** tatsächliches Containerformat, Dateigröße, Dauer,
  Gesamtbitrate, Titel und die zum Kodieren verwendete Anwendung, soweit verfügbar.
- **Videospuren:** Codec, Profil und Bitrate, Auflösung, Bildrate und Bildratenmodus,
  Seitenverhältnis, Drehung, Bittiefe, Farbraum, Farbunterabtastung und HDR-Format.
- **Audiospuren:** Codec, Bitrate, Sprache, Spurtitel, Anzahl und Anordnung der
  Kanäle, Abtastrate, Bittiefe sowie Kennzeichnungen als Standardspur oder
  erzwungene Spur. Jede Audiospur wird einzeln aufgeführt, sodass Originalton,
  Synchronfassungen und Kommentarspuren getrennt bleiben.
- **Untertitelspuren:** Format, Sprache, Titel, Dauer sowie Kennzeichnungen als
  Standardspur oder erzwungene Spur, sofern diese Angaben in der Datei enthalten sind.

Die wichtigsten Spezifikationen sind sofort sichtbar. Öffne **Technische Details**
innerhalb einer Spur, um weitere Felder anzuzeigen, oder wähle den Link mit der
Spuranzahl, um zur ersten Spur dieses Typs zu springen. Welche Felder verfügbar
sind, hängt vom Format und seinen Metadaten ab.

## So prüfst du eine Datei

1. Wähle eine lokale Audio- oder Videodatei aus oder ziehe sie in den Dateibereich.
2. Prüfe die Übersicht und anschließend die einzelnen Video-, Audio- und
   Untertitelspuren.
3. Kopiere den lesbaren Bericht für eine Nachricht oder ein Supportticket oder
   lade JSON für ein Medienverzeichnis, ein Skript oder weitere Analysen herunter.
   Beide enthalten auch technische Felder, die in der Oberfläche eingeklappt sind.
4. Wähle **Datei wechseln**, um eine andere Datei zu prüfen, oder **Datei entfernen**,
   um die Ergebnisse zu löschen. Wenn du eine andere Datei auswählst oder die
   aktuelle entfernst, wird auch eine noch laufende Analyse gestoppt.

## Die Zahlen verstehen

- **Container und Codec beschreiben unterschiedliche Dinge.** MP4 und Matroska
  sind Container; AVC/H.264, HEVC/H.265 und AAC beschreiben, wie Streams kodiert
  sind. Ein Container kann mehrere Audio- oder Untertitelspuren enthalten.
- **Die Gesamtbitrate bezieht sich auf die gesamte Datei.** Sie umfasst alle
  Streams und den Container-Overhead. Die Bitrate einer Spur gilt nur für diesen
  Stream. Bitraten werden in kb/s oder Mb/s angegeben, Dateigrößen in B, KiB,
  MiB, GiB oder TiB.
- **Die Dauer enthält Millisekunden.** Die Anzeige verwendet `HH:MM:SS.mmm`.
  Die Bildrate wird in fps und die Audioabtastrate in kHz angegeben. CFR steht
  für eine konstante Bildrate, VFR für eine variable Bildrate.
- **Spurkennzeichnungen beschreiben die vorgesehene Auswahl.** „Standardspur“
  kennzeichnet eine bevorzugte Spur; „Erzwungene Spur“ wird häufig für Untertitel
  verwendet, die erscheinen sollen, ohne dass eine vollständige Untertitelspur
  ausgewählt wird. Diese Kennzeichnungen werden unabhängig voneinander aus der
  Datei ausgelesen.

Manche Container enthalten keine eigene Bitrate für jeden Stream. Nicht verfügbare
Werte bleiben leer oder werden als nicht verfügbar gekennzeichnet; sie werden
nicht aus dem Dateinamen abgeleitet. Eingebettete Coverbilder zählen nicht als
Videospur.

## Häufige Anwendungsfälle

Prüfe nach einem Videoexport die Auflösung und Bildrate, kontrolliere vor der
Audiobearbeitung die Kanäle und Abtastrate, finde mehrere Sprach- oder
Kommentarspuren oder sammle Codec-Details zur Untersuchung eines
Wiedergabeproblems. Mit dem Bericht kannst du die relevanten Spezifikationen
teilen, ohne die Mediendatei zu versenden.

## Lokale Verarbeitung und Berichtsexport

Die Analyse findet in deinem Browser statt: Die Mediendatei wird nicht
hochgeladen und ihr Inhalt wird nicht verändert. Die Analyse liest bei Bedarf
Dateiabschnitte und kann so auch Metadaten prüfen, wenn der Browser den
Container oder Codec nicht abspielen kann.

**Bericht kopieren** erstellt eine lesbare Zusammenfassung als Text.
**JSON herunterladen** exportiert die von der Analyse zurückgegebenen Metadaten
zusammen mit dem Dateinamen und der Dateigröße. In JSON verwendet `Duration`
Sekunden, `BitRate` und `OverallBitRate` verwenden Bits pro Sekunde und
`SamplingRate` verwendet Hertz. Die Oberfläche stellt diese Werte in leichter
lesbaren Einheiten dar. Der Export enthält außerdem zusätzliche Metadatenfelder,
die in den Spurkarten nicht angezeigt werden.

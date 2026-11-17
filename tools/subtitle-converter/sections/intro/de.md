## Über den Untertitelkonverter

Konvertieren Sie vorhandene Untertiteldateien zwischen 19 zeitbasierten Textformaten oder exportieren Sie ein Transkript als Klartext. Typische Aufgaben sind das Umwandeln von SRT in VTT für Webvideos, das Übertragen von ASS- oder SSA-Dialogen in SRT, das Vorbereiten von Untertiteln für eine Videoplattform und das Zusammenfassen mehrerer konvertierter Folgen in einer ZIP-Datei. Die Konvertierung läuft in Ihrem Browser; Untertiteldateien und eingefügte Inhalte werden nicht hochgeladen.

Das Tool verarbeitet Untertiteltext und die zugehörigen Zeitangaben. Wählen Sie Dateien aus oder fügen Sie Untertitel ein, wählen Sie ein Ausgabeformat und prüfen Sie das Ergebnis vor dem Herunterladen in der Vorschau. Sie können eingefügten Text bearbeiten und erneut konvertieren, ohne die Originaldatei auf Ihrem Gerät zu verändern.

## So konvertieren Sie Untertitel

1. Wählen Sie **Dateien auswählen**, um eine oder mehrere Untertiteldateien zu öffnen, ziehen Sie Dateien in den Eingabebereich oder fügen Sie Untertiteltext in den Editor ein. **Beispiel ausprobieren** lädt ein kurzes SRT-Beispiel mit zwei Untertiteln.
2. Lassen Sie **Eingabeformat** im Normalfall auf **Automatisch erkennen** stehen. Die Erkennung untersucht den Inhalt und verlässt sich nicht allein auf den Dateinamen. Wählen Sie das Quellformat selbst aus, wenn eine Datei nicht eindeutig erkannt wird.
3. Wählen Sie ein **Ausgabeformat**. Für eine typische Untertitelspur auf einer Website wählen Sie WebVTT; wenn ein Player oder Editor eine SRT-Datei verlangt, wählen Sie SubRip.
4. Öffnen Sie die **Konvertierungseinstellungen**, wenn Sie eine andere Dateikodierung, eine Bildrate oder einen Zeitversatz benötigen. Ändern Sie diese Einstellungen vor dem Konvertieren.
5. Wählen Sie **Untertitel konvertieren**. Das Ergebnis zeigt das Quell- und Ausgabeformat, den Namen der Ausgabedatei und die Anzahl der konvertierten Untertitel.
6. Wechseln Sie zwischen **Vorschau** und **Dateiinhalt** und kopieren Sie anschließend den konvertierten Text oder laden Sie die Datei herunter. Die Tabelle zeigt bis zu 100 Untertitel; Dateiinhalt und Downloads enthalten das vollständige Ergebnis.

**Leeren** entfernt die aktuelle Eingabe und die Ergebnisse von der Seite. Wenn Sie eine neue Gruppe von Dateien auswählen, wird die vorherige Auswahl ersetzt. Der Konverter speichert keinen Untertitelverlauf. Laden Sie daher Ergebnisse herunter, die Sie behalten möchten.

## Unterstützte Formate und Ausgabegenauigkeit

Alle folgenden Formate können gelesen und geschrieben werden, mit Ausnahme von TXT, das als Export für lesbare Transkripte dient. Die Formate speichern Zeitangaben unterschiedlich; bei einem Format mit geringerer Genauigkeit werden Zeitstempel auf die unterstützten Einheiten gerundet.

| Format                               | Erweiterung | Geschriebene Zeitangaben              |
| ------------------------------------ | ----------- | ------------------------------------- |
| SubRip                               | `.srt`      | Millisekunden                         |
| WebVTT                               | `.vtt`      | Millisekunden                         |
| Advanced SubStation Alpha            | `.ass`      | Hundertstelsekunden                   |
| SubStation Alpha                     | `.ssa`      | Hundertstelsekunden                   |
| YouTube SubViewer                    | `.sbv`      | Millisekunden                         |
| MicroDVD                             | `.sub`      | Videobilder                           |
| SubViewer 2.0                        | `.sub`      | Hundertstelsekunden                   |
| SAMI                                 | `.smi`      | Millisekunden                         |
| LRC-Liedtexte                        | `.lrc`      | Startzeiten in Hundertstelsekunden    |
| Timed Text                           | `.ttml`     | Millisekunden                         |
| Distribution Format Exchange Profile | `.dfxp`     | Millisekunden                         |
| YouTube SRV3                         | `.srv3`     | Millisekunden                         |
| YouTube-Transkript-XML               | `.xml`      | Sekunden mit Millisekundengenauigkeit |
| MPL2                                 | `.mpl`      | Zehntelsekunden                       |
| Spruce Subtitle, Textformat          | `.stl`      | Videobilder                           |
| QuickTime Text                       | `.qt.txt`   | Millisekunden                         |
| JSON                                 | `.json`     | Zahlenwerte in Millisekunden          |
| CSV                                  | `.csv`      | Zahlenwerte in Millisekunden          |
| TSV                                  | `.tsv`      | Zahlenwerte in Millisekunden          |
| Klartexttranskript, nur Export       | `.txt`      | Keine Zeitstempel                     |

Die TTML-Eingabe akzeptiert auch kompatible iTT-Dateien. DFXP gehört zur TTML-Familie. Beim TTML-Export werden nicht alle plattformspezifischen Profile, Layouts oder Stilregeln nachgebildet.

Die Erweiterung `.sub` kann hier entweder das textbasierte MicroDVD oder SubViewer bezeichnen. Das binäre VobSub ist ein anderes Format. Ebenso handelt es sich beim unterstützten `.stl`-Format um textbasiertes Spruce STL und nicht um binäres EBU STL. Wählen Sie das Format anhand seines vollständigen Namens, wenn diese Erweiterungen mehrdeutig sind.

## Die Wahl zwischen SRT, VTT, ASS und Klartext

**SRT** ist eine gute Wahl, wenn ein Videoplayer, Editor oder Uploadformular SubRip-Untertitel verlangt. **VTT** wird für Textspuren in HTML-Videos verwendet und kann auch webspezifische Einstellungen für einzelne Untertitel enthalten. Bei der Konvertierung zwischen diesen Formaten bleiben Untertiteltext und Zeitangaben in Millisekunden erhalten, während die Dateisyntax neu aufgebaut wird.

Ein nummerierter SRT-Untertitel verwendet ein Komma vor den Millisekunden:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Derselbe Untertitel in WebVTT hat einen Dateikopf und Zeitstempel mit Dezimalpunkt:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS und SSA** eignen sich als Austauschformate, wenn Ihre nächste Anwendung sie benötigt. Unterstützte Fett-, Kursiv- und Unterstreichungsformatierungen können zwischen Formaten übertragen werden, die sie darstellen können. Schriftarten, Bildschirmpositionen, Zeichenbefehle, Karaoke-Animationen und andere erweiterte Darstellungsfunktionen werden vereinfacht; grafische ASS-Ereignisse ohne lesbaren Dialog werden übersprungen. Der Konverter konzentriert sich auf lesbare Untertitel, statt eine gestaltete Animation oder ein Layout nachzubilden.

**TXT** extrahiert lesbare Dialoge ohne Zeitstempel oder Formatierung. Die Vorschau zeigt den exportierten Text statt einer Tabelle mit Zeitangaben. Der TXT-Export erfindet keine Untertitelzeiten, transkribiert keine Sprache und übersetzt die gesprochene Sprache nicht.

## Dateikodierung und lesbarer Text

Die automatische Dateidekodierung verwendet UTF-8 oder UTF-16, wenn eine Byte-Reihenfolgemarkierung dies kennzeichnet. Wählen Sie bei älteren Dateien die ursprüngliche Kodierung aus, wenn Zeichen falsch aussehen oder die Datei nicht dekodiert werden kann. Zur Auswahl stehen Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS und EUC-KR sowie ausdrückliche Optionen für UTF-8 und UTF-16.

Versuchen Sie beispielsweise GB18030 für einen chinesischen Untertitel, der bekanntermaßen in dieser Kodierung gespeichert wurde, oder Shift_JIS für eine japanische Datei aus einer älteren Anwendung. Die Kodierung verändert, wie vorhandene Bytes gelesen werden; sie übersetzt nicht deren Bedeutung. Konvertieren Sie nach der Auswahl einer anderen Kodierung erneut. Heruntergeladene Untertiteldateien verwenden unabhängig von der Eingabekodierung UTF-8.

## Zeitangaben und Bildrate anpassen

### Alle Untertitel früher oder später anzeigen

Der Zeitversatz wird in Millisekunden angegeben. Ein Wert von `1500` verzögert jeden Untertitel um 1,5 Sekunden; `-500` zeigt Untertitel eine halbe Sekunde früher an. Bei einem Untertitel, der bei `00:00:01.250` beginnt, ergeben diese Einstellungen `00:00:02.750` beziehungsweise `00:00:00.750`.

Ein Versatz verschiebt sowohl Anfang als auch Ende und erhält die Dauer, bis der Anfang der Zeitleiste erreicht wird. Untertitel, die vollständig vor den Nullpunkt verschoben werden, werden entfernt; ein Untertitel, der nur teilweise davor liegt, beginnt bei null. Ein Versatz korrigiert eine gleichbleibende Verzögerung. Er korrigiert keine Untertitelspur, deren zeitliche Abweichung sich im Verlauf eines Videos verändert.

### Die Bildrate für framebasierte Zeitstempel verwenden

MicroDVD und Spruce STL verwenden Videobilder. Ihre Bildrate bestimmt daher, wie diese Bilder in verstrichene Zeit umgerechnet werden. Auch TTML kann framebasierte Zeitangaben enthalten. Verwenden Sie die Bildrate des Quellvideos, etwa `23.976`, `24`, `25` oder `29.97`, wenn sie zum Interpretieren der Eingabe benötigt wird.

Eine eingebettete Bildrate der Eingabe hat Vorrang, wenn das Format eine solche angibt. Bei einer framebasierten Ausgabe bestimmt die gewählte Einstellung die geschriebene Bildrate. Eine Änderung dieser Einstellung skaliert gewöhnliche SRT- oder VTT-Zeitstempel nicht neu; sie verändert, wie framebasierte Zeitstempel interpretiert oder geschrieben werden.

### Rundung und fehlende Endzeiten verstehen

SRT und VTT behalten Millisekundengenauigkeit bei. ASS, SSA, SubViewer und LRC runden auf Hundertstelsekunden; MPL2 rundet auf Zehntelsekunden; framebasierte Ausgaben runden auf Videobilder. Ein sehr kurzer Untertitel behält nach dem Runden eine positive Dauer. Die Vorschau zeigt die Zeitangaben des exportierten Formats statt der ungerundeten Zeitstempel der Eingabe.

LRC kann Startzeiten ohne Endzeiten enthalten. Als fehlende Endzeit dient die nächste abweichende Startzeit; für den letzten Untertitel wird eine Dauer von zwei Sekunden angenommen. Der LRC-Export kann die ursprünglichen Lücken und überlappenden Endzeiten nicht beibehalten, und mehrzeilige Untertitel werden zu einzelnen Liedtextzeilen. QuickTime Text verwendet Markierungen auf der Zeitleiste; SAMI und QuickTime können überlappende Untertitel an jeder zeitlichen Grenze zu einem gemeinsamen Text zusammenfassen. Das Ergebnis kann daher eine andere Anzahl von Untertitelsegmenten enthalten.

## Stapelkonvertierung und ZIP-Downloads

Wählen Sie mehrere Dateien aus oder ziehen Sie sie in den Eingabebereich, um sie mit demselben Ausgabeformat und denselben Einstellungen zu konvertieren. Wählen Sie im Dateinamenmenü ein Ergebnis aus, um es zu prüfen. Für Dateien, die nicht konvertiert werden können, bleibt die jeweilige Fehlermeldung erhalten, während erfolgreiche Ergebnisse weiterhin einzeln heruntergeladen werden können.

Wenn mindestens zwei Dateien erfolgreich konvertiert wurden, fasst **Alle als ZIP herunterladen** diese Ausgaben zusammen. Das Archiv enthält nur erfolgreiche Konvertierungen. Prüfen Sie angezeigte Fehler, passen Sie bei Bedarf das Eingabeformat oder die Kodierung an und konvertieren Sie die verbleibenden Dateien erneut.

Die Ausgabedateien behalten den Basisnamen der Quelldatei und erhalten die gewählte Erweiterung: Aus `episode01.srt` wird beispielsweise `episode01.vtt`. Falls mehrere Ergebnisse denselben Namen hätten, sorgt ein Suffix wie ` (2)` für unterschiedliche Namen der ZIP-Einträge. ZIP dient hier als Downloadoption; wählen Sie als Eingabe die Untertiteldateien selbst aus.

## Datenaustausch mit JSON, CSV und TSV

JSON verwendet ein Array von Untertitelobjekten mit den Werten `start` und `end` in Millisekunden sowie einer Zeichenfolge `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Beim Einlesen wird auch JSON im Whisper-Stil mit einem `segments`-Array akzeptiert, in dem die Segmentwerte `start` und `end` in Sekunden angegeben sind. Dies ist eine separate Eingabekonvention; der reguläre JSON-Export verwendet weiterhin Millisekunden.

CSV und TSV verwenden die Spaltennamen `start`, `end` und `text`. Eingabezeiten können Zahlenwerte in Millisekunden oder Zeitstempel im Uhrzeitformat sein. CSV setzt Felder, die Kommas, Anführungszeichen oder Zeilenumbrüche enthalten, in Anführungszeichen; TSV verwendet Tabulatoren zwischen den Spalten. Beide Exporte schreiben Zahlenwerte in Millisekunden. Verwenden Sie diese Formate, um Untertitel in eine Tabellenkalkulation oder einen anderen Arbeitsablauf zur Untertitelverarbeitung zu übertragen.

## Häufige Fragen

### Warum sehen die Vorschau und der heruntergeladene Text unterschiedlich aus?

Die Vorschautabelle zeigt lesbaren Untertiteltext und die Zeitangaben des Zielformats. Der Dateiinhalt zeigt die tatsächlich serialisierte Datei einschließlich Kopfzeilen, Nummerierung, Trennzeichen und unterstützter Formatierungssyntax. Downloads enthalten diesen vollständigen serialisierten Inhalt, auch wenn die Tabelle nur die ersten 100 Untertitel anzeigt.

### Warum haben sich Formatierung oder Positionierung geändert?

Die Formate verwenden unterschiedliche Formatierungsmodelle. Unterstützte grundlegende Formatierungen bleiben erhalten, soweit sie dargestellt werden können; erweiterte Stile, die Positionierung von Web-Untertiteln, Animationen und Plattformmetadaten werden nicht vollständig nachgebildet. Prüfen Sie den Export in der Ansicht für den Dateiinhalt und testen Sie ihn in dem Player oder Editor, in dem Sie ihn verwenden werden.

### Können damit Untertitel aus einem Video oder einer Bildspur extrahiert werden?

Beginnen Sie mit einer vorhandenen textbasierten Untertiteldatei. Extrahieren Sie eingebettete Untertitelspuren zuerst aus dem Video. Bildbasierte PGS/SUP- und VobSub/IDX-Spuren benötigen OCR, um in Text umgewandelt zu werden; binäres EBU STL erfordert einen Untertiteleditor, der dieses Format lesen kann.

### Wo kann ich die Formatspezifikationen nachlesen?

Informationen zur Dateisyntax und zu den Plattformanforderungen finden Sie in der [WebVTT-Spezifikation](https://www.w3.org/TR/webvtt1/), der [TTML-Spezifikation](https://www.w3.org/TR/ttml2/) und unter [von YouTube unterstützte Untertitelformate](https://support.google.com/youtube/answer/2734698).

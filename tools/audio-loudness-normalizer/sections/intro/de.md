## Audio auf einen LUFS-Zielwert normalisieren

Gleiche die wahrgenommene Lautstärke von Podcastfolgen, Sprachaufnahmen und Musikstücken an. Das Tool misst die integrierte Lautheit der gesamten Aufnahme und passt den Pegel aller Kanäle um denselben Betrag an. Die Lautstärkeunterschiede zwischen leisen und lauten Stellen bleiben erhalten. Wähle eine Voreinstellung oder gib den LUFS-Wert für dein Projekt ein.

## So normalisierst du eine Audiodatei

1. Wähle eine Mono- oder Stereoaufnahme aus oder ziehe sie auf das Tool. Gängige Formate sind WAV, MP3, M4A, FLAC und OGG. Welche Dateien sich öffnen lassen, hängt von den Codecs deines Browsers ab.
2. Wähle einen Zielwert, etwa −16 LUFS für Podcasts, −14 LUFS für Musik oder −23 LUFS für Rundfunk. Die Vorgaben für die Veröffentlichung variieren. Gibt es eine Vorgabe für dein Projekt, gib den geforderten Wert ein.
3. Vergleiche die Messwerte vor und nach der Normalisierung, höre das Ergebnis an und lade es als WAV mit 16 Bit und 48 kHz herunter. Dekodierung, Analyse und Export laufen auf deinem Gerät.

## Was unterscheidet LUFS und True Peak?

Die integrierte Lautheit in LUFS schätzt, wie laut die gesamte Aufnahme klingt. Dazu werden Frequenzen unterschiedlich gewichtet und sehr leise Abschnitte bei der Messung ausgeblendet. Der True Peak in dBTP schätzt, wie hoch der Pegel des rekonstruierten Signals zwischen zwei Abtastwerten ausfallen kann. Zwei Stücke können ähnliche Spitzenpegel aufweisen und trotzdem unterschiedlich laut klingen. Eine reine Spitzenpegel-Normalisierung gleicht diesen Unterschied oft nicht aus.

## Warum ist das Ergebnis leiser als mein Zielwert?

Eine kurze Pegelspitze kann die Grenze von −1 dBTP erreichen, bevor die gesamte Aufnahme die Ziellautheit erreicht. In diesem Fall setzt das Tool die Verstärkung herab und zeigt an, welche Lautheit möglich ist. Wenn du bei gleichem Abstand zur Übersteuerung ein lauteres Ergebnis brauchst, reduziere hohe Pegelspitzen vor der Normalisierung in deinem Audioprogramm. Bei einer stillen Datei ist die integrierte Lautheit möglicherweise nicht messbar.

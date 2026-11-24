## Frequenzen in einer Audiodatei untersuchen

Mit der Audio-Spektrumanalyse kannst du ein tiefes Brummen aufspüren, Frequenzanteile vergleichen oder erkennen, ab welchem Bereich eine Aufnahme kaum noch Höhen enthält. Das Diagramm zeigt die Frequenz in Hertz (Hz) und den Pegel in Dezibel relativ zur digitalen Vollaussteuerung (dBFS). Die Spitzen zeigen, in welchen Frequenzbereichen die analysierte Aufnahme die meiste Energie enthält.

## So zeigst du ein Audiospektrum an

1. Wähle eine Mono- oder Stereodatei im Format WAV, MP3, M4A, FLAC oder OGG aus oder ziehe sie auf das Tool. Welche Dateien sich öffnen lassen, hängt von deinem Browser ab.
2. Prüfe die stärkste Frequenz. Fahre mit dem Zeiger zu einer anderen Stelle im Diagramm oder tippe darauf, um Frequenz und Pegel abzulesen. Mit dem Schieberegler kannst du dieselben Werte per Tastatur ablesen.
3. Wechsle bei Bedarf zwischen logarithmischer und linearer Skala. Spiele die Originaldatei ab, um dir die Aufnahme beim Lesen des Diagramms anzuhören. Analyse und Wiedergabe laufen auf deinem Gerät.

## So liest du das FFT-Diagramm

Das Tool dekodiert die Datei mit 48 kHz und untersucht kurze Abschnitte aus der gesamten Aufnahme. Es gewichtet die Abschnitte mit einem Hann-Fenster und analysiert sie per schneller Fourier-Transformation (FFT). Anschließend mittelt es die Leistung und führt bei Stereo die Leistung der beiden Kanäle zusammen. Dadurch bleiben auch Signale sichtbar, die auf beiden Kanälen gegenphasig sind. Das Diagramm reicht bis 24 kHz. Die Pegel beziehen sich auf einzelne Frequenzintervalle. Sie unterscheiden sich von der Gesamtlautstärke, dem höchsten Samplepegel und der integrierten Lautheit in LUFS.

Ein schmaler Peak bei etwa 50 oder 60 Hz kann auf Netzbrummen hindeuten. Ein abrupter Abfall bei hohen Frequenzen kann von Filtern oder verlustbehafteter Kompression stammen. Eine einzelne Spitze kann eine Harmonische sein. Prüfe deshalb weitere Spitzen in der Nähe, bevor du daraus die Tonhöhe ableitest.

## Wann nutze ich die logarithmische, wann die lineare Frequenzskala?

Auf der logarithmischen Skala haben Bässe und Mitten mehr Platz. Oktaven sind dadurch leichter zu verfolgen. Auf der linearen Skala nehmen gleiche Unterschiede in Hz immer gleich viel Platz ein. Das hilft beim Vergleich gleichmäßig verteilter Harmonischer. Dieses Diagramm fasst die Frequenzanteile der Aufnahme zusammen. Ein Spektrogramm ist sinnvoll, wenn du sehen willst, wann ein Klang auftritt oder wie sich seine Frequenz mit der Zeit ändert.

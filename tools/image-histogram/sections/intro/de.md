## So öffnest du ein Bildhistogramm

Wähle ein Foto, einen Screenshot oder eine Illustration aus oder ziehe die Datei auf die Seite. Das Histogramm erscheint neben der Bildvorschau. Du kannst auch das Beispielfoto ausprobieren. Unter **Helligkeit** siehst du, wie die Tonwerte insgesamt verteilt sind. Wechsle zu **RGB**, um Rot, Grün und Blau auf derselben Skala zu vergleichen. Für eine genauere Betrachtung kannst du einen einzelnen Kanal auswählen.

## So liest du Tiefen, Mitteltöne und Lichter ab

Die horizontale Achse reicht von 0 (am dunkelsten) bis 255 (am hellsten). Links liegen die Tiefen, in der Mitte die Mitteltöne und rechts die Lichter. Je höher der Balken, desto mehr Pixel haben diesen Tonwert. Die genaue Pixelanzahl siehst du, wenn du mit der Maus über das Diagramm fährst, darauf tippst oder den Tonwertregler mit den Pfeiltasten bedienst.

Eine Spitze an einem Ende kann auf zugelaufene Tiefen oder ausgefressene Lichter hinweisen. An solchen Stellen können Details verloren gehen. Eine Spitze bei 255 im Rotkanal kann beispielsweise auf Clipping im Rotkanal hindeuten, selbst wenn das Helligkeitshistogramm rechts noch Platz hat. Auch ein rein weißer Hintergrund kann eine Spitze erzeugen. Schau dir zur Einordnung die Bildvorschau an. **Tiefen** und **Lichter** geben an, wie viel Prozent der analysierten Pixel genau den Tonwert 0 beziehungsweise 255 haben.

## Wann eine logarithmische Skala hilft

Mit der Einstellung **Linear** ist die Balkenhöhe direkt proportional zur Pixelanzahl. Probiere **Logarithmisch**, wenn eine große einfarbige Fläche den Rest des Histogramms schwer erkennbar macht. Beide Skalen verwenden dieselben Pixelzahlen und bilden sie auf unterschiedliche Balkenhöhen ab.

## Was der Betrachter misst

Der Betrachter zählt die Pixel des vom Browser gerenderten 8-Bit-Bildes in Originalgröße. Für die Helligkeit werden die Rot-, Grün- und Blauwerte gewichtet. Grün hat das größte Gewicht. Vollständig transparente Pixel werden übersprungen. Jedes teilweise transparente Pixel zählt einmal. Beim Rendern können seine RGB-Werte gerundet werden. Bei animierten Bildern wird ein Einzelbild analysiert. Die Verarbeitung findet auf deinem Gerät statt.

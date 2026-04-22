## Was ist ein CSS-Verlauf?

Erstellen Sie lineare, radiale und konische Verläufe mit ziehbaren Farbstopps, Mischmodi und einsatzbereitem CSS.

Ein CSS-Verlauf ist ein vom Browser erzeugtes Bild, das aus einem weichen Übergang zwischen Farben besteht. Da er zur Renderzeit berechnet wird, skaliert er ohne Pixelbildung in jede Größe und benötigt keine Bilddateien.

Es gibt drei Typen: linear (Richtung oder Winkel), radial (Kreis oder Ellipse von einem Zentrum) und konisch (eine Drehung um ein Zentrum). Jeder Verlauf wird durch Farbstopps definiert; jeder Stopp kann eine Position und Alpha enthalten, um das Mischen zu steuern.

Mehrere Verläufe lassen sich in background-image durch Kommas stapeln und mit background-blend-mode kombinieren, um reichere Texturen zu erzeugen. CSS unterstützt außerdem unterschiedliche Interpolationsfarbräume wie oklch für gleichmäßigere Übergänge.

- Lineare Verläufe eignen sich gut für Licht und gerichtete Tiefe.
- Radiale und konische Verläufe sind nützlich für Spotlights, Ringe und Farbräder.
- Passe Stopp-Positionen an, um Übergänge härter oder weicher zu machen.

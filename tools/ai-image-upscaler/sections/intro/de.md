## Wie skaliere ich ein Bild mit KI hoch?

1. Wähle ein JPG-, PNG- oder WebP-Bild aus oder ziehe es in das Feld. Verwende die beste verfügbare Kopie, auch wenn sie klein ist.
2. Wähle **2×** oder **4×** und prüfe die Ausgabegröße. Aus 400 × 300 Pixeln werden bei 2× 800 × 600 Pixel und bei 4× 1600 × 1200 Pixel.
3. Wähle **Bild hochskalieren** und bewege den Vergleichsregler, um Kanten und Strukturen zu prüfen. Lade das Ergebnis als verlustfreie PNG-Datei herunter.

## Was bedeutet KI-Superauflösung bei Bildern?

Superauflösung erhöht die Pixelmaße eines niedrig aufgelösten Bildes. InBrowser.App verwendet Real-ESRGAN, ein trainiertes Modell, das aus den vorhandenen Pixeln feinere Kanten und Strukturen ableitet. Kleine Fotos, Illustrationen und komprimierte Webbilder können dadurch bei der Vergrößerung schärfer wirken. Prüfe Gesichter, kleine Schrift und feine Muster in der Vorschau. Die errechneten Details können vom Originalmotiv abweichen.

## Wann ist 2× oder 4× sinnvoll?

Wähle 2× für eine moderate Vergrößerung, etwa wenn ein Vorschaubild mehr Platz in einem Layout einnehmen soll. Wähle 4×, wenn ein Bild deutlich größer erscheinen soll, zum Beispiel ein kleiner Scan. Verdoppelst du Breite und Höhe, erhältst du viermal so viele Pixel. Vervierfachst du beide Seiten, sind es sechzehnmal so viele. Das Originalbild darf pro Seite höchstens 2.048 Pixel und insgesamt maximal 1 Megapixel haben.

## Wird das Bild auf meinem Gerät hochskaliert?

Ja. Dein Browser lädt das Real-ESRGAN-Modell herunter, wenn du zum ersten Mal ein Bild hochskalierst. Die Verarbeitung läuft auf deinem Gerät. Bei Verfügbarkeit nutzt der Browser WebGPU, andernfalls kann er die CPU über WebAssembly einsetzen. Der erste Durchlauf kann länger dauern. Die Verarbeitungszeit hängt von der Bildgröße und deinem Gerät ab. Das Bild bleibt die ganze Zeit auf deinem Gerät.

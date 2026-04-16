## Was ist Base85?

Base85 ist eine Binär-zu-Text-Kodierung, die 4 Byte in 5 druckbare Zeichen umwandelt. Sie ist kompakter als Base64, und mit diesem Tool kannst du je nach Zielsystem zwischen ASCII85 und Z85 wählen.

## Wann solltest du es verwenden?

- Wenn rohe Bytes, Text oder Dateien über reine Textkanäle übertragen werden müssen und die Ausgabe möglichst kompakt bleiben soll.
- Verwende ASCII85, wenn du ein flexibles Base85-Format brauchst, das unvollständige Restbytes unterstützt.
- Verwende Z85, wenn du ZeroMQ-kompatiblen Base85-Text brauchst und die Eingabelänge ein exaktes Vielfaches von 4 Byte ist.

## Was du beachten solltest

- Base85 ist ein Kodierungsformat, keine Verschlüsselung.
- ASCII85 und Z85 verwenden unterschiedliche Alphabete und sind nicht austauschbar.
- Z85 lehnt Daten ab, deren Byte-Länge nicht durch 4 teilbar ist, während ASCII85 partielle Schlussblöcke kodieren kann.

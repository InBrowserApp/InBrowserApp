# CRC-Prüfsummenrechner

CRC-Prüfsummen (Cyclic Redundancy Check) sind kompakte Werte, mit denen
versehentliche Datenänderungen erkannt werden. Sie sind üblich in
Netzwerk-Frames, Archivformaten, eingebetteten Protokollen, Firmware-Updates
und Workflows zur Dateiintegrität, bei denen ein schneller Fehlererkennungswert
nützlicher ist als eine kryptografische Signatur.

## Wann verwenden

Verwenden Sie diesen Rechner, wenn Sie CRC-Werte aus Dokumentationen,
Hardware-Protokollen, Dateiformaten oder einem anderen System vergleichen
müssen. Fügen Sie Text für schnelle Prüfungen ein oder importieren Sie eine
Datei, wenn die Prüfsumme aus dem exakten Bytestrom berechnet werden muss.

## Unterstützte Varianten

Das Tool berechnet die gängigen Varianten aus dem alten CRC-Tool von
InBrowser.App: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16,
CRC-16 CCITT, CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32,
CRC-32 MPEG-2, CRCJAM und mehrere CRC-64-Modelle, darunter ECMA-182, GO-ISO,
MS, NVME, REDIS, WE und XZ.

## Worauf zu achten ist

Die Namen von CRC-Varianten sind wichtig. Dieselbe Eingabe kann je nach
Polynom, Initialwert, Reflexionseinstellungen und finalem XOR unterschiedliche
Werte erzeugen. Wenn Sie ein Protokoll oder eine Herstellerspezifikation
abgleichen, wählen Sie das Ergebnis aus, dessen Variantenname dieser
Spezifikation entspricht, statt jede CRC-Breite als austauschbar zu behandeln.

CRC ist für die Erkennung versehentlicher Fehler gedacht, nicht für
Passwortspeicherung, Signaturen oder manipulationssichere Sicherheit. Für
sicherheitssensitive Prüfungen sollten Sie stattdessen einen kryptografischen
Hash oder einen Signatur-Workflow verwenden.

## Was dieses Tool konvertiert

Dieser Konverter behandelt eine UUID als den 128-Bit-Wert, der sie wirklich ist,
und hält die gängigen Darstellungen synchron. Fügen Sie eine UUID, einen
Base64-Wert, eine hexadezimale Zeichenfolge, eine dezimale Ganzzahl, einen
oktalen Wert oder einen Binärwert ein, und die anderen Formate werden lokal in
Ihrem Browser aktualisiert.

## So lesen Sie die Formate

Das UUID-Feld zeigt die kanonische Form mit Bindestrichen. Hexadezimal sind
dieselben 16 Bytes als 32 kleingeschriebene Hex-Ziffern. Base64 ist
standardmäßiges Base64 mit Padding für die rohen 16 Bytes, nicht Base64 für die
Textzeichen der UUID. Dezimal, oktal und binär zeigen die UUID als eine
vorzeichenlose 128-Bit-Ganzzahl; die Binärausgabe wird links auf alle 128 Bits
aufgefüllt, damit führende Nullen sichtbar bleiben.

## Worauf Sie achten sollten

Werte außerhalb des 128-Bit-UUID-Bereichs werden abgelehnt. Base64-Eingaben
müssen genau 16 Bytes dekodieren. Der Konverter akzeptiert gängige eingefügte
Varianten wie UUIDs in Großschreibung, `urn:uuid:`-Präfixe, Klammern, kompakte
UUIDs mit 32 Hex-Zeichen, Leerraum um lange numerische Werte und URL-sicheres
Base64. Beim Konvertieren oder Erzeugen der Beispiel-UUID wird nichts
hochgeladen.

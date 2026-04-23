## Was ist SHAKE256 (FIPS 202)?

SHAKE256 (FIPS 202) ist eine Extendable-Output-Function (XOF) aus der SHA-3-Familie. Anders als Hashfunktionen mit fester Länge kann sie Ausgaben mit beliebiger Bitlänge liefern und bietet dabei eine Sicherheitsstärke von 256 Bit. Sie ist von NIST in FIPS 202 standardisiert und basiert auf der Keccak-Sponge-Konstruktion.

Diese Flexibilität ist wichtig, wenn ein Protokoll, ein Dateiformat oder eine interne Prüfsummenregel eine bestimmte Digest-Länge erwartet. In diesem Tool kannst du Klartext oder hochgeladene Dateien hashen und die Ausgabelänge in Bit festlegen, solange sie ein Vielfaches von 8 ist.

Typische Einsatzgebiete sind Protokoll-Hashing, Schlüsselableitung, kryptografische Digests mit variabler Länge und Workflows zur Datenintegrität, bei denen dieselbe Eingabe und dieselbe Ausgabelänge immer dasselbe Ergebnis liefern müssen.

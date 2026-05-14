## Was ist HighwayHash?

HighwayHash ist eine schnelle schlüsselbasierte Hash-Funktion, die von Google für Fingerprints mit hohem Durchsatz und Integritätsprüfungen entwickelt wurde. Sie verwendet einen 256-Bit-Schlüssel und kann aus derselben Text- oder Dateieingabe eine 64-Bit-, 128-Bit- oder 256-Bit-Ausgabe erzeugen.

## Wann es verwendet werden sollte

- Erstelle deterministische schlüsselbasierte Prüfsummen für Cache-Schlüssel, Objekt-IDs, Sharding oder interne Nachschlagetabellen.
- Vergleiche Dateien oder Text-Nutzdaten mit demselben Schlüssel, wenn Geschwindigkeit wichtiger ist als breite kryptografische Kompatibilität.
- Erzeuge 128-Bit- oder 256-Bit-Fingerprints, wenn ein größerer Nicht-Passwort-Hash für Integritäts-Workflows nützlich ist.

## Schlüssel- und Ausgabeoptionen

Gib den Schlüssel als genau 32 Byte hexadezimaler Daten ein, zum Beispiel `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Das `0x`-Präfix ist optional, und das Tool akzeptiert Leerzeichen, Doppelpunkte, Bindestriche und Unterstriche, damit lange Schlüssel leichter lesbar sind. Wenn du den Schlüssel leer lässt, wird der Standardschlüssel der Bibliothek verwendet. Das ist praktisch für schnelle Prüfungen, sollte aber nicht als geheim behandelt werden.

## Sicherheitshinweise

HighwayHash ist kein Ersatz für HMAC, digitale Signaturen oder Passwort-Hashing. Verwende es für schnelle schlüsselbasierte Fingerprints und Prüfsummen-Workflows, nicht zum Nachweisen von Authentizität über Systeme hinweg, die kryptografische Standardverifikation benötigen.

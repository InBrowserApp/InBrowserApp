## Was ist SipHash-128-2-4?

SipHash-128-2-4 ist eine schnelle schlüsselbasierte Hash-Funktion, die für kurze Nachrichten und den Schutz von Hash-Tabellen entwickelt wurde. Sie verwendet einen geheimen 128-Bit-Schlüssel und erzeugt eine 128-Bit-Ausgabe, die üblicherweise als 32-stelliger Hexadezimalwert angezeigt wird.

## Wann es verwendet werden sollte

- Schütze serverseitige Hash-Tabellen vor Hash-Flooding-Angriffen, solange der Schlüssel privat bleibt.
- Erstelle deterministische schlüsselbasierte Prüfsummen für Cache-Schlüssel, Sharding oder interne Nachschlagetabellen.
- Vergleiche Textausschnitte oder Dateien mit demselben Schlüssel, wenn keine kryptografische Authentifizierung erforderlich ist.

## Schlüsselformat

Gib den Schlüssel als genau 16 Byte hexadezimaler Daten ein, zum Beispiel `0x000102030405060708090a0b0c0d0e0f`. Das `0x`-Präfix ist optional, und das Tool akzeptiert Leerzeichen, Doppelpunkte, Bindestriche und Unterstriche, damit lange Schlüssel leichter lesbar sind.

## Sicherheitshinweise

SipHash-128-2-4 ist kein Ersatz für HMAC, digitale Signaturen oder Passwort-Hashing. Verwende es für schlüsselbasierte Hash-Tabellen- und Prüfsummen-Workflows, nicht zum Nachweisen von Authentizität über Systeme hinweg, die kryptografische Sicherheitsgarantien benötigen.

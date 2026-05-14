## Was ist scrypt?

scrypt ist eine speicherharte passwortbasierte Schlüsselableitungsfunktion (KDF). Sie wandelt ein Passwort und Salt in deterministische Schlüsselbytes um und verbraucht dabei absichtlich CPU-Zeit und Speicher, wodurch groß angelegtes Passwortraten teurer wird als einfaches Hashing.

**Kernpunkte:**

- Verwendet `N` (Kostenfaktor), `r` (Blockgröße) und `p` (Parallelität)
- Höhere Einstellungen für `N` und `r` erhöhen Speicherbedarf und Rechenaufwand
- Erzeugt nur dann denselben abgeleiteten Schlüssel, wenn Passwort, Salt, Parameter und Ausgabelänge übereinstimmen

**Best Practices:**

- Verwenden Sie für jedes Passwort oder Geheimnis ein eindeutiges, zufälliges Salt
- Speichern Sie `N`, `r`, `p`, Salt-Format und Ausgabelänge neben dem abgeleiteten Schlüssel
- Stimmen Sie die Parameter auf dem langsamsten Gerät ab, das Sie unterstützen müssen, bevor Sie sie in Produktion verwenden

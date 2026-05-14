## Was ist MurmurHash3 (x64 128-bit)?

MurmurHash3 ist ein schneller nicht-kryptografischer Hash-Algorithmus, der für
wiederholbare, gut verteilte Prüfsummen entwickelt wurde. Die x64
128-bit-Variante gibt einen 16-Byte-Wert zurück, der meist als 32
hexadezimale Zeichen dargestellt wird. Dadurch eignet sie sich besser als
32-bit-Hashes, wenn Sie einen breiteren Identifikator für große Mengen von
Datensätzen, Dateien oder Cache-Schlüsseln benötigen.

**Wobei es hilft:**

- **Hash-Tabellen und Sharding**: Erstellen Sie stabile Schlüssel für Buckets,
  Partitionen oder Lookup-Tabellen.
- **Deduplizierung**: Vergleichen Sie große Text- oder Dateimengen mit
  kompakten 128-bit-Fingerprints, bevor tiefere Prüfungen ausgeführt werden.
- **Cache-Schlüssel**: Erzeugen Sie deterministische Identifikatoren für
  Build-Artefakte, transformierte Daten oder generierte Inhalte.
- **Nicht sicherheitsbezogene Integritätsprüfungen**: Erkennen Sie
  versehentliche Änderungen während Speicherung oder Übertragung, wenn keine
  kryptografischen Garantien erforderlich sind.

**Seed-Verhalten:**

Der optionale Seed ist ein vorzeichenloser 32-bit-Wert. Verwenden Sie denselben
Seed, wenn die Ergebnisse mit einem anderen System übereinstimmen müssen, und
belassen Sie ihn bei `0`, wenn es keine konkrete Kompatibilitätsanforderung
gibt. Dezimalwerte und hexadezimale Werte mit `0x` werden akzeptiert; größere
Werte werden auf denselben 32-bit-Bereich zurückgeführt, den der Algorithmus
verwendet.

**Sicherheitshinweise:**

MurmurHash3 ist kein Algorithmus für Passwort-Hashing, Signaturen oder
manipulationssichere Verifikation. Verwenden Sie SHA-256, HMAC oder ein
Passwort-Hashing-Tool, wenn die Ausgabe Sicherheitseigenschaften erfüllen
muss. Dieses Tool eignet sich am besten für lokales, offline ausgeführtes,
leistungsorientiertes Hashing, bei dem Geschwindigkeit und stabile Verteilung
wichtiger sind als Angriffsresistenz.

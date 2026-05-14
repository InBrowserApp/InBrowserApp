## Was ist CityHash64?

CityHash64 ist ein schneller, nicht-kryptografischer Hash-Algorithmus von Google, der einen 64-Bit-Wert (8 Byte) erzeugt. Er ist nuetzlich, wenn Sie einen kompakten, deterministischen Fingerabdruck fuer Text oder Dateien benoetigen und Geschwindigkeit wichtiger ist als kryptografische Sicherheit.

**Wichtige Merkmale:**

- **Schnell und deterministisch**: Dieselbe Eingabe und derselbe Seed erzeugen immer denselben 64-Bit-Hash
- **Nicht-kryptografisch**: Verwenden Sie CityHash64 nicht fuer Passwoerter, Signaturen, Token oder manipulationssichere Integritaetspruefungen
- **Seed-faehig**: Lassen Sie den Seed fuer Standard-CityHash64 leer, oder geben Sie einen dezimalen oder hexadezimalen Seed mit `0x` ein, wenn Sie einen separaten Seed-Hashraum benoetigen
- **Lokale Verarbeitung**: Text und Dateien werden im Browser gehasht; hochgeladene Dateien werden nicht an einen Server gesendet
- **Mehrere Kodierungen**: Ergebnisse werden als hexadezimale, Base64-, dezimale und binaere Werte angezeigt

**Haeufige Verwendungen:**

- Hash-Tabellen und Datenstrukturen
- Nicht sicherheitsrelevante Datei-Fingerabdruecke
- Datendeduplizierung und Bucketing
- Cache-Schluessel und Sharding-Schluessel
- Regressions-Fixtures fuer Systeme, die bereits CityHash64 verwenden
- Datenbankindizierung

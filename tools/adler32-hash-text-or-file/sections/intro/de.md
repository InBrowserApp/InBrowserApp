## Was ist Adler-32?

Adler-32 ist ein schneller Prüfsummen-Algorithmus, der einen 32-Bit-Wert ausgibt (meist 8 hexadezimale Zeichen). Er ist für die Erkennung zufälliger Fehler gedacht, nicht für kryptografische Sicherheit.

**Wichtige Punkte:**

- **Schnell und deterministisch**: Gleiche Eingabe ergibt immer gleiche Ausgabe
- **Integritätsprüfung**: Nützlich zur Erkennung von Übertragungs- oder Speicherfehlern
- **Nicht kryptografisch**: Nicht für Passwörter, Signaturen oder Manipulationsschutz verwenden

**Häufige Einsatzfälle:**

- Dateiübertragungs-Prüfung
- Archiv-/Paket-Prüfung
- Leichte Integritätsprüfungen

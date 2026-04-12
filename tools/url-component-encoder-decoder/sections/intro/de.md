## Was ist URL-Codierung?

URL-Codierung (auch Prozent-Codierung genannt) ist eine Methode, um Sonderzeichen in ein Format zu konvertieren, das sicher über das Internet übertragen werden kann. URLs können nur bestimmte Zeichen enthalten, daher müssen alle nicht erlaubten Zeichen codiert werden.

**Wie es funktioniert:**

- Sonderzeichen werden zu `%` gefolgt von ihrem hexadezimalen ASCII-Code konvertiert
- Beispiel: ein Leerzeichen wird zu `%20`, `@` wird zu `%40`
- Nur Buchstaben (A-Z, a-z), Zahlen (0-9) und einige Symbole (- \_ . ~) benötigen keine Codierung

**Häufige Beispiele:**

- Leerzeichen → `%20`
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Warum es benötigt wird:**

- URLs haben reservierte Zeichen mit besonderen Bedeutungen
- Stellt sicher, dass Daten korrekt übertragen werden
- Verhindert Konflikte mit der URL-Struktur
- Erforderlich für Web-Formulare und API-Aufrufe

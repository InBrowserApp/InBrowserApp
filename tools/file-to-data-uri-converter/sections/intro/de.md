## Was ist Data URI?

Data URI (oder data URL) bettet kleine Dateien direkt in Text ein. Format: `data:[mime][;charset][;base64],data`.

**Häufige Nutzung:**

- Inline-Bilder oder -Schriften in HTML/CSS
- Kleine Assets in JSON/Configs speichern

**Hinweise:**

- Geeignet für kleine Dateien; große Strings können Seiten verlangsamen
- Base64 ist üblich für Binärdaten

### Beispiel

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Alles vor dem Komma beschreibt die Datei, zum Beispiel ihren MIME-Typ und ob Base64 verwendet wird. Alles nach dem Komma ist die codierte Nutzlast.

### Wann dieser Konverter sinnvoll ist

- Eine lokale Datei in eine einbettbare Zeichenkette für HTML, CSS, JSON oder E-Mail-Markup umwandeln
- Eine schnelle eigenständige Demo erstellen, ohne die Datei irgendwo hosten zu müssen
- Den erkannten MIME-Typ prüfen, bevor das Ergebnis in ein anderes Tool eingefügt wird

### Praktische Grenzen

- Data URIs eignen sich am besten für kleine Dateien wie Icons, kleine Bilder oder kurze Snippets
- Base64 erzeugt ungefähr 33 % Overhead, daher ist die fertige Zeichenkette größer als die Originaldatei
- Sehr lange Zeichenketten lassen sich in Formularen, Konfigurationen oder Editoren mit Größenlimits oft schlecht einfügen

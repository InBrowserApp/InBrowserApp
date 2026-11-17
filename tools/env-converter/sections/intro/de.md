## Umgebungskonfiguration konvertieren

Fügen Sie eine `.env`-Datei ein und wählen Sie JSON oder YAML, oder konvertieren Sie ein flaches JSON/YAML-Objekt zurück in `.env`. Importieren Sie lokale Dateien, tauschen Sie Eingabe und Ausgabe und kopieren Sie das Ergebnis oder laden Sie es herunter. Alles läuft in Ihrem Browser; die Konfiguration wird weder hochgeladen noch im Browserverlauf oder im lokalen Speicher abgelegt.

### Werte und Anführungszeichen

Umgebungsvariablen sind Zeichenfolgen: `PORT=3000`, `DEBUG=false` und `CODE=0012` bleiben `"3000"`, `"false"` und `"0012"`. Zahlen und boolesche Werte aus JSON/YAML werden in Zeichenfolgen umgewandelt. Null, Arrays und verschachtelte Objekte benötigen einen ausdrücklich angegebenen Zeichenfolgenwert. Setzen Sie YAML-Werte wie `0012` in Anführungszeichen, wenn ihre genaue Schreibweise erhalten bleiben soll.

Der Parser unterstützt Leerzeilen, `#`-Kommentare, ein `export`-Präfix sowie einfache, doppelte oder Backtick-Anführungszeichen mit mehrzeiligen Werten. Nur die Sequenzen `\n` und `\r` in doppelten Anführungszeichen werden aufgelöst. Anführungszeichen und Backslashes bleiben ansonsten unverändert, entsprechend dem üblichen dotenv-Verhalten. Schlüssel dürfen Buchstaben, Ziffern und Unterstriche enthalten und nicht mit einer Ziffer beginnen. Die Ausgabe wählt eine Art von Anführungszeichen, die den Wert unverändert erhält.

### Konfigurationsprüfung

Doppelte `.env`-Schlüssel werden mit ihren Zeilennummern angezeigt; die letzte Definition wird verwendet. Fehlende schließende Anführungszeichen, Text nach schließenden Anführungszeichen und ungültige Zuweisungen führen zu Fehlermeldungen mit Links zur betroffenen Zeile. Typografische Anführungszeichen erzeugen eine Warnung. Doppelte Schlüssel in JSON/YAML sind Fehler.

Kommentare, die ursprüngliche Art der Anführungszeichen und die Formatierung bleiben nicht erhalten. Verweise wie `${NAME}` und Shell-Befehle bleiben unverändert und werden niemals ausgeführt. Verschiedene `.env`-Lader verwenden unterschiedliche Regeln; dieses Tool folgt dem dokumentierten Teilumfang, statt Shell-Skripte zu interpretieren.

Siehe die [.env-Spezifikation von Node.js](https://nodejs.org/api/environment_variables.html#dotenv) und die [Parsing-Regeln von dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).

## Was ist chmod?

`chmod` ("change mode") ist ein Unix/Linux-Befehl zum Ändern von Datei- und Verzeichnisberechtigungen. Mit diesem Rechner kannst du zwischen numerischen Rechten wie `755`, symbolischen Rechten wie `rwxr-xr-x` und der Checkbox-Matrix wechseln, ohne die Werte von Hand zusammenzurechnen.

## Wie numerische Berechtigungen funktionieren

Jede Ziffer steht für eine Rolle: Eigentümer, Gruppe und Andere. Innerhalb einer Ziffer bedeutet `4` Lesen, `2` Schreiben und `1` Ausführen. Durch Addieren entstehen die gewünschten Rechte: `7 = rwx`, `6 = rw-`, `5 = r-x` und `4 = r--`. Bei Verzeichnissen bedeutet das Ausführungsbit außerdem, dass man das Verzeichnis betreten darf.

## Häufige chmod-Beispiele

- `chmod 755 script.sh` gibt dem Eigentümer vollen Zugriff und erlaubt allen anderen Lesen und Ausführen.
- `chmod 644 notes.txt` lässt den Eigentümer weiter schreiben, während alle anderen nur lesen dürfen.
- `chmod 600 .env` ist eine häufige Wahl für geheime Dateien, weil nur der Eigentümer lesen und schreiben darf.
- `chmod 775 shared-folder` ist praktisch für Team-Verzeichnisse, wenn auch die Gruppe Dateien erstellen und ändern können soll.

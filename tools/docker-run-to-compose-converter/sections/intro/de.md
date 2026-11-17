## Was das Tool macht

Der Docker-Run-zu-Compose-Konverter wandelt einen oder mehrere `docker run`-Befehle direkt im Browser in eine `docker-compose.yml`-Datei um. Du kannst das erzeugte YAML prüfen, kopieren oder herunterladen, bevor du es in dein Projekt übernimmst.

## Wann du es verwenden solltest

Verwende es, wenn du einen spontan ausgeführten Container-Befehl in eine wiederholbare Compose-Dienstdefinition umwandeln möchtest oder sehen willst, wie Ports, Volumes, Umgebungsvariablen und Ressourcenoptionen in Compose abgebildet werden.

## Was dich erwartet

Übliche Optionen wie Ports, Umgebungsvariablen, Neustartrichtlinien, Healthchecks, Einbindungen und Ressourcenlimits bleiben erhalten. Nicht unterstützte oder mehrdeutige Flags werden als Warnungen angezeigt, damit du die Ausgabe vor der Verwendung prüfen kannst.

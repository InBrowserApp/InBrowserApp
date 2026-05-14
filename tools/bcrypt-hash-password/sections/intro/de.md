## Was ist bcrypt?

bcrypt ist ein Passwort-Hashing-Algorithmus, der für die Speicherung von Passwörtern entwickelt wurde. Er kombiniert das Passwort mit einem zufälligen Salt und wiederholt anhand eines Kostenfaktors rechenintensive Arbeitsschritte, sodass Angreifer mehr Zeit benötigen, um jeden Versuch zu testen.

## Wann dieses Tool verwenden

- Erzeugen Sie einen bcrypt-Hash für ein Testkonto, ein Seed-Skript oder eine lokale Entwicklungsumgebung.
- Vergleichen Sie, wie unterschiedliche Kostenfaktoren das Ausgabeformat und die Laufzeit verändern.
- Erstellen Sie einen kopierfertigen Hash, ohne das Passwort an einen Server zu senden.

## So wählen Sie den Kostenfaktor

Höhere Kostenwerte sind langsamer und in der Regel sicherer, verlangsamen aber auch jeden Anmeldeversuch in Ihrer Anwendung. Ein Kostenfaktor um 10-12 ist für interaktive Systeme üblich; höhere Werte können für reine Admin- oder wenig frequentierte Workflows sinnvoll sein. Testen Sie den Kostenfaktor auf derselben Art von Hardware, die später das Passwort verifizieren wird.

## Was Sie beachten sollten

- Jeder erzeugte Hash verwendet ein frisches zufälliges Salt, daher ändert sich die Ausgabe auch dann, wenn Passwort und Kostenfaktor gleich bleiben.
- Speichern Sie den bcrypt-Hash, nicht das ursprüngliche Passwort.
- Verwenden Sie bcrypt für Passwörter, nicht für Datei-Prüfsummen, Signaturen oder allgemeines Hashing.
- Halten Sie das Verifizierungsverhalten konstant und vermeiden Sie offenzulegen, ob ein Benutzerkonto existiert.

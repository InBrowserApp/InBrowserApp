## Was ist ein User-Agent?

Ein User-Agent (UA)-String identifiziert den Browser oder die App, die eine Anfrage stellt, und enthält meist Browser-, Betriebssystem-, Geräte- und Engine-Details. Da UA-Strings gefälscht werden können, sollte man sie als Hinweis und nicht als Sicherheitssignal verwenden.

### Was dieser Parser anzeigt

Dieses Tool analysiert die eingefügte UA-Zeichenfolge lokal in deinem Browser und ordnet das Ergebnis nach Browser, Betriebssystem, Engine, Gerät, CPU und JSON-Ausgabe. Es wird nichts hochgeladen.

### Beispiel

Füge zum Beispiel eine übliche Chrome-auf-Windows-Zeichenfolge wie diese ein:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Das Ergebnis sollte Chrome 115 unter Windows 10 sowie die Blink-Engine und die amd64-CPU-Architektur erkennen.

### Wichtiger Hinweis

Moderne Browser verlassen sich zunehmend auf Client Hints. Eine kopierte UA-Zeichenfolge zeigt daher nicht immer alles, was eine Website bei einer echten Anfrage sehen kann.

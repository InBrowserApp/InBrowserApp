## Ein WARC-Webarchiv öffnen

Wähle eine `.warc`- oder `.warc.gz`-Datei aus, ziehe sie in den Betrachter oder öffne das Beispielarchiv. Der Betrachter erstellt eine Liste der Archivdatensätze und öffnet die erste archivierte HTML-Seite, die er findet. Filtere nach URL oder Datensatztyp, um eine Aufnahme zu finden, und wechsle dann zwischen Seitenvorschau und Datensatzdetails. Das Indexieren eines großen Archivs kann eine Weile dauern. Die Datei bleibt in deinem Browser.

## Erfassungszeitpunkte und Header lesen

Eine Web-ARChive-Datei (WARC) speichert Datensätze, die ein Crawler oder Archivierungswerkzeug beim Besuch einer Website erfasst. Zu einer URL kann es mehrere Datensätze geben. Am Erfassungszeitpunkt in UTC und am ursprünglichen HTTP-Status erkennst du, um welche Aufnahme es sich handelt. Ein Antwortdatensatz enthält die Antwort des Servers. Ein Anfragedatensatz beschreibt, was der Crawler gesendet hat. Ein Wiederbesuchsdatensatz kann auf eine andere Aufnahme verweisen, ohne die Seite erneut zu speichern. Diese Datensätze lassen sich auch ohne Seitenvorschau prüfen.

## Was zeigt die Vorschau?

Die statische Vorschau verwendet HTML und unterstützte Bilder und Stylesheets aus demselben Archiv. Fehlende Ressourcen können das Layout verändern oder Lücken hinterlassen. Skripte sind deaktiviert und die Vorschau sendet keine Anfragen an die ursprüngliche Website. Interaktive Funktionen wie die Anmeldung und Videowiedergabe stehen daher nicht zur Verfügung. Der Betrachter unterstützt WARC 1.0 und 1.1, auch mit gzip-komprimierten Datensätzen.

[Spezifikation des WARC-Formats](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)

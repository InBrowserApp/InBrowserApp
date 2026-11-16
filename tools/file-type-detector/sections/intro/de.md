## So funktioniert die Dateityp-Erkennung

Dieses Werkzeug liest bis zu den ersten 64 KiB einer lokalen Datei und prüft
ihre binäre Signatur mit [file-type](https://github.com/sindresorhus/file-type).
Das Ergebnis enthält einen erkannten MIME-Typ, erwartete Dateiendungen und
eine Vorschau der ersten 256 Bytes in Hexadezimal und ASCII. Es wird nichts
hochgeladen.

## Warum eine Dateiendung abweichen kann

Das Umbenennen einer Datei ändert ihren Namen, nicht ihren Inhalt. Eine PNG
namens photo.jpg hat weiterhin eine PNG-Signatur. Gängige alternative Endungen
wie .jpg und .jpeg werden akzeptiert. Der vom Browser gemeldete MIME-Typ wird
separat angezeigt, da er häufig dem Dateinamen folgt, statt die Bytes zu prüfen.

## Grenzen der Erkennung

Signaturen sind Hinweise und kein Beweis dafür, dass eine Datei gültig oder
sicher ist. Textformate wie TXT, CSV und SVG werden möglicherweise nicht erkannt.
Ein kurzer Ausschnitt kann ZIP oder einen anderen Container erkennen, ohne
dessen Untertyp, etwa ein Office-Dokument, zu bestätigen. Die Hex-Vorschau zeigt
den rohen Dateiinhalt und ist keine kryptografische Prüfsumme.

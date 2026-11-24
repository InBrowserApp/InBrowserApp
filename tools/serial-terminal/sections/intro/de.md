## So verwendest du das serielle Terminal im Browser

Verbinde deinen Arduino, ESP32, Raspberry Pi Pico oder USB-Seriell-Adapter mit einem Datenkabel. Stelle die vom Gerät verwendete Baudrate ein, zum Beispiel 9600 oder 115200. Wähle dann **Verbinden** und im Browser den zugehörigen Anschluss aus. Dieser serielle Monitor verwendet 8 Datenbits, keine Parität, ein Stoppbit und keine Flusssteuerung (8N1).

## Text und Hex-Bytes senden

Text wird in UTF-8 gesendet. Wähle LF, CR oder CR + LF, wenn dein Gerät ein Zeilenende zum Übermitteln von Befehlen benötigt. Für binäre Befehle wähle **Hex** und gib vollständige Bytes wie `41 54 0D 0A` ein. Im Hex-Modus werden die Bytes wie eingegeben und ohne automatisches Zeilenende gesendet.

## Serielle Protokolle lesen und speichern

Das Protokoll zeigt empfangene (RX) und gesendete (TX) Daten mit Zeitstempeln. Wechsle zu Hex, um einzelne Bytes zu prüfen, wenn Text unleserlich erscheint. Pausiere das Scrollen, um einen früheren Eintrag anzusehen, während weiterhin Daten eingehen, oder lade das noch vorhandene Protokoll als Textdatei herunter. Serielle Daten bleiben in diesem Tab, bis du sie speicherst.

## Warum kann ich keine Verbindung zu meinem Gerät herstellen?

Verwende einen aktuellen Browser mit Web-Serial-Unterstützung und stelle sicher, dass das Betriebssystem den seriellen Anschluss erkennt. Probiere ein anderes Kabel und schließe andere serielle Monitore, die den Anschluss bereits verwenden. Wenn das Gerät verbunden ist, aber unleserlichen Text ausgibt, prüfe die Baudrate und sieh dir die Bytes in Hex an.

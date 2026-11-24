Ein Magnet-Link identifiziert einen BitTorrent-Torrent anhand seines Info-Hashes. Er kann auch einen Anzeigenamen, Tracker-Adressen, Webseeds oder eine Metadatenquelle enthalten. Für die tatsächlichen Dateinamen und Größen muss der Client die Torrent-Metadaten abrufen.

## So prüfst du einen Magnet-Link

Füge einen Link ein, der mit `magnet:?` beginnt, und wähle „Metadaten abrufen“. Der Betrachter zeigt den Info-Hash sowie den Namen und die Tracker-Adressen, sofern sie im Link stehen. Sobald WebTorrent die Metadaten abgerufen hat, siehst du den Torrent-Namen, die Dateipfade und ihre Größen, die Gesamtgröße und Angaben zu den Datenteilen. Du kannst die Dateiliste filtern und den Info-Hash kopieren.

## Warum sich manche Magnet-Links nicht auflösen lassen

Im Browser braucht WebTorrent erreichbare Peers mit WebRTC-Unterstützung. In der Regel findet es diese über einen WebSocket-Tracker. Manche Magnet-Links enthalten auch eine HTTPS-Metadatenquelle, die der Browser abrufen kann. Selbst Links, die in einem Desktop-Torrent-Client funktionieren, können hier in ein Zeitlimit laufen. Falls dir die `.torrent`-Datei vorliegt, kannst du sie direkt im verlinkten Torrent-Dateibetrachter öffnen.

## Welche Verbindungen beim Abruf entstehen

Der Abruf läuft in deinem Browser. WebTorrent kann Tracker, Peers oder eine Metadatenquelle des gewünschten Torrents kontaktieren. Diese Stellen können dabei deine IP-Adresse und den abgefragten Torrent sehen. Der Betrachter ruft nur Metadaten ab. Die darin aufgeführten Dateien werden dabei nicht heruntergeladen. Magnet-Links benötigen einen BitTorrent-v1-Info-Hash (`btih`), auch wenn sie zusätzlich einen v2-Torrent identifizieren.

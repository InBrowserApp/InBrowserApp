Een magnetlink identificeert een BitTorrent-torrent aan de hand van de infohash. De link kan ook een weergavenaam, trackeradressen, webseeds of een metadatabron bevatten. Om de werkelijke bestandsnamen en groottes te zien, moet een client de torrentmetadata ophalen.

## Een magnetlink inspecteren

Plak een `magnet:?`-link en klik op ‘Metadata opzoeken’. De viewer toont de infohash en de naam en trackeradressen die eventueel in de link staan. Zodra WebTorrent de metadata heeft opgehaald, zie je de torrentnaam, bestandspaden en -groottes, de totale grootte en gegevens over de stukken. Je kunt de bestandslijst filteren en de infohash kopiëren.

## Waarom sommige magnetlinks niet werken

In een browser heeft WebTorrent bereikbare peers nodig die WebRTC ondersteunen. Meestal vindt het die via een WebSocket-tracker. Sommige magnetlinks bevatten ook een HTTPS-bron voor metadata die de browser kan lezen. Ook bij een link die in een desktopclient werkt, kan het ophalen hier te lang duren. Heb je het `.torrent`-bestand? Open het dan in de torrentbestandsviewer om de metadata direct te zien.

## Waarmee de zoekopdracht verbinding maakt

De zoekopdracht draait in je browser. WebTorrent kan verbinding maken met trackers, peers of een metadatabron voor de opgevraagde torrent. Die partijen kunnen je IP-adres en de opgevraagde torrent zien. De viewer vraagt de metadata op zonder de vermelde bestanden te downloaden. Een magnetlink heeft een BitTorrent v1-infohash (`btih`) nodig, ook wanneer de link tegelijk een v2-torrent identificeert.

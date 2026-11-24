En magnetlänk identifierar en BitTorrent-torrent med hjälp av dess infohash. Länken kan också innehålla ett visningsnamn, spåraradresser, webbseedrar eller en metadatakälla. För att se de faktiska filnamnen och storlekarna måste en klient hämta torrentens metadata.

## Så granskar du en magnetlänk

Klistra in en `magnet:?`-länk och välj knappen för att hämta metadata. Visaren visar infohashen och eventuella namn eller spåraradresser i länken. När WebTorrent har hämtat metadata visas torrentens namn, filernas sökvägar och storlekar, total storlek och information om delarna. Du kan filtrera fillistan och kopiera infohashen.

## Varför vissa magnetlänkar inte kan lösas upp

I en webbläsare behöver WebTorrent nåbara peers som stöder WebRTC. Dessa hittas vanligtvis via en WebSocket-spårare. Vissa magnetlänkar innehåller även en HTTPS-metadatakälla som webbläsaren kan läsa. En länk som stöds av en torrentklient på datorn kan ändå få timeout här. Om du har `.torrent`-filen kan du läsa den direkt med den länkade filvisaren.

## Vad hämtningen ansluter till

Hämtningen körs i webbläsaren. WebTorrent kan kontakta spårare, peers eller en metadatakälla för den torrent du har angett. Dessa tjänster kan se din IP-adress och vilken torrent du söker efter. Visaren begär metadata och laddar inte ner filerna som listas i dem. Magnetlänkar behöver en BitTorrent v1-infohash (`btih`), även länkar som också identifierar en v2-torrent.

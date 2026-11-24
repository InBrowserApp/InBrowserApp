En magnetlenke identifiserer en BitTorrent-torrent ved hjelp av infohashen. Lenken kan også oppgi et visningsnavn, trackeradresser, web seeds eller en metadatakilde. For å se navn og størrelser på enkeltfilene må klienten hente torrentens metadata.

## Slik undersøker du en magnetlenke

Lim inn en `magnet:?`-lenke og velg «Hent metadata». Først ser du infohashen og eventuelt navn og trackeradresser fra lenken. Når WebTorrent har hentet metadataene, ser du torrentnavnet, filstiene og filstørrelsene, samlet størrelse og informasjon om delene. Du kan filtrere fillisten og kopiere infohashen.

## Hvorfor enkelte magnetlenker ikke gir resultater

I nettleseren trenger WebTorrent tilgjengelige deltakere som støtter WebRTC. De blir vanligvis funnet via en WebSocket-tracker. Noen magnetlenker inneholder også en HTTPS-kilde med metadata nettleseren kan lese. Oppslaget kan gå ut på tid selv om lenken virker i et torrentprogram på datamaskinen. Har du `.torrent`-filen, kan du åpne den direkte i torrentfilviseren.

## Hvilke forbindelser oppslaget bruker

Oppslaget skjer i nettleseren din. WebTorrent kan kontakte trackere, andre deltakere eller en metadatakilde for torrenten du har bedt om. Disse kan se IP-adressen din og hvilken torrent du slår opp. Viseren ber bare om metadata. Magnetlenken må inneholde en BitTorrent v1-infohash (`btih`), også når den i tillegg identifiserer en v2-torrent.

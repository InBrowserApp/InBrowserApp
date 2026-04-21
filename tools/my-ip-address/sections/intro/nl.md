## Wat deze tool laat zien

Deze tool zoekt de openbare IPv4- en IPv6-adressen op die externe services kunnen zien vanuit uw huidige browsersessie. Als de browser ook lokale interfacekandidaten via WebRTC kan weergeven, vermeldt de tool deze afzonderlijk.

## Waarom IPv4-, IPv6- en WebRTC-resultaten verschillend kunnen zijn

Uw IPv4-adres en IPv6-adres kunnen afkomstig zijn van verschillende netwerkpaden, ISP's of tunneling-instellingen. WebRTC-kandidaten kunnen privé LAN-adressen, tijdelijke IPv6-interfaceadressen of VPN-gerelateerde routes zijn die normale websites niet altijd direct weergeven.

## Hoe het opzoeken werkt

De tool ondervraagt ​​openbare IP-providers zoals Cloudflare, geojs.io, ip.sb en ipify.org en verrijkt vervolgens het gedetecteerde adres met hostnaam, ASN, organisatie, land, tijdzone en coördineert metagegevens indien beschikbaar. Dit betekent dat de tool een actieve internetverbinding nodig heeft en afhankelijk is van de responskwaliteit van die diensten van derden.

## Waarom een ​​adres ontbreekt

Het kan zijn dat een adres niet verschijnt als uw netwerk één protocolfamilie blokkeert, uw VPN of proxy het verzoek filtert, uw browser WebRTC-blootstelling uitschakelt of de upstream-opzoekservice tijdelijk niet beschikbaar is. Als IPv6 niet beschikbaar is op uw netwerk, is het normaal dat u alleen IPv4 ziet.

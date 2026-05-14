## Vad verktyget slår upp

IP Info Lookup slår upp en IPv4-adress, IPv6-adress, domän eller URL och visar de offentliga metadata som internettjänster kan rapportera för varje adress. Det är användbart när du behöver granska vart en domän pekar, vilket nätverk som äger en adress, vilket omvänt DNS-värdnamn som finns, eller om IPv4- och IPv6-poster leder till olika leverantörer.

## Så fungerar uppslagning av domäner och URL:er

När du anger en domän eller URL extraherar verktyget värdnamnet och frågar den valda DNS-over-HTTPS-resolvern efter både A- och AAAA-poster. Varje returnerad adress berikas sedan separat, så dual-stack-domäner kan visa olika länder, ASN, ISP:er, värdnamn eller tidszoner för IPv4 och IPv6.

## Vad resultaten betyder

Fälten för plats och ISP kommer från offentliga IP-metadataleverantörer som geojs.io och ip.sb, medan värdnamn kommer från omvända DNS PTR-uppslagningar när de är tillgängliga. Dessa poster beskriver hur offentliga databaser ser adressen, inte den exakta fysiska platsen för en person eller enhet.

## Integritets- och noggrannhetsanteckningar

Uppslagningen körs i din webbläsare och skickar DNS- och IP-metadataförfrågningar till tredjepartstjänster. VPN:er, proxyservrar, CDN:er, mobilnät och molnplattformar kan göra att den rapporterade platsen eller organisationen skiljer sig från den slutanvändare eller server du förväntade dig. Tomma fält är normala för privata, reserverade, nyligen tilldelade eller sparsamt dokumenterade adresser.

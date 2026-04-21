## Vad det här verktyget visar

Det här verktyget letar upp de offentliga IPv4- och IPv6-adresserna som externa tjänster kan se från din nuvarande webbläsarsession. Om webbläsaren också kan exponera lokala gränssnittskandidater via WebRTC, listar verktyget dessa separat.

## Varför IPv4-, IPv6- och WebRTC-resultat kan vara olika

Din IPv4-adress och IPv6-adress kan komma från olika nätverksvägar, internetleverantörer eller tunnlingsinställningar. WebRTC-kandidater kan inkludera privata LAN-adresser, tillfälliga IPv6-gränssnittsadresser eller VPN-relaterade rutter som vanliga webbplatser inte alltid visar direkt.

## Hur uppslagningen fungerar

Verktyget frågar offentliga IP-leverantörer som Cloudflare, geojs.io, ip.sb och ipify.org, och berikar sedan den upptäckta adressen med värdnamn, ASN, organisation, land, tidszon och koordinatmetadata när det är tillgängligt. Detta innebär att verktyget behöver en aktiv internetanslutning och beror på svarskvaliteten hos dessa tredjepartstjänster.

## Varför en adress kan saknas

En adress kan inte visas om ditt nätverk blockerar en protokollfamilj, din VPN eller proxy filtrerar begäran, din webbläsare inaktiverar WebRTC-exponering eller om uppströmssökningstjänsten är tillfälligt otillgänglig. Om IPv6 inte är tillgängligt i ditt nätverk är det normalt att se endast IPv4.

## Hva dette verktøyet viser

Dette verktøyet slår opp de offentlige IPv4- og IPv6-adressene som eksterne tjenester kan se fra din nåværende nettleserøkt. Hvis nettleseren også kan eksponere lokale grensesnittkandidater gjennom WebRTC, viser verktøyet disse separat.

## Hvorfor IPv4-, IPv6- og WebRTC-resultater kan være forskjellige

IPv4-adressen og IPv6-adressen din kan komme fra forskjellige nettverksbaner, Internett-leverandører eller tunneloppsett. WebRTC-kandidater kan inkludere private LAN-adresser, midlertidige IPv6-grensesnittadresser eller VPN-relaterte ruter som vanlige nettsteder ikke alltid viser direkte.

## Hvordan oppslaget fungerer

Verktøyet spør etter offentlige IP-leverandører som Cloudflare, geojs.io, ip.sb og ipify.org, og beriker deretter den oppdagede adressen med vertsnavn, ASN, organisasjon, land, tidssone og koordinatmetadata når tilgjengelig. Dette betyr at verktøyet trenger en aktiv internettforbindelse og avhenger av responskvaliteten til disse tredjepartstjenestene.

## Hvorfor en adresse kan mangle

En adresse kan ikke vises hvis nettverket ditt blokkerer én protokollfamilie, VPN eller proxy filtrerer forespørselen, nettleseren din deaktiverer WebRTC-eksponering, eller oppstrømsoppslagstjenesten er midlertidig utilgjengelig. Hvis IPv6 ikke er tilgjengelig på nettverket ditt, er det normalt å se kun IPv4.

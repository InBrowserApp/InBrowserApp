## Wat deze tool normaliseert

Deze tool converteert IPv4-adressen, IPv6-adressen en CIDR-bereiken rechtstreeks in de browser naar canonieke notatie. Het verwijdert onnodige IPv4-opvulling, comprimeert IPv6 naar de standaard verkorte vorm en behoudt de oorspronkelijke adresfamilie.

## Hoe CIDR-normalisatie werkt

Wanneer u een CIDR-blok invoert, herschrijft de tool het adres naar het daadwerkelijke netwerkadres voor dat voorvoegsel. Hostbits worden gewist, dus `192.168.0.15/24` wordt `192.168.0.0/24` en `2001:db8::1234/64` wordt `2001:db8::/64`.

## Wanneer dit nuttig is

Gebruik het voordat u firewallregels, ACL's, routetabellen, VPN-toelatingslijsten of geïmporteerde configuratiebestanden vergelijkt. Genormaliseerde invoer maakt duplicaatdetectie, beoordelingen en kopiëren en plakken in netwerktools betrouwbaarder.

## Waarom invoer kan worden afgewezen

De tool weigert verkeerd ingedeelde IPv4- of IPv6-adressen, ongeldige CIDR-voorvoegsels en adres- of voorvoegselcombinaties die niet overeenkomen met de protocolfamilie. Als de waarde niet ondubbelzinnig kan worden geparseerd, is het veiliger om deze te weigeren dan het verkeerde netwerk te normaliseren.

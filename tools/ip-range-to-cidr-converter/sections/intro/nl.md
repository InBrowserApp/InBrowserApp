## Wat dit hulpmiddel doet

Deze tool converteert een start-IP-adres en een eind-IP-adres naar de kleinste set CIDR-blokken die precies het volledige bereik bestrijkt. Alles draait lokaal in uw browser, zodat de adressen uw apparaat nooit verlaten.

## Hoe CIDR-dekking werkt

Een CIDR-blok vertegenwoordigt een netwerk van twee machten, uitgelijnd op een bijpassende grens. Wanneer een bereik in het midden van die grenzen begint of eindigt, is één blok niet genoeg. De converter neemt steeds het grootste uitgelijnde blok dat past en herhaalt dit totdat het hele bereik bedekt is.

## Waarom meerdere blokken kunnen verschijnen

Bereiken zoals 192.168.1.10 tot 192.168.1.25 beginnen niet op een schone netwerkgrens en eindigen ook niet op één grens. Het exacte resultaat is daarom een ​​korte lijst met blokken, die elk één uitgelijnd gedeelte bestrijken zonder extra adressen buiten het gevraagde bereik op te nemen.

## Wanneer dit nuttig is

Gebruik het bij het voorbereiden van firewallregels, routesamenvattingen, ACL-vermeldingen, cloudbeveiligingsgroepen of migratiechecklists waarbij een onbewerkt begin- en eindbereik de standaard CIDR-notatie moet worden.

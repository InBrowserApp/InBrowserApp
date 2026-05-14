Reverse IP Lookup zet een IPv4- of IPv6-adres om naar de reverse DNS-naam en vraagt het bijbehorende `PTR`-record op. Dit helpt je controleren welke hostnaam de eigenaar van een adres publiceert voor mailservers, netwerkapparaten, cloudinstances en notities voor probleemoplossing.

## Wat het controleert

Voor IPv4 draait de tool de octetten om en vraagt hij een `in-addr.arpa`-naam op. Voor IPv6 breidt hij het adres uit naar 32 hexadecimale nibbles, keert die om en vraagt hij de bijpassende `ip6.arpa`-naam op. Het resultaat toont het exacte reverse DNS-domein, de DNS-statuscode, resolver, adresfamilie en eventuele teruggegeven hostnamen met hun TTL-waarden.

## Hoe de query wordt uitgevoerd

De lookup wordt vanuit je browser uitgevoerd met DNS-over-HTTPS. Je kunt Cloudflare, Google of AliDNS als resolver kiezen, waarna de browser een standaard `PTR`-query naar dat eindpunt stuurt. Er is geen server-side lookupservice van InBrowser.App bij betrokken.

## Hoe je ontbrekende resultaten leest

Een ontbrekend PTR-antwoord komt vaak voor. Veel residentiële, cloud-, privé- of nieuw toegewezen adressen publiceren geen reverse DNS-records. Een geslaagd DNS-antwoord zonder hostnamen bewijst niet dat het adres ongebruikt is; het betekent alleen dat de reverse zone via de geselecteerde resolver geen bruikbaar `PTR`-record heeft teruggegeven.

## Praktische opmerkingen

- Reverse DNS koppelt een IP-adres aan een hostnaam; dit is iets anders dan alle domeinen vinden die op hetzelfde adres worden gehost.
- PTR-records worden beheerd door de eigenaar van het IP-adres of de upstreamprovider, niet alleen door de domeineigenaar.
- Mail- en beveiligingssystemen vergelijken vaak forward en reverse DNS, dus een PTR-record moet meestal verwijzen naar een hostnaam die terugverwijst naar hetzelfde adres.

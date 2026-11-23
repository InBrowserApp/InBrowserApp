## Zo ontstaat het adres

Modified EUI-64 voegt `ff:fe` tussen de twee helften van het MAC-adres in en keert de U/L-bit (universeel/lokaal) in de eerste byte om. Zo wordt `00:11:22:33:44:55` de interface-id `211:22ff:fe33:4455`. Met het prefix `2001:db8:1:2::/64` levert dat het IPv6-adres `2001:db8:1:2:211:22ff:fe33:4455` op.

Voer `fe80::/64` in voor een link-local-adres. Gebruik de [link-local-converter](/nl/tools/mac-address-to-ipv6-link-local-address-converter/) om een interfacenaam toe te voegen. Gebruik voor een bruikbaar unicastadres een /64-prefix dat aan je netwerk is toegewezen. Het voorbeeld gebruikt een documentatieprefix.

## Come si forma l’indirizzo

EUI-64 modificato inserisce `ff:fe` tra le due metà dell’indirizzo MAC e inverte il bit universale/locale nel primo byte. Ad esempio, da `00:11:22:33:44:55` si ottiene l’identificatore di interfaccia `211:22ff:fe33:4455`. Con il prefisso `2001:db8:1:2::/64` si ottiene l’indirizzo `2001:db8:1:2:211:22ff:fe33:4455`.

Inserisci `fe80::/64` per ottenere un indirizzo link-local. Per aggiungere il nome dell’interfaccia, usa il [convertitore per indirizzi link-local](/it/tools/mac-address-to-ipv6-link-local-address-converter/). Per ottenere un indirizzo unicast da usare sulla tua rete, scegli un prefisso /64 assegnato alla rete stessa. L’esempio usa un prefisso riservato alla documentazione.

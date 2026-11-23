## Een MAC-adres omzetten naar een IPv6-adres

Voer een 48-bits MAC-adres in met dubbele punten, streepjes, punten of zonder scheidingstekens. Voer daarna het gewenste IPv6-netwerkprefix van `/64` in. Zowel verkorte als volledige notatie is mogelijk. Alle hostbits in het prefix moeten nul zijn. Het IPv6-adres wordt tijdens het typen bijgewerkt en is direct te kopiëren. Met **Probeer een voorbeeld** vul je beide velden met voorbeeldwaarden.

## Hoe Modified EUI-64 het adres opbouwt

In een `/64`-subnet vormt het netwerkprefix de eerste 64 bits en de interface-ID de laatste 64 bits. Modified EUI-64 voegt `ff:fe` toe tussen de twee helften van het MAC-adres en keert de universeel/lokaal-bit in de eerste byte om. Zo wordt `00:11:22:33:44:55` de interface-ID `211:22ff:fe33:4455`. Met `2001:db8:1:2::/64` is het resultaat `2001:db8:1:2:211:22ff:fe33:4455`.

## Veelgebruikte IPv6-prefixen

- **Link-local.** Gebruik `fe80::/64` voor communicatie op hetzelfde netwerksegment. **Gebruik link-local-prefix** vult dit prefix in en behoudt je MAC-adres. Met de [IPv6 link-local-converter](/nl/tools/mac-address-to-ipv6-link-local-address-converter/) kun je een interfacenaam zoals `%eth0` toevoegen.
- **Unique local (ULA).** **Gebruik ULA-voorbeeld** vult `fd12:3456:789a:1::/64` in, een voorbeeld uit `fd00::/8` voor interne netwerken. Met de [IPv6 ULA-generator](/nl/tools/ipv6-ula-generator/) kun je een uniek prefix voor je eigen netwerk genereren.
- **Globale unicast.** Voer een `/64`-subnet in uit het adresblok dat je internetprovider, cloudprovider of netwerkbeheerder heeft toegewezen.
- **Documentatie.** `2001:db8:1:2::/64` valt binnen het bereik `2001:db8::/32`, dat gereserveerd is voor documentatie en voorbeelden.

## Komt dit overeen met het IPv6-adres van mijn apparaat?

Het resultaat is het adres dat Modified EUI-64 met je prefix oplevert. Een apparaat kan een andere interface-ID gebruiken, bijvoorbeeld een stabiele of tijdelijke ID die voor privacy is gegenereerd. Heb je al een IPv6-adres met een interface-ID die is afgeleid van het MAC-adres, dan kun je het MAC-adres terugvinden met de [IPv6-naar-MAC-converter](/nl/tools/ipv6-address-to-mac-address-converter/).

## Konvertera en MAC-adress till IPv6

Ange en 48-bitars MAC-adress med kolon, bindestreck, punkter eller utan avgränsare. Ange sedan det IPv6-nätverksprefix på `/64` som du vill använda. Både förkortad och fullständig notation fungerar. Alla värdbitar i prefixet måste vara noll. IPv6-adressen uppdateras medan du skriver och kan kopieras direkt. **Testa exemplet** fyller i båda fälten med exempelvärden.

## Så bildar Modified EUI-64 adressen

I ett `/64`-subnät utgör nätverksprefixet de första 64 bitarna och gränssnitts-ID:t de sista 64 bitarna. Modified EUI-64 lägger in `ff:fe` mellan MAC-adressens två halvor och inverterar den universella/lokala biten i den första byten. MAC-adressen `00:11:22:33:44:55` ger till exempel gränssnitts-ID:t `211:22ff:fe33:4455`. Med `2001:db8:1:2::/64` blir resultatet `2001:db8:1:2:211:22ff:fe33:4455`.

## Vanliga IPv6-prefix

- **Link-local.** Använd `fe80::/64` för kommunikation på samma nätverkslänk. **Använd link-local-prefix** fyller i prefixet och behåller din MAC-adress. Om du vill lägga till ett gränssnittsnamn som `%eth0` kan du använda [konverteraren för IPv6 link-local](/sv/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Unik lokal adress (ULA).** **Använd ULA-exempel** fyller i `fd12:3456:789a:1::/64`, ett exempel från adressområdet `fd00::/8` för interna nätverk. Med [IPv6 ULA-generatorn](/sv/tools/ipv6-ula-generator/) kan du skapa ett unikt prefix för ditt eget nätverk.
- **Global unicast.** Ange ett `/64`-subnät från adressblocket som din internetleverantör, molnleverantör eller nätverksadministratör har tilldelat dig.
- **Dokumentation.** `2001:db8:1:2::/64` ingår i adressområdet `2001:db8::/32`, som är reserverat för dokumentation och exempel.

## Stämmer resultatet med min enhets IPv6-adress?

Resultatet är adressen som Modified EUI-64 tar fram med ditt prefix. En enhet kan använda ett annat gränssnitts-ID, till exempel ett stabilt eller tillfälligt ID som genererats för att skydda den personliga integriteten. Om du redan har en IPv6-adress med ett gränssnitts-ID som härletts från MAC-adressen kan du få fram MAC-adressen med [konverteraren från IPv6 till MAC](/sv/tools/ipv6-address-to-mac-address-converter/).

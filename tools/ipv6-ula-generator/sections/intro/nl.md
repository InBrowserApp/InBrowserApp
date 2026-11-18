## Een IPv6 ULA /48-prefix genereren

Kopieer het gegenereerde `fd`-prefix voor je thuisnetwerk, testomgeving of VPN. Sla het gekozen `/48` op bij je netwerkconfiguratie, zodat je het kunt hergebruiken als je subnetten toevoegt. Kies **Nieuw prefix genereren** als je een nieuw prefix nodig hebt.

## Een /64-subnet berekenen

Vul een hexadecimale **Subnet-ID** in van `0000` tot en met `ffff`. Zo levert ID `00a0` binnen `fd12:3456:789a::/48` het subnet `fd12:3456:789a:a0::/64` op. Een `/48` biedt 65.536 mogelijke `/64`-subnetten. Zo kun je aparte prefixen toewijzen aan bijvoorbeeld je LAN, gastwifi of VPN.

## Waar komt het fd-prefix vandaan?

RFC 4193 definieert Unique Local Addresses binnen `fc00::/7`. De helft voor lokale toewijzing, `fd00::/8`, begint met `fd`. De generator voegt een willekeurige Global ID van 40 bits toe via de Web Crypto API van je browser en maakt zo het `/48`.

## Wanneer gebruik je een Unique Local Address?

Gebruik een ULA voor stabiele IPv6-adressen binnen een netwerk of tussen locaties die via een VPN zijn verbonden. Een apparaat kan tegelijk een globaal IPv6-adres gebruiken voor openbaar internetverkeer en zijn ULA behouden voor interne diensten.

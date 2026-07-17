## Vad är en unik lokal IPv6-adress?

En unik lokal IPv6-adress (ULA) är avsedd för kommunikation inom anläggningar, privata nätverk och sammankopplade organisationer. Hela ULA-adressrymden är `fc00::/7`. Den åttonde biten är **L-biten**: värdet `1` väljer det lokalt tilldelade intervallet `fd00::/8` som används av den här generatorn, medan halvan `fc00::/8` förblir reserverad för en annan tilldelningsmetod.

ULA-adresser är inte globalt nåbara som standard, men ”lokal” betyder inte hemlig eller automatiskt säker. De kan passera routade gränser mellan platser, VPN:er och privata sammankopplingar när operatörer konfigurerar dessa vägar.

## Så skapar den här RFC 4193-generatorn ett /48-prefix

Den här RFC 4193-generatorn begär exakt 40 slumpbitar från Web Crypto API och kombinerar dem med `fd`. Resultatet är ett statistiskt unikt 48-bitars platsprefix, till exempel `fd12:3456:789a::/48`. Genereringen sker i webbläsaren: den samlar inte in någon MAC-adress, tidsstämpel, enhetsidentifierare eller något serversvar.

Det finns `2^40` möjliga globala ID:n – omkring 1,1 biljoner. Säker slumpgenerering gör oavsiktlig återanvändning osannolik, men kan inte garantera att två oberoende genererade prefix aldrig kolliderar. Dokumentera det valda `/48`-prefixet i nätverksdokumentationen och återanvänd det konsekvent.

## Planera de 65 536 tillgängliga /64-subnäten

Efter platsprefixet `/48` följer ett 16-bitars subnäts-ID. Värden från `0000` till `ffff` ger 65 536 möjliga `/64`-nätverk. Exempelvis omvandlar subnäts-ID:t `00a0` `fd12:3456:789a::/48` till det kanoniska nätverket `fd12:3456:789a:a0::/64`.

Återstående 64 bitar utgör gränssnitts-ID:t. Verktyget planerar endast nätverksprefix; det genererar inte värdadresser `/128` och härleder inte gränssnittsidentifierare från MAC-adresser.

## När ULA-adresser passar – och när de inte gör det

ULA-adresser passar bra för stabil intern adressering, VPN-anslutna platser, labbnätverk och tjänster som ska behålla ett internt prefix samtidigt som de använder globala unicast-adresser för IPv6. De är varken en brandvägg eller en inneboende säkerhetsgräns. Använd normala åtkomstkontroller, filtrera olämplig ULA-trafik vid platsgränser och håll interna ULA-poster borta från offentlig DNS.

En värd kan använda en ULA-adress och en global unicast-adress samtidigt. Använd den globala adressen för nåbarhet på internet och det beständiga ULA-prefixet för de privata nätverksvägar som behöver det.

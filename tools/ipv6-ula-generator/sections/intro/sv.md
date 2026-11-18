## Generera ett /48-prefix för IPv6 ULA

Kopiera det genererade `fd`-prefixet för ditt hemnätverk, labb eller VPN. Spara det valda `/48`-prefixet med nätverkskonfigurationen så att du kan återanvända det när du lägger till subnät. Välj **Generera nytt prefix** när du behöver ett nytt.

## Beräkna ett /64-subnät

Ange ett hexadecimalt **Subnäts-ID** från `0000` till `ffff`. ID:t `00a0` inom `fd12:3456:789a::/48` ger till exempel `fd12:3456:789a:a0::/64`. Med ett `/48`-prefix får du 65 536 möjliga `/64`-subnät och kan ge exempelvis LAN, gäst-wifi och VPN egna prefix.

## Var fd-prefixet kommer ifrån

RFC 4193 definierar unika lokala adresser inom `fc00::/7`. Den lokalt tilldelade halvan, `fd00::/8`, börjar med `fd`. Generatorn lägger till ett slumpmässigt globalt ID på 40 bitar från webbläsarens Web Crypto API för att bilda `/48`-prefixet.

## När du kan använda en unik lokal adress

Använd en ULA-adress för stabil IPv6-adressering i ett nätverk eller mellan platser som är anslutna via VPN. En enhet kan samtidigt använda en global IPv6-adress för publik internettrafik och sin ULA-adress för interna tjänster.

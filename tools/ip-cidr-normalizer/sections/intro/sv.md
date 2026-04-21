## Vad detta verktyg normaliserar

Detta verktyg konverterar IPv4-adresser, IPv6-adresser och CIDR-intervall till kanonisk notation direkt i webbläsaren. Den tar bort onödig IPv4-utfyllnad, komprimerar IPv6 till den förkortade standardformen och bevarar den ursprungliga adressfamiljen.

## Hur CIDR-normalisering fungerar

När du anger ett CIDR-block, skriver verktyget om adressen till den faktiska nätverksadressen för det prefixet. Värdbitar rensas, så `192.168.0.15/24` blir `192.168.0.0/24` och `2001:db8::1234/64` blir `2001:db8::/64`.

## När detta är användbart

Använd det innan du jämför brandväggsregler, ACL:er, rutttabeller, VPN-godkännandelistor eller importerade konfigurationsfiler. Normaliserad indata gör dubblettavkänning, recensioner och kopiera-klistra in i nätverksverktyg mer tillförlitliga.

## Varför input kan avvisas

Verktyget avvisar felaktiga IPv4- eller IPv6-adresser, ogiltiga CIDR-prefix och adress- eller prefixkombinationer som inte matchar protokollfamiljen. Om värdet inte kan analyseras entydigt är det säkrare att avvisa det än att normalisera fel nätverk.

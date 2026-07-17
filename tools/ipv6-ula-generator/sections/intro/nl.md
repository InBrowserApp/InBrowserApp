## Wat is een IPv6 Unique Local Address?

Een IPv6 Unique Local Address (ULA) is bedoeld voor communicatie binnen sites, privénetwerken en onderling verbonden organisaties. De volledige ULA-ruimte is `fc00::/7`. De achtste bit is de **L-bit**: de waarde `1` selecteert het lokaal toegewezen bereik `fd00::/8` dat deze generator gebruikt, terwijl de helft `fc00::/8` gereserveerd blijft voor een andere toewijzingsmethode.

ULA's zijn standaard niet wereldwijd bereikbaar, maar ‘lokaal’ betekent niet geheim of automatisch veilig. Ze kunnen gerouteerde sitegrenzen, VPN's en private interconnecties doorkruisen wanneer beheerders die routes configureren.

## Hoe deze RFC 4193-generator een /48 opbouwt

Deze RFC 4193-generator vraagt de Web Crypto API om precies 40 willekeurige bits en combineert die met `fd`. Het resultaat is een statistisch uniek 48-bits siteprefix, zoals `fd12:3456:789a::/48`. De generatie blijft in de browser: er wordt geen MAC-adres, tijdstempel, apparaat-ID of serverrespons verzameld.

Er zijn `2^40` mogelijke Global ID's — ongeveer 1,1 biljoen. Veilige willekeur maakt onbedoeld hergebruik onwaarschijnlijk, maar kan niet garanderen dat twee onafhankelijk gegenereerde prefixen nooit botsen. Leg de gekozen `/48` vast in je netwerkdocumentatie en hergebruik deze consequent.

## De 65.536 beschikbare /64-subnetten plannen

Na het `/48`-siteprefix volgt een 16-bits Subnet-ID. Waarden van `0000` tot en met `ffff` leveren 65.536 mogelijke `/64`-netwerken op. Zo verandert Subnet-ID `00a0` het prefix `fd12:3456:789a::/48` in het canonieke netwerk `fd12:3456:789a:a0::/64`.

De overige 64 bits vormen de Interface-ID. Deze tool plant alleen netwerkprefixen; de tool genereert geen `/128`-hostadressen en leidt geen interface-ID's af van MAC-adressen.

## Waar ULA's thuishoren — en waar niet

ULA's zijn geschikt voor stabiele interne adressering, via VPN verbonden sites, labnetwerken en diensten die een intern prefix moeten behouden en tegelijk globale unicast-IPv6-adressen gebruiken. Ze zijn geen firewall of inherente beveiligingsgrens. Pas normale toegangscontroles toe, filter ongepast ULA-verkeer aan sitegrenzen en houd interne ULA-records uit openbare DNS.

Een host kan tegelijk een ULA en een globaal unicastadres gebruiken. Gebruik het globale adres voor internetbereikbaarheid en het duurzame ULA-prefix voor de private routes die dit nodig hebben.

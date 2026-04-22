## Vad det här verktyget gör

Detta verktyg konverterar en start-IP-adress och en slut-IP-adress till den minsta uppsättningen CIDR-block som exakt täcker hela området. Allt körs lokalt i din webbläsare, så adresserna lämnar aldrig din enhet.

## Hur CIDR-täckning fungerar

Ett CIDR-block representerar ett nätverk av två storlekar inriktat på en matchande gräns. När ett intervall börjar eller slutar i mitten av dessa gränser räcker det inte med ett block. Omvandlaren fortsätter att ta det största inriktade blocket som passar, och upprepar sedan tills hela intervallet är täckt.

## Varför flera block kan dyka upp

Områden som 192.168.1.10 till 192.168.1.25 börjar inte på en ren nätverksgräns och slutar inte heller på en. Det exakta resultatet är därför en kort lista med block, som vart och ett täcker en justerad del utan att inkludera extra adresser utanför det begärda intervallet.

## När detta är användbart

Använd den när du förbereder brandväggsregler, ruttsammanfattningar, ACL-poster, molnsäkerhetsgrupper eller migreringschecklistor där ett råstart- och slutintervall måste bli standard CIDR-notation.

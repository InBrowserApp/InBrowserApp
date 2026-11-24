## Planera IPv4-subnät med VLSM

Ange ett överordnat block i CIDR-notation, till exempel 192.168.10.0/24. Lägg till en rad för varje nät och ange hur många användbara värdadresser det behöver. Räkna in gatewayadressen och eventuellt utrymme för framtida utbyggnad. När du beräknar planen får du se tilldelat nät, nätmask, användbart adressintervall och broadcast-adress för varje subnät samt lediga CIDR-block för framtida bruk.

Med nätmasker av variabel längd (VLSM) kan du dela upp ett nät i olika stora subnät. Kalkylatorn väljer minsta möjliga block för varje behov och tilldelar de största blocken först, vid giltiga CIDR-gränser. Ett standardsubnät reserverar nätverksadressen och broadcast-adressen. Till exempel ryms 50 värdar i ett /26-block med 62 användbara adresser.

Välj /31 endast för en punkt-till-punkt-länk med IPv4 som stöder två användbara adresser. Välj /32 för en enskild adress, till exempel för ett loopbackgränssnitt på en router. Båda alternativen saknar broadcast-adress. Beräkningen och subnätsnamnen stannar i webbläsaren.

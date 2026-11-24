## IPv4-subnetten plannen met VLSM

Voer een overkoepelend blok in CIDR-notatie in, bijvoorbeeld 192.168.10.0/24. Voeg voor elk netwerk een rij toe en geef op hoeveel bruikbare hostadressen het nodig heeft. Reken zo nodig het gatewayadres en extra ruimte voor groei mee. Het berekende plan toont per subnet het toegewezen netwerk, het masker, het bruikbare adresbereik en het broadcastadres. Vrije CIDR-blokken blijven beschikbaar voor later.

Met subnetmaskers van variabele lengte (VLSM) verdeel je een netwerk in subnetten van verschillende groottes. De calculator kiest voor elke aanvraag het kleinste passende blok en wijst de grootste blokken het eerst toe, telkens op een geldige CIDR-grens. In een standaardsubnet zijn het netwerkadres en het broadcastadres gereserveerd. In een /26 passen bijvoorbeeld 50 hosts, met in totaal 62 bruikbare adressen.

Kies /31 alleen voor een IPv4-punt-naar-puntverbinding die twee bruikbare adressen ondersteunt. Kies /32 voor één adres, bijvoorbeeld voor een loopbackinterface op een router. Beide opties hebben geen broadcastadres. De berekening en de subnetnamen blijven in je browser.

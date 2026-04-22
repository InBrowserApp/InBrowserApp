## Hva dette verktøyet gjør

Dette verktøyet konverterer en start-IP-adresse og slutt-IP-adresse til det minste settet med CIDR-blokker som nøyaktig dekker hele spekteret. Alt kjører lokalt i nettleseren din, så adressene forlater aldri enheten din.

## Hvordan CIDR-dekning fungerer

En CIDR-blokk representerer et nettverk av to størrelser som er justert på en matchende grense. Når et område starter eller slutter i midten av disse grensene, er ikke én blokk nok. Konverteren fortsetter å ta den største justerte blokken som passer, og gjentar deretter til hele området er dekket.

## Hvorfor flere blokker kan vises

Områder som 192.168.1.10 til 192.168.1.25 starter ikke på en ren nettverksgrense og slutter heller ikke på en. Det eksakte resultatet er derfor en kort liste over blokker, som hver dekker en justert del uten å inkludere ekstra adresser utenfor det forespurte området.

## Når dette er nyttig

Bruk den når du utarbeider brannmurregler, rutesammendrag, ACL-oppføringer, skysikkerhetsgrupper eller migreringssjekklister der et rå start- og sluttområde må bli standard CIDR-notasjon.

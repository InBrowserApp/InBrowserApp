## Hur man konverterar IPv6 till MAC-adress

Du kan bara återskapa en MAC-adress från en IPv6-adress när IPv6-adressens
gränssnittsidentifierare har härletts från den MAC-adressen med EUI-64-metoden.
Detta är vanligast för äldre länk-lokala adresser som börjar med `fe80::` och
för vissa tillståndslöst autokonfigurerade adresser.

### När det fungerar

Den här omvända konverteringen fungerar när de sista 64 bitarna i IPv6-adressen
fortfarande innehåller en EUI-64-gränssnittsidentifierare.

- Gränssnittsidentifieraren byggdes från en 48-bitars MAC-adress.
- Byteparen i mitten är fortfarande `ff:fe`.
- Adressen har inte skapats med privacy extensions eller någon annan
  randomiseringsmetod.

### Hur konverteringen fungerar

Konverteraren återskapar MAC-adressen i följande steg:

1. Läs de sista 64 bitarna i IPv6-adressen.
2. Ta bort de infogade bytena `ff:fe` i mitten av gränssnittsidentifieraren.
3. Vänd universal/local-biten i den första byten.
4. Formatera de återstående 48 bitarna som en vanlig MAC-adress.

### Varför ingen MAC visas

Du kanske inte får något resultat av flera skäl:

- IPv6-adressen har ogiltig syntax.
- Adressen är giltig men skapades inte från en MAC-adress med EUI-64.
- Adressen använder privacy, stable-random, DHCPv6 eller någon annan
  tilldelningsmetod som inte bygger på MAC.

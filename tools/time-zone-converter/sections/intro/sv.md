## Vad verktyget är till för

Använd den här konverteraren för att omvandla ett lokalt datum och en lokal tid i en IANA-tidszon till motsvarande lokala tid i en annan tidszon. Den hjälper när du behöver jämföra scheman mellan städer utan att manuellt räkna på offset eller gissa om sommartid gäller.

## Vanliga användningsfall

- Kontrollera om ett möte i Tokyo hamnar på samma kalenderdag i New York eller London.
- Verifiera offset innan du publicerar scheman, aviseringar eller supporttider.
- Kopiera motsvarande ISO 8601-, UTC- eller Unix-tidsstämpelvärden för loggar och API:er.

## Så fungerar den här konverteraren

- Ange ett lokalt datum och en lokal tid i formatet `YYYY-MM-DD HH:mm:ss.SSS` på någon av sidorna och välj sedan käll- och måltidszon.
- Sidan du redigerade senast blir referensen. Verktyget konverterar först den tidpunkten till UTC internt och visar sedan motsvarande lokala tid i den andra tidszonen.
- Använd `Now` för att snabbt fylla i aktuell tid, eller `Swap` för att vända jämförelsen. Offset kan ändras kring övergångar till sommartid.

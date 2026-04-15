## Vad verktyget är till för

Använd den här kalkylatorn för att mäta exakt förfluten tid mellan två
lokala datum- och tidsvärden, även när de tillhör olika IANA-tidszoner.
Den är användbar när du vill ha ett tillförlitligt svar utan att räkna
om offsetar manuellt eller gissa hur sommartid påverkar jämförelsen.

## Vanliga användningsfall

- Jämföra en starttid i en stad med en sluttid i en annan stad.
- Mäta förfluten tid mellan loggar, incidenter, flyg eller supportfönster
  som registrerats i olika tidszoner.
- Kontrollera om två tidsstämplar passerar midnatt, en helg eller en
  övergång till sommartid.

## Så fungerar kalkylatorn

- Ange lokal start- och sluttid i formatet `YYYY-MM-DD HH:mm:ss.SSS`
  och välj sedan tidszon för varje sida.
- Verktyget omvandlar båda tidsstämplarna internt till UTC och visar
  sedan signerad varaktighet, absolut varaktighet, ISO 8601-varaktighet
  och totalvärden från millisekunder till dagar.
- Använd `Now` för att snabbt fylla i aktuell tid eller `Swap` för att
  vända jämförelsen. Offsetar kan ändras vid övergångar till
  sommartid.

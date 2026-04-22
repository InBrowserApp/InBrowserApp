# Skapa kalenderfiler utan att lämna webbläsaren

Det här verktyget genererar standardiserade `.ics`-händelsefiler direkt i webbläsaren. Du kan definiera tidsatta eller heldagshändelser, välja strategi för tidszoner, lägga till påminnelser och exportera den färdiga kalenderposten utan att synkronisera data till en server.

## Varför använda det

- Det passar när du bara behöver en kalenderfil och inte ett komplett arbetsflöde med kalenderkonto.
- Känsliga scheman stannar lokalt samtidigt som du fortfarande får en standardbaserad händelsebilaga.
- Du kan justera återkommande regler och påminnelser innan du laddar ner den slutliga `.ics`-filen.

## Föreslaget arbetsflöde

1. Fyll i händelsesammanfattning, plats, anteckningar och eventuell referens-URL.
2. Välj händelsens intervall och bestäm sedan om du vill exportera `UTC`-tidsstämplar eller behålla den ursprungliga tidszonen med `TZID`.
3. Lägg bara till återkommande regler och påminnelser när det behövs, ladda sedan ner filen och bifoga den där du delar händelsen.

## Noteringar

- `UTC`-utdata är oftast det säkraste valet om du vill ha bred kalenderkompatibilitet.
- `TZID`-utdata bevarar det ursprungliga schemaläggningssammanhanget för klienter som förstår namngivna tidszoner.
- För heldagshändelser behåller formuläret slutdatumet som inkluderande, även om ICS-filen sparar det som ett exkluderande slutdatum.

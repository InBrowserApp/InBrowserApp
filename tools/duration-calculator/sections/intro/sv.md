## Vad är en varaktighet?

En varaktighet är en mängd tid som du lägger till eller drar
ifrån en bastid. Den här räknaren utgår från ett lokalt datum
och klockslag i den valda tidszonen och använder samma
varaktighet i båda riktningarna.

## ISO 8601-exempel

- `PT45M` betyder 45 minuter.
- `P2DT6H` betyder 2 dagar och 6 timmar.
- `P1DT2H3M4.005S` betyder 1 dag, 2 timmar, 3 minuter och
  4,005 sekunder.

## Så fungerar den här räknaren

- Ange en bastid i formatet `YYYY-MM-DD HH:mm:ss.SSS` och välj
  den tidszon du vill utvärdera.
- Ange varaktigheten antingen som ISO 8601-text eller med
  fälten för dagar, timmar, minuter, sekunder och millisekunder.
  Verktyget håller båda inmatningarna synkroniserade och
  normaliserar överflöd automatiskt.
- Ange bara positiva varaktigheter. Använd de inbyggda
  resultatkorten för addition och subtraktion för att jämföra
  båda riktningarna.
- Resultatkorten visar den justerade lokala tiden, UTC ISO
  8601-tidsstämpeln och Unix-tidsstämplar i sekunder och
  millisekunder. Offseten kan ändras vid övergångar till
  sommartid.

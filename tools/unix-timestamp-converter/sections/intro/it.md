## Convertire un timestamp Unix in una data

Incolla un timestamp per vedere la data e l’ora nel fuso orario del tuo dispositivo, in UTC e in formato ISO 8601. Lo strumento mostra anche quanto tempo è trascorso o quanto ne manca. Per esempio, `1704067200` secondi e `1704067200000` millisecondi danno entrambi `2024-01-01T00:00:00.000Z` in formato ISO 8601.

## Convertire una data in un timestamp Unix

Modifica **Data e Ora** per ottenere il timestamp di una data e un’ora locali nell’unità selezionata. Fai clic su **Adesso** per ottenere il timestamp corrente. Nei log e nelle API puoi usare il valore ISO 8601 che termina con `Z` per indicare l’ora UTC senza ambiguità.

## Scegliere tra secondi, millisecondi e nanosecondi

I timestamp Unix misurano il tempo a partire dal 1º gennaio 1970 alle 00:00:00 UTC. **Auto** interpreta fino a 10 cifre come secondi, da 11 a 13 come millisecondi e i valori più lunghi come nanosecondi. Scegli l’unità a mano se conosci quella originale, soprattutto per timestamp in millisecondi relativi a date meno recenti o quando la data visualizzata sembra sbagliata. La data viene visualizzata con una precisione al millisecondo.

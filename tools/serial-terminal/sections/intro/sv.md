## Så använder du serieterminalen i webbläsaren

Anslut din Arduino, ESP32, Raspberry Pi Pico eller USB-serieadapter med en datakabel. Ställ in den baudhastighet som enheten använder, till exempel 9600 eller 115200, välj sedan **Anslut** och välj enhetens port i webbläsaren. Den här serieövervakaren använder 8 databitar, ingen paritet, en stoppbit och ingen flödeskontroll (8N1).

## Skicka text och hexadecimala byte

Text skickas i UTF-8. Välj LF, CR eller CR + LF om enheten använder ett radslut för att skicka kommandon. För binära kommandon väljer du **Hexadecimalt** och anger fullständiga byte, till exempel `41 54 0D 0A`. I hexadecimalt läge skickas byten som de anges, utan att något radslut läggs till automatiskt.

## Läsa och spara serieloggar

Loggen visar inkommande (RX) och utgående (TX) data med tidsstämplar. Växla till hexadecimalt format för att granska enskilda byte om texten ser förvanskad ut. Pausa rullningen för att granska en tidigare post medan data fortsätter att komma in, eller ladda ner den sparade delen av loggen som en textfil. Seriella data stannar i den här fliken tills du väljer att spara dem.

## Varför kan jag inte ansluta till min enhet?

Använd en uppdaterad webbläsare som stöder Web Serial och kontrollera att operativsystemet känner igen serieporten. Prova en annan kabel och stäng eventuella andra serieövervakare som redan använder porten. Om enheten ansluter men texten är oläslig, kontrollera baudhastigheten och prova att visa byten i hexadecimalt format.

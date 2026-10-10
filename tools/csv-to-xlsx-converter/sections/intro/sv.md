## Konvertera avgränsad text till Excel

Öppna eller släpp en lokal CSV- eller TSV-fil, granska cellerna och ladda ner en XLSX-arbetsbok med ett kalkylblad som heter Sheet1. Välj avgränsare och textkodning om den automatiska identifieringen inte stämmer med filen. TSV-filer använder tabbar som standard. Förhandsvisningsfönstret begränsar inte de exporterade uppgifterna.

## Bevara identifierare och ursprunglig text

CSV och TSV lagrar inte kalkylbladens celldatatyper. Den här konverteraren behåller varje fält som text, inklusive inledande nollor, långa identifierare, tal som ser ut som decimaltal, datum och text som börjar med ett likhetstecken. Den tolkar inte automatiskt värden som tal eller datum och kör inga formler. Avgränsare inom citattecken, escapade citattecken, Unicode, radbrytningar inuti fält, tomma fält och tomma poster bevaras. Kortare rader lämnar tomma celler. En avslutande radbrytning avslutar den sista posten i stället för att lägga till en ny rad.

Inställningen för den första raden erbjuder vanliga data eller en rubrikrad med Excel-filter. Båda alternativen behåller raden precis som den är skriven, inklusive dubbletter eller tomma rubriker. Automatisk kodning stöder UTF-8 och UTF-16 med en byteordningsmarkör. Andra kodningar kan väljas manuellt. En inledande sep=-instruktion utelämnas endast när automatisk identifiering av avgränsaren är vald eller när dess avgränsare matchar den valda avgränsaren.

Felformade fält inom citattecken, ogiltig textkodning och data som överskrider Excels gränser för rader, kolumner eller textlängd i en cell ger ett fel i stället för en avkortad arbetsbok. Kontrollera viktiga värden i ett kalkylprogram efter nedladdningen.

## Lokal bearbetning

Konverteringen körs i den här webbläsaren utan att filen laddas upp. Om du ändrar importinställningarna, byter fil eller stänger filen tas det föregående resultatet bort. När du avbryter stoppas bakgrundsprocessen. Det finns ingen fast gräns för filstorleken; det tillgängliga webbläsarminnet avgör vilka filer som kan bearbetas.

Öppna [Kalkylbladsvisare](../xlsx-viewer/) för att bläddra i kalkylbladsfiler.

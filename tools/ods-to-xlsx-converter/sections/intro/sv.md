## Konvertera OpenDocument-kalkylblad till Excel

Öppna eller släpp en lokal ODS-fil, granska cellerna och ladda ner en XLSX-arbetsbok. Kalkylbladens namn och ordning, dolda kalkylblad, text, tal, booleska värden, datum, sparade formelresultat och sammanfogade celler tas med. Tomma kalkylblad och tomma områden mellan celler bevaras. Förhandsvisningsfönstret begränsar inte de exporterade uppgifterna.

## Sparade värden och kompatibilitet

Formler ersätts av sina sparade värden, inte av Excel-formler. Saknade sparade resultat lämnas tomma och rapporteras. Webbläsaren beräknar inte om formler och uppdaterar inte externa data. Felresultat blir generiska kalkylbladsfel. Text, inklusive identifierare med inledande nollor, icke-latinska tecken och text som börjar med ett likhetstecken, förblir text.

Datum använder ett standardformat för datum och tid; värden med uttryckligen angivna tidszoner normaliseras till UTC. Tidslängder lagras fortfarande som antal dagar och procentvärden använder ett enkelt procentformat. Valutavärden behåller sitt talvärde utan valutabeteckningen eller den ursprungliga formateringen. Stilar, rad- och kolumnstorlekar, diagram, bilder, kommentarer, länkar, makron och arbetsboksinställningar återskapas inte.

Krypterade filer, ogiltiga arkiv, data som inte stöds och värden eller kalkylbladsnamn utanför Excels tillåtna gränser ger ett tydligt felmeddelande. Den här konverteraren accepterar inte OpenDocument-filer i platt format (.fods). Kontrollera viktiga resultat i ditt kalkylprogram efter nedladdningen.

## Lokal bearbetning

Konverteringen körs i den här webbläsaren utan att dokumentet laddas upp. Om du byter eller stänger filen tas den tidigare filen som förberetts för nedladdning bort; om du avbryter stoppas bakgrundsprocessen. Det finns ingen fast gräns för filstorlek eller antal kalkylblad. Webbläsarens tillgängliga minne avgör fortfarande vilka arbetsböcker som kan behandlas.

Öppna [Kalkylbladsvisare](../xlsx-viewer/) för att bläddra i ODS och andra kalkylbladsformat.

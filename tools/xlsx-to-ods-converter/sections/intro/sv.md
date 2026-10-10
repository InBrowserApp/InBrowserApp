## Konvertera Excel-arbetsböcker till OpenDocument

Öppna eller släpp en lokal XLSX-fil, granska cellerna och ladda ner en ODS-arbetsbok. Kalkylbladens namn och ordning, tomma och dolda kalkylblad, cellpositioner, text, tal, booleska värden, datum och sparade formelresultat tas med. Förhandsvisningsfönstret begränsar inte de exporterade uppgifterna. Mycket dolda kalkylblad blir vanliga dolda kalkylblad.

## Sparade värden och kompatibilitet

Formler ersätts av sina sparade värden. Saknade resultat lämnas tomma och rapporteras; webbläsaren beräknar inte om formler och uppdaterar inte externa data. Felresultat från kalkylblad blir vanlig text. Identifierare med inledande nollor, icke-latinska tecken och text som börjar med ett likhetstecken förblir text.

Datum följer arbetsbokens datumsystem (1900 eller 1904) och använder ett standardformat för datum och tid. Värden med enbart tid och tidslängder använder ett enkelt tidslängdsformat. Procent- och valutavärden behåller sitt talvärde utan den ursprungliga formateringen eller valutabeteckningen. Det fiktiva Excel-datumet 29 februari 1900 och anpassade datumformat som inte stöds ger ett fel i stället för ett förskjutet datum.

Stilar, rad- och kolumnstorlekar, layouten för sammanfogade celler, diagram, bilder, kommentarer, länkar, makron och arbetsboksinställningar återskapas inte. Lagrade värden i sammanfogade områden behåller sina ursprungliga cellpositioner. Den här konverteraren accepterar XLSX, inte XLS, XLSB eller XLSM. Krypterade filer, ogiltiga arkiv, bladtyper som inte stöds och data som inte kan representeras i ODS ger ett tydligt felmeddelande. Kontrollera viktiga resultat i ditt kalkylprogram efter nedladdningen.

## Lokal bearbetning

Konverteringen körs i den här webbläsaren utan att dokumentet laddas upp. Om du byter eller stänger filen tas den tidigare filen som förberetts för nedladdning bort; om du avbryter stoppas bakgrundsprocessen. Det finns ingen fast gräns för filstorlek eller antal kalkylblad. Webbläsarens tillgängliga minne avgör fortfarande vilka arbetsböcker som kan behandlas.

Öppna [Kalkylbladsvisare](../xlsx-viewer/) för att bläddra i Excel och andra kalkylbladsformat.

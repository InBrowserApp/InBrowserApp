## Konvertera Numbers-tabeller till Excel-kalkylblad

Öppna eller släpp en lokal Numbers-fil, granska de importerade cellerna och ladda ner en XLSX-arbetsbok. Varje tabell blir ett separat Excel-kalkylblad i ursprunglig ordning. Mappningen visar de ursprungliga blad- och tabellnamnen i Numbers bredvid namnet i resultatet. Namnen anpassas efter Excels regler för längd och tecken och hålls unika.

Text, inklusive identifierare med inledande nollor och icke-latinska tecken, tal, booleska värden, datum och tider, tomma celler, sparade formelresultat och sammanfogade celler som stöds tas med. Tidslängder lagras som antal dagar. Använd kalkylbladsväljaren och cellnavigeringen för att granska data; förhandsvisningsfönstret begränsar inte exporten.

## Sparade värden och kompatibilitet

Formler exporteras som sina sparade värden, inte som formler. Webbläsaren beräknar inte saknade resultat och uppdaterar inte externa data. Celler utan lagrat värde förblir tomma. Numbers-fel blir generiska kalkylbladsfel, så den ursprungliga felorsaken kanske inte bevaras.

Verktyget stöder arkiv från Numbers 3 och senare som parsern kan läsa. Äldre XML-dokument, lösenordskrypterade filer, skadade arkiv och funktioner som inte stöds ger ett fel. Diagram, bilder, textrutor, tabellplacering, interaktiva kontroller och formatering återskapas inte. Talformat kan skilja sig åt. Kontrollera viktiga arbetsböcker i ditt kalkylprogram efter nedladdningen.

## Lokal bearbetning

Konverteringen körs i den här webbläsaren utan att dokumentet laddas upp. Om du byter eller stänger filen tas den tidigare filen som förberetts för nedladdning bort, och om du avbryter stoppas bakgrundsprocessen. Det finns ingen fast gräns för filstorlek eller antal kalkylblad; stora dokument är fortfarande beroende av webbläsarens tillgängliga minne.

Öppna [Kalkylbladsvisare](../xlsx-viewer/) för att bläddra i Numbers-filer och andra kalkylbladsformat.

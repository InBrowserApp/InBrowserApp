## Konvertera äldre Excel-arbetsböcker i webbläsaren

Öppna eller släpp en lokal XLS-fil. Välj ett kalkylblad, granska dess celldata och ladda ner en XLSX-arbetsbok. Du kan navigera i förhandsvisningen eller ange adressen till den övre vänstra cellen för att hoppa till ett annat område. Förhandsvisningsfönstret begränsar inte exporten: alla kalkylblad och deras importerade celler tas med.

Kalkylbladens namn och ordning, tomma blad, dolda blads synlighetsstatus, text, tal, booleska värden, kalkylbladsfel, talformat som stöds, sammanfogade celler, radhöjder, kolumnbredder samt dolda rader och kolumner bevaras där källfilens parser stöder dem. Textidentifierare behåller sina inledande nollor. Datum behåller Excels serienummer och arbetsbokens datumsystem.

## Formler och kompatibilitet

Formeluttryck som stöds och deras sparade resultat bevaras. Webbläsaren beräknar inte om formler och uppdaterar inte externa data. En formel utan sparat resultat visas med en notis i förhandsvisningen; uttrycket finns kvar i utdatafilen så att ett kalkylprogram kan beräkna det. Formeluttryck eller externa referenser som inte stöds kanske inte bevaras korrekt vid konverteringen.

Det här är en datakonvertering, inte en exakt återgivning av varje funktion i arbetsboken. Diagram, bilder, makron, pivotfunktioner och avancerad formatering bevaras inte. Förhandsvisningen återger inte layouten för sammanfogade celler eller formatering. Kontrollera den nedladdade arbetsboken i ditt kalkylprogram, särskilt när formler eller layout är viktiga. Makroblad, diagramblad, krypterade filer, skadade filer och filer som bara har döpts om till .xls stöds inte.

## Lokal bearbetning

Din arbetsbok bearbetas i den här webbläsaren utan att innehållet laddas upp. Makron körs inte och länkade resurser hämtas inte. Om du byter eller stänger arbetsboken tas resultatet bort; om du avbryter stoppas konverteringen. Det finns ingen fast gräns för filstorlek eller antal kalkylblad, men stora arbetsböcker är fortfarande beroende av webbläsarens tillgängliga minne.

Öppna [Kalkylbladsvisare](../xlsx-viewer/) för att bläddra i andra kalkylbladsformat.

## Konvertera en STL-fil till Wavefront OBJ

Välj **Öppna fil** eller dra en `.stl`-fil till konverteraren. Den läser både ASCII-filer och binära STL-filer och förbereder en `.obj`-fil för nedladdning i webbläsaren. Välj **Prova ett exempel** för att först konvertera ett litet monteringsbeslag. Välj sedan **Ladda ner OBJ** för att spara filen.

## Se vad OBJ-filen innehåller

Konverteraren skriver de ursprungliga yttrianglarna till en Wavefront OBJ-fil. Hörn med exakt samma position delar ett hörnindex i OBJ-filen. Det gör nätet enklare att redigera. Koordinataxlarna och nätets storlek behålls. STL har ingen standardinställning för måttenheter. Om en kant är 40 enheter lång i källfilen är den fortfarande 40 koordinatenheter lång i OBJ-filen. Välj den avsedda måttenheten när du importerar filen i ett annat program.

Den nedladdade filen innehåller nätets geometri. Materialbibliotek och texturer ingår inte eftersom standardformatet för STL saknar sådana uppgifter.

## Visa resultatet eller konvertera tillbaka

Öppna den nedladdade filen i [OBJ-visaren](../obj-viewer/) för att granska resultatet. Visa källfilen i [STL-visaren](../stl-viewer/) eller konvertera i motsatt riktning med [OBJ till STL-konverteraren](../obj-to-stl-converter/).

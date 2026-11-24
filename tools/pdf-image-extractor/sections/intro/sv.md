## Så extraherar du bilder från en PDF

1. Välj en PDF eller släpp filen i rutan ovan. Verktyget söker automatiskt efter bilder på varje sida.
2. Förhandsvisa inbäddade foton, skannade bilder och andra rasterbilder. Vid varje bild visas filformat, pixelmått och den första sidan som bilden visas på.
3. Ladda ner de bilder du behöver en i taget, eller ladda ner alla resultat i en ZIP-fil.

PDF-filen och de extraherade bilderna stannar i webbläsaren. Du behöver varken ladda upp ett dokument eller skapa ett konto.

## Extrahera inbäddade bilder eller konvertera PDF-sidor

När du extraherar bilder sparas de bilder som finns lagrade i PDF-filen. Du kan till exempel ta fram foton ur en katalog, återanvända en logotyp som sparats som bitmapp eller samla skannade bilder för vidare bearbetning. Bilderna exporteras med sina lagrade pixelmått och kan därför vara större än de ser ut på sidan. Om samma inbäddade bild används flera gånger, listas den en gång tillsammans med den första sidan där den visas.

Använd [PDF-till-bild-konverterare](../pdf-to-image-converter/) för att spara hela sidor med text, vektorgrafik och layout som bilder. Använd [Textextraherare för PDF](../pdf-text-extractor/) för att spara markerbar text.

## Bildformat och bildkvalitet

Kompatibla inbäddade JPEG-bilder sparas som JPG utan att komprimeras på nytt. Övriga bilder som stöds sparas som förlustfria PNG-filer, med transparens om den finns i PDF-filen. Bilder kan ha skalats om eller komprimerats när PDF-filen skapades. Den extraherade bilden motsvarar det som faktiskt sparats i filen. Beskärning, rotation och överlagringar på sidan följer inte med den extraherade bilden.

## Vanliga frågor

### Kan jag extrahera bilder från en skannad PDF?

Ja, om skanningen har sparats som en inbäddad rasterbild. En skannad sida kan bestå av en helsidesbild eller flera delar. Använd PDF-till-bild-konverterare om du vill få hela sidan som en enda bild.

### Varför saknas viss grafik?

Text, vektorlogotyper och figurer som ritats med PDF-former har inga separata rasterbildfiler att extrahera. Skadade bilder och bilder med kodningar som verktyget inte stöder kan också hoppas över. Konvertera hela sidan till en bild om du vill spara grafiken precis som den visas där.

## Konvertera formaterad text lokalt

Öppna ett lokalt `.rtf`-dokument, konvertera det till PDF, granska de resulterande sidorna och ladda ner samma PDF som visas i förhandsvisningen. Använd [RTF-visaren](../rtf-viewer/) för att läsa utan att konvertera.

## PDF-utseende och kompatibilitet

Konverteringsmotorn renderar sidstorlekar, orientering, sidhuvuden, sidfötter, sidbrytningar, tabeller och inbäddade PNG- eller JPEG-bilder som stöds. Text som stöds kan fortfarande markeras. Ursprungliga RTF-teckenkodningar och Unicode-escape-sekvenser skickas till motorn; ingen OCR läggs till för skannad text. Saknade teckensnitt ersätts med medföljande teckensnitt, så radbrytningar, avstånd och sidindelning kan ändras. Komplexa layouter kan skilja sig från ursprungsprogrammet. Kontrollera varje sida innan du förlitar dig på PDF-filen.

PDF-filen är en statisk export. Formulärkontroller visas som vid utskrift. Kommentarer, makron och digitala signaturer bevaras eller verifieras inte. Inbäddade objekt, externa dokumentresurser, bildformat som inte stöds och fältinstruktioner som inte stöds avvisas. Skadade eller oläsbara filer ger ett fel utan att någon ofullständig fil kan laddas ner. Att byta filändelse ändrar inte det underliggande formatet.

## Integritet och webbläsarresurser

Konverteringen körs på din enhet. Vid den första konverteringen laddas cirka 90 MB motor- och teckensnittsfiler ner, som webbläsaren kan spara i cacheminnet; själva dokumentet laddas aldrig upp. Motorn läses in först efter att du har valt en fil. En uppdaterad webbläsare med stöd för WebAssembly och delat minne krävs. Stora eller komplexa dokument kan kräva tid och minne. Du kan avbryta konverteringen, stänga eller byta fil. Det finns ingen fast gräns för filstorlek eller antal sidor.

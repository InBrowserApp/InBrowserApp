## Konvertera OpenDocument-text lokalt

Öppna ett OpenDocument-dokument i formatet `.odt` eller en `.ott`-mall, konvertera filen till PDF, granska de resulterande sidorna och ladda ner samma PDF som visas i förhandsvisningen. Använd [ODT-visare](../odt-viewer/) för att läsa utan att konvertera.

## PDF-utseende och kompatibilitet

Konverteringsmotorn renderar sidformatmallar, pappersstorlekar, orientering, sidhuvuden, sidfötter, kolumner, tabeller och inbäddade bilder. Sidorna behåller den renderade ordningen, även tomma sidor som infogats av sidformatmallar. Text som stöds kan fortfarande markeras; ingen OCR läggs till för skannad text. Saknade teckensnitt ersätts med medföljande teckensnitt, så radbrytningar, avstånd och sidindelning kan ändras. Komplexa layouter kan skilja sig från ursprungsprogrammet. Kontrollera varje sida innan du förlitar dig på PDF-filen.

PDF-filen är en statisk export. Formulärkontroller visas som vid utskrift. Kommentarer, makron och digitala signaturer bevaras eller verifieras inte. Inbäddade objekt, medier och externa dokumentresurser stöds inte. Om dokumentet är skyddat, paketet är skadat eller saknat innehåll upptäcks, visas ett fel och ingen ofullständig fil kan laddas ner. Att byta filändelse ändrar inte det underliggande formatet.

## Integritet och webbläsarresurser

Konverteringen körs på din enhet. Vid den första konverteringen laddas cirka 90 MB motor- och teckensnittsfiler ner, som webbläsaren kan spara i cacheminnet; själva dokumentet laddas aldrig upp. Motorn läses in först efter att du har valt en fil. En uppdaterad webbläsare med stöd för WebAssembly och delat minne krävs. Stora eller komplexa dokument kan kräva tid och minne. Du kan avbryta konverteringen, stänga eller byta fil. Det finns ingen fast gräns för filstorlek eller antal sidor.

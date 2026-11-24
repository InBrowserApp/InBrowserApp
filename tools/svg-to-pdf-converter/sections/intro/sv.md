## Så konverterar du SVG till PDF

1. Släpp en `.svg`-fil i konverteraren eller klicka på **Välj SVG-fil**. Klicka på **Prova ett exempel** om du vill se hur exporten går till.
2. Granska förhandsvisningen. Behåll **SVG-filens originalstorlek** om sidan ska ha samma mått som ritytan för logotypen, ikonen eller illustrationen. Välj **A4** eller **US Letter** om du behöver ett standardformat.
3. Klicka på **Ladda ner PDF** för att spara en ensidig PDF med samma filnamn som SVG-filen, fast med ändelsen `.pdf`. Konverteringen sker i din webbläsare och SVG-filen stannar på din enhet.

## Vad förblir vektorgrafik i PDF-filen?

Banor, former, fyllningar och konturer ritas direkt i PDF-filen. Logotyper, diagram och streckteckningar håller sig därför skarpa när du zoomar in eller skriver ut. Inbäddade rasterbilder i format som stöds, till exempel ett foto i PNG-format, behåller sin ursprungliga upplösning. Zooma in i PDF-filen för att snabbt granska tunna linjer och kurvor innan du delar den.

## Hur bestäms PDF-sidans storlek?

Med **SVG-filens originalstorlek** används ritytans mått eller beräknas måtten från filens `viewBox`. Konverteringen utgår från standardförhållandet 96 SVG-pixlar per tum. En SVG-fil på 960 × 480 px ger till exempel en PDF-sida på 10 × 5 tum. Med **A4** och **US Letter** centreras grafiken på sidan med marginaler. Proportionerna bevaras, och sidorienteringen anpassas till grafiken.

## Varför ser min PDF annorlunda ut än förhandsvisningen?

Förhandsvisningen använder webbläsarens renderingsmotor. PDF-motorn stöder vanlig vektorgrafik. Egna teckensnitt, filter, masker och effekter kan se annorlunda ut eller utelämnas. Externa resurser hoppas över. För att bevara textens form och färgerna kan du omvandla texten till banor i ditt ritprogram, bädda in PNG- eller JPEG-bilder och förenkla komplexa effekter. Granska den nedladdade PDF-filen innan du skriver ut den.

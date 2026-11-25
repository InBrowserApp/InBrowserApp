## Så konverterar du CB7 till PDF

Välj en `.cb7`-fil eller dra den till konverteraren. Det går också bra att använda ett `.7z`-arkiv med seriebilder. Varje bild blir en PDF-sida. Granska förhandsvisningen och välj sedan **Ladda ner PDF**. Till exempel blir `volume-01.cb7` till `volume-01.pdf`.

## Sidordning, bildkvalitet och sökbar text

CB7 lagrar seriesidor i ett 7z-arkiv. Konverteraren sorterar efter hela mapp- och filsökvägen och läser siffrorna som tal. Därför kommer `chapter2/page2.jpg` före `chapter2/page10.jpg`. Stående sidor och breda uppslag behåller sina ursprungliga pixelmått och proportioner. JPEG, PNG, GIF, WebP och BMP stöds. AVIF fungerar i webbläsare som kan läsa formatet.

Texten förblir en del av bilden. För att söka i dialogen kan du öppna den färdiga PDF-filen i [PDF OCR](../pdf-ocr/) och välja det språk som används i serien.

## Stora eller skyddade arkiv

Konverteringen sker på din enhet och verktyget visar vilken sida som bearbetas. I ett stort solitt 7z-arkiv kan flera bilder ligga i samma komprimerade block, så det kan ta längre tid att läsa sidorna. Välj **Avbryt konvertering** för att stoppa arbetet och välja en annan fil. Om arkivet är lösenordsskyddat eller uppdelat i flera delar, packa upp det först och samla bilderna i ett enda arkiv som går att öppna. Använd [CB7-serieläsaren](../cb7-reader/) för att bläddra i originalet eller [CBZ till PDF](../cbz-to-pdf-converter/) för ZIP-baserade serier.

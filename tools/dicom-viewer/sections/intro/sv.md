## Så öppnar du DICOM-filer

Välj **Öppna DICOM-filer** eller släpp en eller flera filer i visaren. Markera alla bilder i en CT- eller MR-serie för att bläddra genom snitten. Om filerna innehåller flera serier kan du byta mellan dem under **Serie**. Du kan öppna filer med filändelsen `.dcm` eller `.dicom` och filer utan filändelse.

Rulla över bilden, fokusera på den och använd uppåt- eller nedåtpilen, eller använd skjutreglaget eller knapparna under bilden. Välj **Prova ett exempel** för att utforska en syntetisk CT-serie innan du öppnar egna filer.

## Justera fönsterbredd och fönsternivå

Fönsterbredden avgör hur stort intervall av gråvärden som visas. Ett smalare fönster ökar kontrasten inom det intervallet. Fönsternivån, som även kallas fönstercentrum, flyttar intervallet mot högre eller lägre värden. Ange värdena under **Fönsterinställningar** eller dra vågrätt över bilden för att ändra bredden och lodrätt för att ändra nivån. Välj **Återställ** för att återgå till de ursprungliga inställningarna för det aktuella snittet.

## Granska DICOM-metadata

Öppna **Metadata** för att visa taggarna i den aktuella filen. Om uppgifterna finns i filen visas till exempel modalitet, seriebeskrivning och bildmått. Sök efter taggnummer, attributnamn eller värde. För en fil med flera bildrutor visar tabellen de gemensamma attributen för filen. Metadata kan innehålla uppgifter som identifierar en person. Filerna och taggarna behandlas på den här enheten utan uppladdning.

## DICOM-bilder som stöds

Visaren öppnar DICOM-bilder i gråskala med okomprimerade pixeldata eller förlustfri JPEG-komprimering (JPEG Lossless). Det gäller även filer som innehåller flera bildrutor. DICOM är ett behållarformat, och kodningen av pixeldata avgör om en bild kan visas. Om bilden använder en annan kodning, till exempel JPEG 2000, kan du välja att exportera en okomprimerad DICOM-fil från det ursprungliga bildprogrammet. Visaren är till för att granska filer och bilder. Använd en klinisk arbetsstation för diagnostik.

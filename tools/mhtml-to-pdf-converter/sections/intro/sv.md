## Konvertera sparade webbarkiv lokalt

Öppna ett lokalt `.mhtml`- eller `.mht`-arkiv, granska de genererade sidorna och ladda ner PDF-filen som visas i förhandsvisningen. Det här skapar en PDF-fil direkt, utan någon utskriftsdialog. Huvuddokumentet använder bilder och stilar som ingår i arkivet. För att läsa utan konvertering, använd [MHTML-visare](../mhtml-viewer/). Vanliga HTML-dokument behöver [HTML till PDF-konverterare](../html-to-pdf-converter/); sparade e-postmeddelanden hör hemma i [E-postvisare](../email-viewer/).

## Utskriftsresultat och arkiv som stöds

Det arkiverade huvuddokumentet flödas om på stående A4-sidor med 18 mm marginaler och avbildas sedan som bildsidor med 150 DPI. Rubriker, stycken, listor, tabeller, kod, uttryckliga sidbrytningar, grundläggande stilar och inbäddade rasterbilder som stöds inkluderas. Breda tabeller och kod flödas om till sidbredden. Texten i PDF-filen kan inte markeras, och OCR och interaktiva länkar läggs inte till. Teckensnitt, avstånd och sidindelning kan skilja sig från den sparade sidan. Kontrollera varje sida innan du förlitar dig på resultatet.

Ofullständiga arkiv, textkodningar som inte stöds, saknade resurser, oläsbara bilder och utskriftsinnehåll som inte stöds stoppar konverteringen utan att en delvis färdig fil blir tillgänglig för nedladdning. Arkiv med inbäddade ramar eller ytterligare sidor måste först sparas som ett fristående huvuddokument. Skript, formulär, inbäddade appar, SVG och MathML utelämnas. Komplexa webbplatslayouter och inbäddade teckensnitt stöds inte. Responsiva stilar avsedda för skärm styr inte de utskrivna sidorna, och källans pappersstorlekar ersätts av den fasta A4-layouten.

## Integritet och webbläsarresurser

Ditt arkiv stannar i den här webbläsaren. Inkluderade resurser läses från filen. Saknat innehåll eller fjärrinnehåll hämtas aldrig, och den ursprungliga webbplatsen kontaktas inte. Filinnehållet laddas aldrig upp. Stora arkiv kan kräva tid och minne eftersom varje sida renderas som en bild. Du kan avbryta, stänga eller byta arkiv. Det finns ingen fast gräns för filstorlek eller sidantal. Faktiska resursproblem i webbläsaren ger ett felmeddelande när de kan upptäckas.

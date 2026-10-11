## Konvertera ett Markdown-dokument lokalt

Öppna ett lokalt dokument i formatet `.md`, `.markdown`, `.mdown` eller `.txt`, granska de skapade sidorna och ladda ner PDF-filen som visas i förhandsvisningen. En PDF-fil skapas direkt utan någon utskriftsdialog. Källfiler i UTF-8 och UTF-16 med byteordningsmärke stöds. Använd [Markdown-förhandsgranskaren](../markdown-previewer/) för att läsa eller redigera källan.

## Utskriftsresultat och källformat som stöds

Standard-Markdown samt tabeller, uppgiftslistor, genomstrykning och avgränsade kodblock i GitHub-stil stöds. Dokumentet renderas med ett fast utskriftstema på stående A4-sidor med 18 mm marginaler och avbildas sedan som bildsidor med 150 DPI. Uppgifternas bockmarkeringar förblir synliga och hopfällda detaljavsnitt visas utvecklade. Breda tabeller och kod flödas om till sidans bredd. Texten i PDF-filen kan inte markeras, och OCR och interaktiva länkar läggs inte till. Teckensnitt, avstånd och sidindelning kan skilja sig från andra Markdown-verktyg. Kontrollera varje sida innan du förlitar dig på resultatet.

Saknade bildresurser och oläsbara inbäddade bilder stoppar konverteringen utan att någon ofullständig fil blir tillgänglig för nedladdning. Använd inbäddade rasterbilder i ett fristående dokument. Inline-HTML saneras; skript, stilar, formulär, inbäddade appar, SVG och MathML utelämnas. Syntaxmarkering, matematik, diagram, fotnoter och andra dialekttillägg renderas inte; notation som inte stöds kan finnas kvar som text.

## Integritet och webbläsarresurser

Ditt dokument stannar i den här webbläsaren. Bilder och andra resurser hämtas aldrig från din dator eller nätverket, och filinnehåll laddas aldrig upp. Inbäddade rasterdata läses från det valda dokumentet. Stora filer kan kräva tid och minne eftersom varje sida renderas som en bild. Du kan avbryta, stänga eller byta dokumentet. Det finns ingen fast gräns för filstorlek eller sidantal; faktiska resursproblem i webbläsaren ger ett fel när de kan upptäckas.

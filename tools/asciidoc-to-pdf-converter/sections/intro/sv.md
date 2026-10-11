## Konvertera ett AsciiDoc-dokument lokalt

Öppna ett lokalt `.adoc`- eller `.asciidoc`-dokument, granska de genererade sidorna och ladda ner PDF-filen som visas i förhandsvisningen. PDF-filen skapas direkt, utan någon utskriftsdialog. Källfiler i UTF-8 och UTF-16 med byteordningsmärke stöds. För att läsa utan konvertering kan du använda [AsciiDoc-visaren](../asciidoc-viewer/).

## Utskriftsresultat och källinnehåll som stöds

Dokumentet renderas med ett fast utskriftstema på stående A4-sidor med 18 mm marginaler och fångas sedan som bildsidor med 150 DPI. Titlar, avsnitt, stycken, listor, tabeller, kod, informationsrutor, hänvisningsmarkörer, fotnoter, uttryckliga sidbrytningar och inbäddade rasterbilder som stöds inkluderas. Breda tabeller och kod flödas om till sidans bredd. Texten i PDF-filen kan inte markeras, och OCR och interaktiva länkar läggs inte till. Teckensnitt, avstånd och sidindelning kan skilja sig från andra AsciiDoc-verktyg. Kontrollera varje sida innan du förlitar dig på resultatet.

Inkluderade filer, saknade bild- och stilresurser, oläsbara bilder, tolkningsvarningar och olösta attribut stoppar konverteringen utan att en ofullständig fil kan laddas ner. Samla först det källinnehåll som behövs i ett enda fristående dokument. Egna makron, diagram, tillägg, projektteman och inbäddade teckensnitt stöds inte. Notation som inte stöds kan finnas kvar som text. Skript, formulär, inbäddade appar, SVG och MathML utelämnas. Aktivt innehåll i genomsläppt HTML tas bort. Källans pappersstorlekar ersätts av den fasta A4-layouten.

## Integritet och webbläsarresurser

Ditt dokument stannar i den här webbläsaren. Källfiler, bilder och andra resurser hämtas aldrig från din dator eller nätverket, och filinnehållet laddas aldrig upp. Inbäddade rasterdata läses från det valda dokumentet. Stora filer kan kräva tid och minne eftersom varje sida renderas som en bild. Du kan avbryta, stänga eller byta dokument. Det finns ingen fast gräns för filstorlek eller sidantal. Faktiska resursproblem i webbläsaren ger ett fel när de kan upptäckas.

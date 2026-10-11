## Konvertera AsciiDoc lokalt

Öppna en lokal `.adoc`- eller `.asciidoc`-fil, granska det renderade dokumentet och ladda ner en fristående HTML-fil i UTF-8. Filen öppnas offline och behåller markerbar text. För att granska källans varningar eller otillgängliga inkluderade filer före konverteringen kan du använda [AsciiDoc-visaren](../asciidoc-viewer/).

## Resultat och kompatibilitet

Rubriker, listor, tabeller, kodblock, informationsrutor, citat, fotnoter, länkar och inbäddade rasterbilder som stöds bevaras med ett fast lästema. Interna bokmärken och fotnoter stannar i dokumentet; externa länkar öppnas endast när de väljs. Breda kodblock och tabeller kan rullas horisontellt. Zoomning i förhandsvisningen ändrar inte den nedladdade filen. Teckensnitt och avstånd kan skilja sig från andra AsciiDoc-verktyg.

Använd en fristående källfil i UTF-8 eller UTF-16 med byteordningsmärke. Inkluderade filer och externa bild- och stilresurser läses inte in. Otillgängliga inkluderade filer, tolkningsvarningar, olösta attribut och saknade eller oläsbara resurser stoppar exporten utan att en ofullständig fil kan laddas ner. Inbäddade bilder, inklusive CSS-bakgrundsbilder, måste kunna avkodas. Egna makron, diagram, tillägg och inbäddade teckensnitt stöds inte. Skript, formulär, inbäddade appar, SVG och MathML utelämnas. Källsyntax som inte stöds kan finnas kvar som vanlig text.

## Integritet och webbläsarresurser

Filerna stannar i den här webbläsaren. Saknade resurser hämtas aldrig från din dator eller en webbplats, och filinnehållet laddas aldrig upp. Den genererade HTML-filen blockerar skript och automatisk inläsning av externa resurser. Att följa en extern länk är en separat åtgärd som kan kontakta den webbplatsen. Du kan avbryta, stänga eller byta källdokument. Det finns ingen fast gräns för filstorlek eller sidantal. Stora dokument är beroende av tillgängligt webbläsarminne, och resursproblem rapporteras när de kan upptäckas.

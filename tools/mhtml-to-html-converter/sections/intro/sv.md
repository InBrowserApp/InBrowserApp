## Konvertera ett sparat webbarkiv lokalt

Öppna ett lokalt `.mhtml`- eller `.mht`-arkiv, granska den konverterade huvudsidan och ladda ner en fristående HTML-fil i UTF-8. Inkluderade resurser behålls i filen så att den kan öppnas offline. För att läsa återställda eller ofullständiga arkiv, använd [MHTML-visare](../mhtml-viewer/).

## Resultat och kompatibilitet

Content-location- och content-ID-referenser som stöds hanteras inom arkivet. Text, grundläggande formatering, tabeller, länkar, inkluderade rasterbilder och stilar som stöds bevaras i ett läsbart statiskt dokument. Texten förblir markerbar. Interna bokmärken stannar i dokumentet och externa länkar öppnas endast när de väljs. Zoomning i förhandsvisningen ändrar inte den nedladdade filen. Teckensnitt och komplexa layouter kan skilja sig från den ursprungliga sparade sidan.

Skript, formulär, omdirigeringar, inbäddade appar, SVG och MathML utelämnas. Webbplatssessioner och interaktiva funktioner återställs inte. Ofullständiga arkiv, textkodningar som inte stöds, ytterligare sidor och saknade resurser stoppar konverteringen utan att en delvis färdig fil blir tillgänglig för nedladdning. Inbäddade bilder, inklusive CSS-bakgrundsbilder, måste kunna avkodas. Spara en fullständig kopia av huvuddokumentet separat om konverteringen misslyckas. E-postmeddelanden och vanliga HTML-filer behöver sina respektive verktyg.

## Integritet och webbläsarresurser

Filerna stannar i den här webbläsaren. Saknade resurser hämtas aldrig från din dator eller den levande webbplatsen, och filinnehållet laddas aldrig upp. Den genererade HTML-filen blockerar skript och inläsning av externa resurser när den öppnas offline. Att följa en extern länk är en separat åtgärd som kan kontakta den webbplatsen. Du kan avbryta, stänga eller byta arkiv. Det finns ingen fast gräns för filstorlek eller sidantal. Stora arkiv är beroende av tillgängligt webbläsarminne, och resursproblem rapporteras när de kan upptäckas.

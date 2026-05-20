Ta bort ägarlösenordsbegränsningar från en PDF direkt i webbläsaren. Verktyget skapar en ny PDF som inte längre innehåller behörighetsflaggor för redigering, utskrift, kopiering eller sidextrahering.

## När du ska använda det

Använd det när du redan har en PDF som öppnas normalt, men där dokumentet blockerar vanliga åtgärder som att skriva ut, kopiera text, redigera sidor eller sätta samman sidor i ett annat PDF-verktyg. Det är vanligt med formulär, exporterade rapporter, gamla fakturor och dokument som har skapats med restriktiva behörighetsinställningar för PDF.

## Så fungerar det

Ladda upp en PDF, granska den valda filen och kör sedan borttagningen. Verktyget kör qpdf i en webbläsarworker med PDF-operationen `--decrypt` och returnerar en ny PDF-fil för nedladdning. Originalfilen lämnas oförändrad, så du kan jämföra eller kassera resultatet om det inte är den version du behöver.

## Integritet och begränsningar

PDF-filen stannar i den här webbläsarsessionen; den laddas inte upp till någon server. Verktyget tar bort behörighetsbegränsningar från ägarlösenord i PDF-filer som redan kan öppnas. Det återställer inte ett förlorat användar-/öppningslösenord och kan inte låsa upp skadade filer eller krypteringslägen som inte stöds av qpdf-bygget som körs i webbläsaren.

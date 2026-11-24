## Så rensar du en HAR-fil

En HAR-fil (HTTP Archive) innehåller de nätverksbegäranden och svar som webbläsaren har registrerat. Filen kan innehålla sessionskakor, åtkomsttoken, URL:er och meddelanden med privata uppgifter. Gör en rensad kopia med det här verktyget innan du delar filen i ett supportärende, en felrapport eller med en kollega. Metod, statuskod och tidsmätningar bevaras för varje begäran.

1. Öppna webbläsarens utvecklarverktyg och gå till **Nätverk**. Återskapa problemet och exportera sedan loggen som en HAR-fil. Välj **Export HAR (sanitized)** i Chrome för att få en kopia där de vanligaste autentiseringshuvudena redan har tagits bort.
2. Öppna den exporterade HAR-filen här eller släpp den på sidan. Verktyget skapar en kopia så snart du väljer en fil. Prova exemplet för att se vad som ändras i en exempelinspelning.
3. Granska antalen och välj **Ladda ner rensad HAR-fil**. Den nya filen slutar på `.sanitized.har` och kan importeras i utvecklarverktygen eller öppnas i verktyget [HAR-nätverksanalysator](/sv/tools/har-analyzer/). Bearbetningen sker i webbläsaren.

## Vad tas bort eller maskeras?

Kakor och vanliga autentiseringshuvuden, däribland `Authorization` och `X-API-Key`, tas bort. Som standard maskeras också värden i URL-parametrar och innehållet i begäranden, svar och registrerade WebSocket-meddelanden tas bort. Till exempel blir `?token=example&page=2` till `?token=REDACTED&page=REDACTED` i den exporterade filen. Parameternamnen finns kvar för felsökning. Varje ändrat fält räknas, även när samma värde förekommer i flera fält.

Stäng av motsvarande alternativ om du behöver de ursprungliga parametervärdena eller meddelandenas innehåll för att återskapa ett problem. Värdnamn, URL-sökvägar, övriga HTTP-huvuden och webbläsarspecifika metadata kan fortfarande innehålla privata uppgifter. Granska de fälten innan du delar filen.

## Slik renser du en HAR-fil

En HAR-fil (HTTP Archive) lagrer nettverksforespørsler og svar som nettleseren har registrert. Den kan inneholde øktinformasjonskapsler, tilgangstokener, nettadresser og meldinger med private opplysninger. Bruk dette verktøyet til å lage en renset kopi som du kan dele i en supportsak, en feilrapport eller med en kollega. Metode, statuskode og tidsmålinger beholdes for hver forespørsel.

1. Åpne utviklerverktøyene i nettleseren og gå til **Nettverk**. Gjenskap problemet, og eksporter deretter loggen som en HAR-fil. Velg **Export HAR (sanitized)** i Chrome for å få en kopi der standardhodene for autentisering allerede er fjernet.
2. Åpne den eksporterte HAR-filen her eller slipp den på siden. Verktøyet lager en kopi så snart du velger en fil. Prøv eksempelet for å se hva som endres i et eksempelopptak.
3. Se over antall endringer, og velg **Last ned renset HAR-fil**. Den nye filen har endelsen `.sanitized.har` og kan importeres i utviklerverktøyene eller åpnes i verktøyet [HAR-nettverksanalysator](/no/tools/har-analyzer/). Behandlingen skjer i nettleseren din.

## Hva fjernes eller maskeres?

Verktøyet fjerner informasjonskapsler og vanlige autentiseringshoder, blant annet `Authorization` og `X-API-Key`. Som standard maskerer det også verdier i URL-parametere og fjerner innholdet i forespørsler, svar og registrerte WebSocket-meldinger. For eksempel blir `?token=example&page=2` til `?token=REDACTED&page=REDACTED` i den eksporterte filen. Parameternavnene beholdes til feilsøking. Hvert endret felt telles, også når samme verdi finnes i flere felt.

Slå av det aktuelle alternativet hvis du trenger de opprinnelige parameterverdiene eller meldingsinnholdet for å gjenskape problemet. Vertsnavn, URL-stier, vanlige HTTP-hoder og nettleserspesifikke metadata kan fortsatt inneholde private opplysninger. Se over disse feltene før du deler filen.

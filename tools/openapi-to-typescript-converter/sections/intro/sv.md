## Vad är OpenAPI till TypeScript-konverteraren?

OpenAPI till TypeScript-konverteraren omvandlar ett OpenAPI 3.x-dokument till genererade TypeScript-typer direkt i webbläsaren. Det är användbart när du vill ha en snabb typförhandsvisning, en nedladdningsbar deklarationsfil eller ett säkert sätt att testa `openapi-typescript`-alternativ utan att skicka ditt schema till en server.

## När ska den användas?

Använd det här verktyget när du redan har ett OpenAPI-schema i JSON eller YAML och vill ha typade request- och response-modeller för frontendappar, SDK-prototyper eller API-granskningar. Det är särskilt hjälpsamt när du vill jämföra genereringsalternativ innan du sparar utdata i ditt repository.

## Innan du genererar

Den här webbläsaromskrivningen stöder paketerade OpenAPI 3.0- och 3.1-dokument. Om ditt schema fortfarande innehåller externa `$ref`-mål, bunta eller inline:a dem först och generera sedan den slutliga TypeScript-utdata här.

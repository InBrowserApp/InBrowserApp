## Hva er OpenAPI til TypeScript-konvertering?

OpenAPI til TypeScript-konvertering gjør et OpenAPI 3.x-dokument om til genererte TypeScript-typer direkte i nettleseren. Det er nyttig når du vil ha en rask typeforhåndsvisning, en nedlastbar deklarasjonsfil, eller en trygg måte å teste `openapi-typescript`-valg uten å sende skjemaet til en server.

## Når du bør bruke det

Bruk dette verktøyet når du allerede har et OpenAPI-skjema i JSON eller YAML og vil ha typede request- og response-modeller for frontend-apper, SDK-prototyper eller API-gjennomganger. Det er spesielt nyttig når du vil sammenligne genereringsvalg før du committer resultatet til repositoriet.

## Før du genererer

Denne nettleserbaserte versjonen støtter sammenslåtte OpenAPI 3.0- og 3.1-dokumenter. Hvis skjemaet fortsatt inneholder eksterne `$ref`-mål, pakk dem sammen eller inline dem først, og generer deretter den endelige TypeScript-utdataen her.

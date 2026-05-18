UUID v6-generatorn skapar tidsbaserade UUID:er som behåller den välbekanta UUID-formen samtidigt som tidsstämpeln placeras först för naturlig lexikal sortering. Den körs helt i din webbläsare, så genererade identifierare och valfria nodvärden lämnar aldrig sidan.

## När UUID v6 hjälper

Använd UUID v6 när du behöver identifierare som förblir brett kompatibla med UUID-verktyg men också sorteras nära skapelseordningen i loggar, databasindex, händelseströmmar eller migreringsskript. UUID v6 ligger semantiskt närmast UUID v1: den använder en gregoriansk tidsstämpel, en klocksekvens och ett 48-bitars nodfält, men arrangerar om tidsstämpelbitarna så att nyare ID:n sorteras efter äldre ID:n.

## Nod-ID:n och integritet

Klassiska UUID v1-generatorer använder ofta en verklig MAC-adress som nodfält. Det här verktyget använder som standard ett slumpmässigt, lokalt administrerat nod-ID för varje genererad UUID så att ingen maskinvaruadress exponeras. Byt bara till en anpassad nod när du avsiktligt behöver v1-kompatibla utdata för testfixturer, interoperabilitetskontroller eller kontrollerade system.

## Klocksekvens och anpassad tid

Klocksekvensen hjälper till att undvika kollisioner när tidsstämplar upprepas eller klockor går bakåt. Den slumpmässiga standardsekvensen är säkrast vid normal användning. Anpassade tidsstämplar, nod-ID:n och klocksekvenser är användbara för deterministiska exempel, men upprepade anpassade värden bör användas försiktigt i produktionsdata.

Generera UUID v1-identifierare lokalt i webbläsaren när du behöver värden som innehåller skapelsetid och en nodidentifierare. Verktyget är användbart för äldre integrationer, databasimporter, sorterade testdata och system som fortfarande förväntar sig UUID:n enligt RFC 4122 version 1.

## När UUID v1 hjälper

UUID v1 lagrar en tidsstämpel, en clock sequence och ett 48-bitars nodvärde i en standardiserad UUID-sträng med 36 tecken. Det gör genererade ID:n ungefär sorterbara efter skapelsetid, samtidigt som de fortfarande passar system som accepterar vanliga UUID-kolumner, URL:er, loggar och API-payloads.

## Integritet och nodidentifierare

Klassisk UUID v1-generering använde en riktig MAC-adress från ett nätverkskort, vilket kan exponera information om maskinvaran. Det här verktyget börjar i stället med en lokalt administrerad slumpmässig MAC-adress. Du kan ange ett specifikt nodvärde när du behöver matcha ett äldre system, men undvik att använda riktiga maskinvaruadresser i offentliga exempel eller delade data.

## Clock Sequence och batchgenerering

Clock sequence är ett 14-bitarsvärde som hjälper till att undvika kollisioner när samma nod genererar ID:n ungefär samtidigt. Batchgenerering håller alla ID:n i samma millisekund och ökar 100-nanosekundssteget för varje rad, så att varje värde i resultatet förblir unikt.

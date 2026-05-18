# Vad är en UUID-avkodare?

En UUID-avkodare förklarar strukturen inuti en universellt unik identifierare. Den normaliserar vanliga inklistrade format, kontrollerar att värdet är ett 128-bitars UUID och visar version, variant, råa hexadecimala byte och kopieringsklara numeriska representationer.

UUID-värden behandlas ofta som ogenomskinliga strängar, men versionsnibblen visar hur identifieraren skapades. UUID-värden av version 4 är slumpmässiga, version 3 och 5 är namnbaserade hashvärden, och tidsordnade versioner som 1, 6 och 7 kan bära tidsstämpelinformation.

## När du ska använda den

Använd det här verktyget när du behöver granska en identifierare från loggar, databaser, API:er, spårningar eller testfixturer. Det är användbart för att bekräfta om ett UUID är slumpmässigt eller tidsbaserat, konvertera det till decimalform eller Base64 för ett annat system och upptäcka om nodfältet i ett UUID v1 eller v6 kan exponera en MAC-liknande identifierare.

Avkodaren körs i din webbläsare och skickar inte UUID-värden till någon server. Den accepterar kanoniska UUID-värden, `urn:uuid:`-värden, UUID-värden inom klamrar, indata med versaler och 32 tecken långa hexadecimala UUID-värden utan bindestreck.

## Saker att vara uppmärksam på

UUID:ns versions- och variantfält beskriver bitlayouten, inte om identifieraren faktiskt är globalt unik i praktiken. Ett UUID som ser giltigt ut kan ändå vara duplicerat om det genererades dåligt eller kopierades av misstag.

För UUID-värden av version 1 och 6 kan nodfältet se ut som en MAC-adress. Moderna generatorer kan i stället sätta multicast-biten och använda en slumpmässig nod, så behandla det som en nodidentifierare om du inte kontrollerar generatorn.

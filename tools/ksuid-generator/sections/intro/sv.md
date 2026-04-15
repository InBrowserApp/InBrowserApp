Generera KSUID lokalt i webbläsaren utan att skicka den aktuella batchen till någon annan tjänst. Verktyget passar när du behöver identifierare som förblir unika i distribuerade system och samtidigt kan sorteras ungefär efter skapandetid i loggar, flöden, importer eller ordnade poster.

## Varför Använda KSUID

KSUID kombinerar en 32-bitars tidsstämpel med 128 bitar slumpdata och kodar resultatet som en Base62-sträng på 27 tecken. Det gör varje ID kompakt, URL-vänligt och enkelt att lagra, medan den inbyggda tidsstämpeln gör att nyare värden vanligtvis hamnar efter äldre.

## Välj Aktuell Eller Anpassad Tid

Använd aktuell tid när du vill skapa nya ID:n för produktionsdata, demovärden eller vanlig batchgenerering. Växla till en anpassad tidsstämpel när du behöver reproducerbara fixtures, retroaktivt ifyllda poster, migrationsprov eller testfall som ska se ut att vara skapade vid en viss tidpunkt.

## Det Här Bör Du Veta Innan Export

KSUID behåller bara sekundprecision, så indata med millisekunder avrundas nedåt till början av den sekunden. ID:n som skapas under samma sekund är fortfarande unika, men den slutliga ordningen påverkas också av den slumpmässiga delen. Se därför KSUID som tids-sorterbart, inte som strikt sekventiellt.

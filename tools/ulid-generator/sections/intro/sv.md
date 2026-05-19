Generera ULID:er lokalt i webbläsaren för poster, händelser, loggar, fixturer och distribuerade system som behöver kompakta identifierare med tidssorterbara prefix. Varje värde skapas på den här enheten och kan kopieras eller laddas ned utan att skicka batchen till en annan tjänst.

## Varför använda ULID

ULID står för Universally Unique Lexicographically Sortable Identifier. Det kombinerar en 48-bitars Unix-tidsstämpel i millisekunder med 80 bitars slumpmässighet och kodar sedan resultatet som en Crockford Base32-sträng med 26 tecken. Den formen gör ULID:er URL-säkra, databasvänliga och naturligt sorterbara efter skapandetid.

## Aktuell eller anpassad tid

Använd aktuell tid för vanliga applikationsposter, importnycklar och testdata som ska återspegla när de skapades. Växla till en anpassad tidsstämpel när du behöver deterministiskt utseende exempel, återfyllda rader, uppspelade händelser eller fixturer som ska sorteras kring ett specifikt ögonblick.

## Monotona batcher

När monotont batchläge är aktiverat ökar ID:n som genereras för samma millisekund sitt slumpmässiga segment så att batchen förblir lexikografiskt sorterad uppifrån och ned. Inaktivera det när du vill att varje rad ska använda ett nytt slumpmässigt segment i stället. Båda lägena behåller tidsstämpeln synlig i de första tio tecknen.

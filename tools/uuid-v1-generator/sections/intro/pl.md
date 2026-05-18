Generuj identyfikatory UUID v1 lokalnie w przeglądarce, gdy potrzebujesz wartości zawierających czas utworzenia i identyfikator węzła. To narzędzie przydaje się w starszych integracjach, importach baz danych, uporządkowanych danych testowych i systemach, które nadal oczekują UUID w wersji 1 zgodnych z RFC 4122.

## Kiedy UUID v1 pomaga

UUID v1 przechowuje znacznik czasu, sekwencję zegara i 48-bitową wartość węzła w standardowym 36-znakowym ciągu UUID. Dzięki temu wygenerowane ID są w przybliżeniu sortowalne według czasu utworzenia, a jednocześnie pasują do systemów akceptujących zwykłe kolumny UUID, adresy URL, logi i ładunki API.

## Prywatność i identyfikatory węzłów

Klasyczne generowanie UUID v1 używało rzeczywistego adresu MAC karty sieciowej, co mogło ujawniać informacje o sprzęcie. To narzędzie zamiast tego zaczyna od losowego adresu MAC administrowanego lokalnie. Możesz wprowadzić konkretną wartość węzła, gdy dopasowujesz dane do starszego systemu, ale unikaj używania rzeczywistych adresów sprzętowych w publicznych przykładach lub udostępnianych danych.

## Sekwencja zegara i generowanie partii

Sekwencja zegara to 14-bitowa wartość, która pomaga unikać kolizji, gdy ten sam węzeł generuje ID w zbliżonym czasie. Generowanie partii utrzymuje wszystkie ID w tej samej milisekundzie i zwiększa takt 100-nanosekundowy dla każdego wiersza, dzięki czemu każda wartość w wyniku pozostaje odrębna.

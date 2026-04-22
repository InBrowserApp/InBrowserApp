## Co robi to narzędzie

To narzędzie konwertuje początkowy adres IP i końcowy adres IP na najmniejszy zestaw bloków CIDR, który dokładnie obejmuje pełny zakres. Wszystko działa lokalnie w Twojej przeglądarce, więc adresy nigdy nie opuszczają Twojego urządzenia.

## Jak działa pokrycie CIDR

Blok CIDR reprezentuje sieć potęgi dwóch, wyrównaną na pasującej granicy. Kiedy zakres zaczyna się lub kończy w środku tych granic, jeden blok nie wystarczy. Konwerter pobiera największy pasujący blok, a następnie powtarza tę czynność, aż do uwzględnienia całego zakresu.

## Dlaczego może pojawić się wiele bloków

Zakresy takie jak 192.168.1.10 do 192.168.1.25 nie zaczynają się na czystej granicy sieci i na niej też się nie kończą. Dokładnym wynikiem jest zatem krótka lista bloków, z których każdy obejmuje jedną wyrównaną część, bez dodatkowych adresów spoza żądanego zakresu.

## Kiedy jest to przydatne

Użyj go podczas przygotowywania reguł zapory sieciowej, podsumowań tras, wpisów ACL, grup zabezpieczeń w chmurze lub list kontrolnych migracji, gdzie surowy zakres początkowy i końcowy musi stać się standardową notacją CIDR.

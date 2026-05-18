Generator UUID v6 tworzy oparte na czasie identyfikatory UUID, które zachowują znany format UUID, a jednocześnie umieszczają znacznik czasu na początku, aby umożliwić naturalne sortowanie leksykograficzne. Działa w całości w przeglądarce, więc wygenerowane identyfikatory i opcjonalne wartości węzła nigdy nie opuszczają strony.

## Kiedy UUID v6 się przydaje

Używaj UUID v6, gdy potrzebujesz identyfikatorów, które pozostają szeroko zgodne z narzędziami UUID, ale sortują się także blisko kolejności utworzenia w logach, indeksach baz danych, strumieniach zdarzeń lub skryptach migracyjnych. UUID v6 jest semantycznie najbliższy UUID v1: używa gregoriańskiego znacznika czasu, sekwencji zegara i 48-bitowego pola węzła, ale przestawia bity znacznika czasu tak, aby nowsze identyfikatory sortowały się po starszych.

## Identyfikatory węzła i prywatność

Klasyczne generatory UUID v1 często używają rzeczywistego adresu MAC jako pola węzła. To narzędzie domyślnie używa losowego, lokalnie administrowanego identyfikatora węzła dla każdego wygenerowanego UUID, dzięki czemu nie ujawnia adresu sprzętowego. Przełącz się na własny węzeł tylko wtedy, gdy celowo potrzebujesz danych wyjściowych zgodnych z v1 do danych testowych, sprawdzeń interoperacyjności lub kontrolowanych systemów.

## Sekwencja zegara i czas niestandardowy

Sekwencja zegara pomaga unikać kolizji, gdy znaczniki czasu się powtarzają lub zegary cofają. Domyślna losowa sekwencja jest najbezpieczniejsza przy zwykłym użyciu. Niestandardowe znaczniki czasu, identyfikatory węzła i sekwencje zegara są przydatne do deterministycznych przykładów, ale powtarzanych wartości niestandardowych należy używać ostrożnie w danych produkcyjnych.

UUID v7 to nowoczesny format UUID, który umieszcza znacznik czasu Unix w milisekundach na początku identyfikatora, a pozostałe bity wypełnia losowością. Dzięki temu wartości są w praktyce globalnie unikatowe, a jednocześnie naturalnie sortowalne według czasu utworzenia.

## Co robi to narzędzie

Ten generator tworzy wartości UUID v7 w całości w przeglądarce. Możesz wygenerować pojedynczy identyfikator albo partię do 100 elementów, a następnie skopiować listę lub pobrać ją jako plik tekstowy do danych początkowych, rekordów baz danych, danych testowych zdarzeń albo ładunków testowych.

## Czas bieżący lub niestandardowy

Użyj bieżącego czasu dla typowych rekordów aplikacji, kluczy importu i danych testowych, które powinny odzwierciedlać moment utworzenia. Przełącz na niestandardowy znacznik czasu, gdy potrzebujesz próbek wyglądających deterministycznie, uzupełnionych wstecz wierszy, odtworzonych zdarzeń lub danych testowych, które powinny sortować się wokół konkretnego momentu.

## Kiedy UUID v7 pomaga

UUID v7 przydaje się, gdy potrzebujesz nieczytelnych znaczeniowo identyfikatorów, które nadal dobrze sortują się w bazach danych, logach, kolejkach i rozproszonych strumieniach zdarzeń. W porównaniu z losowymi wartościami UUID v4, UUID v7 zmniejsza przetasowania indeksów, ponieważ nowsze rekordy zwykle trafiają blisko końca posortowanej przestrzeni kluczy.

## Uwagi dotyczące sortowania i bezpieczeństwa

Fragment znacznika czasu zapisuje milisekundy, a nie prywatną ani tajną wartość. Jeśli identyfikator nie powinien ujawniać przybliżonego czasu utworzenia, użyj zamiast tego w pełni losowego formatu. W ramach jednej wygenerowanej partii to narzędzie utrzymuje monotoniczność wartości dla tej samej milisekundy, zachowując jednocześnie bity wersji i wariantu UUID v7.

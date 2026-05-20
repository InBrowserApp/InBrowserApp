Generuj ULID lokalnie w przeglądarce dla rekordów, zdarzeń, logów, danych testowych i systemów rozproszonych, które potrzebują kompaktowych identyfikatorów z prefiksami sortowalnymi według czasu. Każda wartość jest tworzona na tym urządzeniu i może zostać skopiowana lub pobrana bez wysyłania partii do innej usługi.

## Dlaczego warto używać ULID

ULID oznacza Universally Unique Lexicographically Sortable Identifier. Łączy 48-bitowy znacznik czasu Unix w milisekundach z 80 bitami losowości, a następnie koduje wynik jako 26-znakowy ciąg Crockford Base32. Taka postać sprawia, że ULID są bezpieczne dla URL, wygodne dla baz danych i naturalnie sortowalne według czasu utworzenia.

## Czas bieżący lub niestandardowy

Użyj bieżącego czasu dla typowych rekordów aplikacji, kluczy importu i danych testowych, które powinny odzwierciedlać moment utworzenia. Przełącz na niestandardowy znacznik czasu, gdy potrzebujesz próbek wyglądających deterministycznie, uzupełnionych wstecz wierszy, odtworzonych zdarzeń lub danych testowych, które powinny sortować się wokół konkretnego momentu.

## Partie monotoniczne

Gdy tryb partii monotonicznej jest włączony, identyfikatory wygenerowane dla tej samej milisekundy zwiększają swój losowy segment, dzięki czemu partia pozostaje posortowana leksykograficznie od góry do dołu. Wyłącz go, gdy chcesz, aby każdy wiersz używał zamiast tego świeżego losowego segmentu. Oba tryby zachowują znacznik czasu widoczny w pierwszych dziesięciu znakach.

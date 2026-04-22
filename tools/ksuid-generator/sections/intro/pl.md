Generuj KSUID lokalnie w przeglądarce, bez wysyłania bieżącej partii do innej usługi. To narzędzie przydaje się, gdy potrzebujesz identyfikatorów, które pozostają unikalne w systemach rozproszonych, a jednocześnie można je w przybliżeniu sortować według czasu utworzenia w logach, kanałach, importach lub uporządkowanych rekordach.

## Dlaczego Warto Używać KSUID

KSUID łączy 32-bitowy znacznik czasu ze 128 bitami losowych danych i koduje wynik jako 27-znakowy ciąg Base62. Dzięki temu każdy identyfikator pozostaje krótki, przyjazny dla URL i łatwy do przechowywania, a osadzony znacznik czasu sprawia, że nowsze wartości zwykle trafiają za starsze.

## Wybierz Bieżący Albo Własny Czas

Użyj bieżącego czasu, gdy chcesz wygenerować nowe identyfikatory dla danych produkcyjnych, dem lub zwykłych partii roboczych. Przełącz się na własny znacznik czasu, gdy potrzebujesz powtarzalnych fixture'ów, rekordów uzupełnianych wstecz, przykładów migracji albo testów, które mają wyglądać tak, jakby powstały w określonym momencie.

## Co Warto Wiedzieć Przed Eksportem

KSUID zachowuje dokładność tylko do sekund, więc każde wejście z milisekundami jest zaokrąglane w dół do początku tej sekundy. Identyfikatory utworzone w tej samej sekundzie nadal pozostają unikalne, ale ich ostateczna kolejność zależy też od losowej części. Dlatego KSUID najlepiej traktować jako identyfikator sortowalny czasowo, a nie ściśle sekwencyjny.

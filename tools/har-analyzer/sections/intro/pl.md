## Otwórz zapis HAR

Po zarejestrowaniu żądań, które chcesz zbadać, wyeksportuj plik HAR (HTTP Archive) z panelu Sieć w przeglądarce. Otwórz lub upuść tutaj plik `.har` lub `.json` albo wczytaj przykład. Plik może mieć maksymalnie 20 MiB i zawierać do 20 000 wpisów.

## Znajdź powolne lub nieudane żądania

Wyszukuj według adresu URL, metody, statusu lub typu MIME, a następnie sortuj według czasu rozpoczęcia, czasu trwania lub rozmiaru przesłanych danych. Żądania mają wspólną skalę czasu, liczoną od najwcześniejszego żądania. Wybierz żądanie, aby sprawdzić nagłówki, pliki cookie, parametry, treści i czasy etapów.

Filtr nieudanych żądań obejmuje statusy 0, 4xx i 5xx. Status 0 oznacza, że nie zarejestrowano odpowiedzi HTTP; filtr 3xx obejmuje odpowiedzi 304 związane z pamięcią podręczną. Czas TLS jest częścią czasu połączenia.

## Odczytaj zarejestrowane dane

Przetwarzanie odbywa się w przeglądarce. Dostępne szczegóły zależą od eksportu. Nieznane rozmiary są pomijane w podsumowaniu; czas trwania zapisu jest niedostępny, jeśli brakuje czasu trwania dowolnego żądania. Wykres kaskadowy nadal korzysta z zarejestrowanych czasów rozpoczęcia i znanych czasów zakończenia.

Podglądy treści zachowują zarejestrowany tekst. Podglądy i ich kopie oraz wartości pojedynczych pól są ograniczone do 100 000 znaków. Zakodowana treść pozostaje zakodowana.

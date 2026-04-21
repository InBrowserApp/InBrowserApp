Konwertuj liczby całkowite bezpośrednio w przeglądarce między zapisem binarnym, ósemkowym, dziesiętnym, szesnastkowym, Base32, Base36, Base62, Base64 oraz podstawami niestandardowymi od 2 do 64. Wszystkie obliczenia działają lokalnie z użyciem BigInt, więc możesz sprawdzać duże wartości bez wysyłania ich na serwer.

## Kiedy używać

To narzędzie przydaje się, gdy ta sama liczba całkowita pojawia się w logach, protokołach, identyfikatorach lub specyfikacjach w różnych alfabetach. Zmiana dowolnego pola natychmiast przelicza pozostałe, co ułatwia debugowanie, dokumentację i ręczną weryfikację.

## Różnice między podstawami

Do podstawy 36 litery są akceptowane bez rozróżniania wielkości. Wyższe podstawy traktują małe i wielkie litery jako różne cyfry, a wiersz Base64 używa alfabetu numerycznego `A-Z a-z 0-9 + /`, a nie tekstowego kodowania Base64 dla bajtów.

## Na co uważać

Obsługiwane są tylko nieujemne liczby całkowite. Zera wiodące są traktowane jako formatowanie, więc wynik konwersji jest normalizowany i może utracić dopełnienie wpisane wcześniej.

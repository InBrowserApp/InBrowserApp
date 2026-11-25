## Generowanie losowych numerów VIN do testów

Ustaw liczbę od `1` do `1000`, a następnie wybierz **Generuj**. Każdy wiersz zawiera jeden 17-znakowy numer identyfikacyjny pojazdu (VIN). Wybierz **Kopiuj wszystko**, aby wkleić grupę numerów do formularza testowego lub arkusza kalkulacyjnego, albo **Pobierz TXT**, aby zapisać plik tekstowy z jednym numerem VIN w każdym wierszu.

## Odczytywanie numeru VIN i cyfry kontrolnej

Pierwsze trzy znaki tworzą identyfikator producenta. Znaki od czwartego do ósmego opisują pojazd, a dziewiąty znak to cyfra kontrolna. Ostatnie osiem znaków tworzy sekcję identyfikacji pojazdu. Litery `I`, `O` i `Q` są pomijane, aby nie pomylić ich z cyframi. Cyfra kontrolna jest obliczana na podstawie pozostałych 16 znaków i może być cyfrą od `0` do `9` lub znakiem `X`. Na przykład w `1M8GDM9AXKP042788` dziewiątym znakiem jest `X`.

## Używanie przykładowego numeru VIN w danych testowych

Użyj wygenerowanych numerów VIN do sprawdzenia pól wymaganych, importu zbiorczego lub walidacji formatu i cyfry kontrolnej. Aby sprawdzić odrzucenie, zmień tylko dziewiąty znak na inną cyfrę i ponownie wyślij wartość. Generator tworzy syntetyczne numery VIN, więc pola przypominające producenta, rok modelowy lub numer seryjny należy traktować jako dane przykładowe. Do rejestracji, wyszukiwania części lub sprawdzania historii pojazdu użyj numeru VIN znajdującego się na pojeździe lub w jego dokumentach.

## Konwersja animowanego WebP na GIF

Animowany WebP zapisuje wiele klatek w jednym pliku `.webp`. Przekonwertuj go
na GIF, gdy komunikator, witryna z dokumentacją lub inna usługa wymaga tego
formatu animacji. Narzędzie obsługuje animowane pliki WebP z kompresją stratną
i bezstratną. Przetwarzanie odbywa się na Twoim urządzeniu.

### Jak przekonwertować animowany WebP na GIF?

1. Kliknij **Wybierz plik** lub upuść animowany WebP w obszarze narzędzia.
2. Kliknij **Utwórz GIF**, aby przekonwertować klatki w oryginalnych wymiarach.
3. Kliknij **Odtwórz**, aby obejrzeć wynik, a następnie **Pobierz GIF**, aby go zapisać.

### Co dzieje się z czasem wyświetlania klatek i liczbą odtworzeń?

Czas wyświetlania każdej klatki jest zaokrąglany do jednostek GIF-u po 10 ms,
przy minimalnym czasie odtwarzania wynoszącym 20 ms na klatkę. Na przykład po
klatce trwającej 100 ms nadal nastąpi klatka trwająca 250 ms. Jeśli WebP ma
określoną liczbę odtworzeń, GIF zachowa ją w całości. Gdy WebP odtwarza się
bez końca, GIF również będzie odtwarzany w nieskończoność.

### Jak GIF zapisuje przezroczystość i kolory?

GIF używa indeksowanej palety do 256 pozycji na klatkę z jedną pozycją dla
przezroczystości. WebP obsługuje częściową przezroczystość, dlatego półprzezroczyste
cienie i wygładzone krawędzie mogą wyglądać inaczej w GIF-ie. Na gradientach o
wielu kolorach mogą też pojawić się pasma. Sprawdź efekt na tle, którego zamierzasz
użyć.

### Często zadawane pytania

#### Czy mogę przekonwertować statyczny WebP?

Do konwersji potrzebne są klatki animacji. Rozszerzenie `.webp` mają zarówno
obrazy statyczne, jak i animowane. Aby z kilku obrazów utworzyć ruchomy GIF,
użyj [Kreatora GIF-ów](/pl/tools/gif-maker/).

#### Dlaczego GIF jest większy od WebP?

WebP wydajnie kompresuje kolory i obszary, które zmieniają się między klatkami.
GIF może być większy nawet przy identycznych wymiarach i czasach wyświetlania.
Jeśli miejsce publikacji ogranicza wielkość przesyłanych plików, sprawdź rozmiar
podany przy podglądzie.

### Powiązane narzędzia do animacji

Do konwersji w drugą stronę użyj [Konwertera GIF do animowanego WebP](/pl/tools/gif-to-animated-webp-converter/).
Jeśli masz animowany PNG, użyj [Konwertera APNG na GIF](/pl/tools/apng-to-gif-converter/).

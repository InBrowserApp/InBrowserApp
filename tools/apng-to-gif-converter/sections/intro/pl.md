## Konwersja animowanego PNG na GIF

APNG zapisuje wiele klatek w jednym pliku PNG. Przekonwertuj go na GIF, aby
udostępnić animację na czacie, forum lub w dokumentacji wymagającej tego
formatu. Pliki animowane mogą mieć rozszerzenie `.apng` lub `.png`. Konwerter
odczytuje dane animacji z pliku i przetwarza je na Twoim urządzeniu.

### Jak przekonwertować APNG na GIF?

1. Kliknij **Wybierz plik** lub upuść animowany PNG w obszarze narzędzia.
2. Kliknij **Utwórz GIF**, aby przekonwertować klatki w oryginalnych wymiarach.
3. Kliknij **Odtwórz**, aby obejrzeć wynik, a następnie **Pobierz GIF**, aby go zapisać.

### Co dzieje się z czasem wyświetlania klatek i liczbą odtworzeń?

Czas wyświetlania każdej klatki jest zaokrąglany do jednostek GIF-u po 10 ms,
przy minimalnym czasie odtwarzania wynoszącym 20 ms na klatkę. Na przykład po
klatce trwającej 100 ms nadal nastąpi klatka trwająca 250 ms. GIF zachowuje
liczbę odtworzeń źródła, od pojedynczego odtworzenia po pętlę bez końca.
W przypadku animacji ze skończoną liczbą odtworzeń GIF obsługuje ich do 65 536.

### Jak GIF zapisuje przezroczystość i kolory?

APNG obsługuje częściową przezroczystość i pełną gamę kolorów. GIF używa
indeksowanej palety do 256 pozycji na klatkę z jedną pozycją dla przezroczystości.
Miękkie krawędzie i cienie mogą wyglądać ostrzej, a na gładkich gradientach mogą
pojawić się pasma. Przed udostępnieniem sprawdź podgląd GIF-u. Jeśli docelowa
aplikacja obsługuje animowane PNG, plik źródłowy zachowa pełną gamę kolorów
i częściową przezroczystość.

### Często zadawane pytania

#### Czy mogę przekonwertować zwykły plik PNG?

Narzędzie wymaga danych animacji PNG. Animowany plik także może mieć rozszerzenie
`.png`. Jeśli animacja zawiera osobny obraz zastępczy dla przeglądarek
wyświetlających statyczne PNG, GIF rozpocznie się od pierwszej klatki animacji.

#### Czy GIF będzie mniejszy od APNG?

Rozmiar pliku zależy od wymiarów obrazu, liczby klatek i ilości szczegółów.
GIF może być większy, zwłaszcza gdy źródłowy APNG zapisuje tylko małe obszary
zmieniające się między klatkami. Rozmiar pliku wynikowego jest podany przy
podglądzie GIF-u.

### Powiązane narzędzia do animacji

Do konwersji w drugą stronę użyj [Konwertera GIF na APNG](/pl/tools/gif-to-apng-converter/).
Jeśli masz plik WebP, użyj [Konwertera animowanego WebP na GIF](/pl/tools/animated-webp-to-gif-converter/).

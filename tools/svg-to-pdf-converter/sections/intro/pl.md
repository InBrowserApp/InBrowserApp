## Jak przekonwertować SVG na PDF?

1. Przeciągnij plik `.svg` do konwertera lub kliknij **Wybierz SVG**. Kliknij **Wczytaj przykład**, aby sprawdzić, jak działa eksport.
2. Sprawdź podgląd SVG. Pozostaw opcję **Oryginalne wymiary SVG**, jeśli strona ma mieć wymiary obszaru roboczego logo, ikony lub ilustracji. Wybierz **A4** lub **US Letter**, jeśli potrzebujesz standardowego formatu papieru.
3. Kliknij **Pobierz PDF**, aby zapisać jednostronicowy PDF pod nazwą pliku SVG z rozszerzeniem .pdf. Konwersja odbywa się w przeglądarce, a plik SVG pozostaje na urządzeniu.

## Które elementy pozostają wektorowe w PDF?

Ścieżki, kształty, wypełnienia i obrysy są zapisywane bezpośrednio w PDF. Dzięki temu logo, schematy i rysunki liniowe pozostają ostre przy powiększaniu i na wydruku. Obsługiwane osadzone obrazy rastrowe, na przykład zdjęcia PNG, zachowują oryginalną rozdzielczość. Przed udostępnieniem PDF powiększ widok, aby szybko sprawdzić cienkie linie i krzywe.

## Jak konwerter ustala format strony PDF?

Opcja **Oryginalne wymiary SVG** korzysta z wymiarów obszaru roboczego SVG lub odczytuje je z atrybutu `viewBox`. Konwersja wykorzystuje standardowy przelicznik 96 pikseli SVG na cal. Przykładowo SVG o wymiarach 960 × 480 px daje stronę PDF o wymiarach 10 × 5 cali. Formaty **A4** i **US Letter** umieszczają grafikę pośrodku strony z marginesami, zachowują jej proporcje i dobierają orientację strony do grafiki.

## Dlaczego PDF wygląda inaczej niż podgląd SVG?

Podgląd korzysta z mechanizmu renderowania SVG w przeglądarce. Mechanizm tworzenia PDF obsługuje typowe elementy wektorowe, ale niestandardowe czcionki, filtry, maski i efekty mogą wyglądać inaczej lub zostać pominięte. Zasoby zewnętrzne są pomijane. Aby uzyskać przewidywalny wygląd tekstu i kolorów, zamień tekst na krzywe w edytorze graficznym, osadź obrazy PNG lub JPEG i uprość złożone efekty. Sprawdź pobrany PDF przed drukowaniem.

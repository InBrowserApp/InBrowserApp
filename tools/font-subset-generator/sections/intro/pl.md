## Czym jest podzbiór fontu?

Podzbiór fontu zawiera znaki potrzebne do określonego tekstu oraz pomocnicze
glify niezbędne do ich wyświetlenia. Usunięcie nieużywanych glifów może znacznie
zmniejszyć rozmiar pobieranych fontów, szczególnie dużych fontów chińskich,
japońskich i koreańskich lub fontów używanych w stałym nagłówku, logo czy na
stronie kampanii.

## Jak korzystać z tego narzędzia

Wybierz plik TTF, OTF, WOFF lub WOFF2 i wklej cały tekst, który będzie z niego
korzystać. Wybierz WOFF2 do udostępniania w internecie lub TTF / OTF, aby uzyskać
font bez kompresji, a następnie utwórz podzbiór. Porównaj rozmiary, sprawdź
podgląd i pobierz font wraz z pasującym plikiem CSS. Przetwarzanie fontu odbywa
się lokalnie w Web Workerze.

## Co zostaje zachowane?

HarfBuzz zachowuje zależności glifów i funkcje składu OpenType potrzebne do
ligatur, kerningu, znaków łączących i złożonych systemów pisma. Hinting i osie
fontów zmiennych pozostają zachowane. Kanonicznie równoważne złożone i rozłożone
formy tekstu są uwzględniane, jeśli font źródłowy je obsługuje. Podgląd korzysta
z utworzonego fontu, a znaki nieobecne w foncie źródłowym są wymienione osobno.

## Praktyczne wskazówki

- Uwzględnij spacje, znaki interpunkcyjne, cyfry i wszystkie potrzebne
  przetłumaczone teksty. Dodaj zestaw znaków łacińskich, jeśli tekst będzie
  zawierał także podstawowe znaki łacińskie.
- Twórz podzbiór ponownie po każdej zmianie tekstu. Stały podzbiór najlepiej
  sprawdza się przy znanej treści; do tekstów tworzonych przez użytkowników
  wybierz szerszy zestaw znaków.
- Tworzenie podzbioru nie dodaje znaków, których brakuje w oryginalnym foncie.
  Ustaw w CSS font zastępczy dla znaków spoza podzbioru.
- Używaj fontu, którego licencja zezwala na modyfikacje i osadzanie w witrynach.
  Kolekcje fontów (`.ttc` / `.otc`) trzeba najpierw wyeksportować jako pojedyncze
  fonty.
- Małe fonty lub fonty już ograniczone do podzbioru mogą się nie zmniejszyć.
  WOFF2 zwykle zapewnia najmniejszy rozmiar pobierania w internecie; liczba
  glifów obejmuje również glify pomocnicze.

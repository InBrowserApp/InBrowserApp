## Czym jest AVIF

AVIF to nowoczesny format obrazów, który może zmniejszyć rozmiar pliku przy
zachowaniu dobrej jakości wizualnej. Obsługuje przezroczystość i wysoką
skuteczność kompresji, dlatego często dobrze sprawdza się przy zdjęciach,
obrazach produktów i zasobach webowych, które mają pozostać ostre bez
marnowania przepustowości.

## Dlaczego warto użyć tego konwertera

Użyj tego narzędzia, gdy potrzebujesz mniejszych obrazów gotowych do użycia w
sieci bez wysyłania plików na serwer. Konwertuje obrazy lokalnie w browserze,
pozwala dostosować jakość, szybkość enkodera, tryb bezstratny i skalę wyniku
przed pobraniem. Gdy konwertujesz wiele obrazów, narzędzie przygotowuje też ZIP,
aby łatwo zapisać całą partię.

## Jak to działa

1. Prześlij jeden lub więcej plików obrazów.
2. Wybierz jakość AVIF, szybkość, tryb bezstratny i skalę wyniku.
3. Konwertuj pliki za pomocą mechanizmu worker w browserze.
4. Podejrzyj każdy wynik, pobierz pojedyncze pliki AVIF albo pobierz ZIP.

## Wskazówki dla lepszych wyników

- Użyj wartości jakości około 70-80 dla zdjęć i zrzutów ekranu jako
  praktycznego punktu wyjścia.
- Obniż jakość, gdy rozmiar pliku jest ważniejszy niż drobne szczegóły.
- Niższe wartości szybkości mogą tworzyć mniejsze pliki, ale zajmują więcej
  czasu przy dużych obrazach lub partiach.
- Użyj trybu bezstratnego dla diagramów, zasobów UI albo obrazów, w których
  dokładne kolory mają znaczenie.
- Zachowaj skalę 100% przy konwersji samego formatu albo zmniejsz ją, gdy obraz
  będzie wyświetlany na stronie w mniejszym rozmiarze.
- Porównaj rozmiary pliku oryginalnego i wynikowego, ponieważ niektóre bardzo
  małe albo już skompresowane obrazy mogą nie zmniejszyć się po kodowaniu AVIF.

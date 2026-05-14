## What this tool does

Ten SVG optimizer kompresuje jeden lokalny plik SVG albo wklejony dokument SVG w
Twojej przeglądarce. Używa przebiegów czyszczenia SVGO, aby usuwać komentarze,
metadane, nadmiarowe atrybuty, zbędną precyzję i inne znaczniki, które nie
zmieniają widocznego obrazu.

## Why it helps

Pliki SVG eksportowane z narzędzi projektowych często zawierają metadane
edytora, rozwlekłe ścieżki, nieużywane ID i komentarze. Ich optymalizacja może
zmniejszyć rozmiar pobierania, przyspieszyć ładowanie strony i ułatwić przegląd
kodu SVG inline przed użyciem go w witrynie, aplikacji, e-mailu albo stronie
dokumentacji.

## How it works

Prześlij plik `.svg` albo wklej znaczniki SVG, wybierz bezpieczny preset lub
dostosuj pojedyncze przebiegi SVGO, a następnie uruchom optymalizację. Narzędzie
pokazuje oryginalny i zoptymalizowany podgląd, oszczędność bajtów oraz końcowe
znaczniki, aby można było je skopiować albo pobrać plik `.optimized.svg`. SVG
nigdy nie musi opuszczać Twojego urządzenia.

## Practical notes

- Zachowaj bezpieczny preset, gdy SVG zależy od zewnętrznego CSS, skryptowych ID
  albo odwołań do symboli, których nie możesz łatwo sprawdzić.
- Używaj agresywnego presetu dla prostych eksportowanych ikon, logo i ilustracji,
  gdzie usunięcie wymiarów oraz wstawienie stylów inline jest akceptowalne.
- Podejrzyj zoptymalizowany obraz przed zastąpieniem grafiki źródłowej,
  szczególnie gdy źródło używa masek, gradientów, filtrów albo połączonych
  zasobów.

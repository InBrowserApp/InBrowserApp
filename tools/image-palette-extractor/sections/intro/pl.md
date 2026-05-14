## Co robi to narzędzie

Image Palette Extractor znajduje dominujące kolory na obrazie bezpośrednio w
przeglądarce. Próbkuje obraz, grupuje wizualnie podobne piksele i zwraca
praktyczną paletę z wartościami HEX, RGB, HSL oraz procentowym udziałem każdego
koloru.

## Dobre zastosowania

- Wyciąganie kolorów marki lub produktu ze zrzutu ekranu, logo, zdjęcia albo
  makiety.
- Szybkie przygotowanie palety CSS dla strony docelowej, miniatury lub
  przekazania projektu.
- Porównanie, jaka część obrazu opiera się na jednym dominującym kolorze, a
  jaka na akcentach uzupełniających.
- Praca z prywatnymi obrazami bez wysyłania pliku na serwer.

## Opcje eksportu

Wynik można skopiować jako zwykłą listę HEX, właściwości niestandardowe CSS
albo JSON. Format CSS przydaje się, gdy chcesz używać zmiennych takich jak
`--palette-1`, a JSON zachowuje formaty kolorów i współczynnik dominacji razem
na potrzeby skryptów lub automatyzacji projektowej.

## Na co uważać

- Wyodrębnianie palety jest przybliżone. Ma tworzyć użyteczne grupy wizualne,
  a nie pełny spis każdego koloru piksela.
- Przezroczyste piksele są domyślnie ignorowane, żeby ikony i wycięcia nie
  zaburzały palety; wyłącz to, gdy sama przezroczystość jest częścią grafiki.
- Ustawienie precyzyjnej jakości próbkuje więcej pikseli i może być wolniejsze
  przy bardzo dużych obrazach.

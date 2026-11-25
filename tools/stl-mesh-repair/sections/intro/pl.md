## Naprawianie pliku STL online

Wybierz **Otwórz plik** lub przeciągnij plik `.stl` w formacie ASCII lub binarnym do narzędzia. Naprawa odbywa się na Twoim urządzeniu. Kliknij **Wypróbuj przykład**, aby obejrzeć małą siatkę z powielonymi ścianami, ścianami o zerowym polu i odwróconymi ścianami. Porównaj wyniki i kliknij **Pobierz STL**, aby zapisać nowy plik z tym samym rozmiarem i współrzędnymi. Narzędzie zapisze plik w formacie ASCII, jeśli binarny STL zaokrągliłby oryginalne współrzędne.

## Co zmienia naprawa siatki

Narzędzie usuwa dokładnie powielone trójkąty oraz trójkąty o zerowym polu. Porównuje orientację sąsiednich ścian. Gdy możliwe są dwie spójne orientacje, wybiera tę, która wymaga odwrócenia mniejszej liczby ścian. Wierzchołki zachowują swoje położenie. Otwarte brzegi, niejednoznaczna orientacja ścian i połączenia non-manifold mogą wymagać ręcznej naprawy. Otwory, niemal pokrywające się wierzchołki i przecięcia pozostają w siatce. [Typowe problemy z siatką podczas druku 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Porównywanie topologii przed naprawą i po niej

Sprawdź liczbę trójkątów, powielonych ścian oraz zdegenerowanych ścian. Raport pokazuje także pozostałe krawędzie o niespójnej orientacji ścian, otwarte brzegi oraz krawędzie i wierzchołki non-manifold. Otwórz pobrany plik w [przeglądarce plików STL](../stl-viewer/), aby obejrzeć go w 3D. Pole powierzchni lub objętość wewnątrz siatki możesz sprawdzić w narzędziu [Analiza objętości i topologii siatki](../mesh-inspector/). W raporcie STL pojawia się opcja **Napraw STL**, jeśli analiza wykryje powielone lub zdegenerowane ściany albo niespójną orientację ścian.

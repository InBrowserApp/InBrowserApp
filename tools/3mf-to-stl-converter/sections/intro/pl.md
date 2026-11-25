## Konwertowanie pliku 3MF na STL

Wybierz **Otwórz plik** lub przeciągnij plik `.3mf` do konwertera. Narzędzie odczytuje model na Twoim urządzeniu i tworzy binarny plik STL. Kliknij **Wypróbuj przykład**, aby użyć układu wydruku z dwoma kolorowymi wspornikami. Następnie kliknij **Pobierz STL**, aby zapisać wynik.

## Zachowanie wymiarów i rozmieszczenia na stole drukarki

Konwerter zapisuje współrzędne siatki w milimetrach. Części zachowują położenie względem siebie na stole drukarki, również gdy ten sam element umieszczono na nim kilka razy. Część o wymiarze jednego cala w pliku 3MF ma 25,4 jednostki współrzędnych w pliku STL. Jeśli program prosi o jednostkę podczas importowania STL, wybierz milimetry.

## Sprawdzanie zawartości pliku STL

Plik STL zawiera trójkąty tworzące powierzchnię. Zachowaj oryginalny plik 3MF, jeśli potrzebujesz kolorów, materiałów lub ustawień wydruku. Otwórz wynik w [przeglądarce plików STL](../stl-viewer/) lub obejrzyj plik źródłowy w [przeglądarce plików 3MF](../3mf-viewer/). Gdy w kolejnym kroku potrzebujesz pakietu modelu 3MF, użyj [konwertera STL na 3MF](../stl-to-3mf-converter/). [Informacje o formacie 3MF](https://3mf.io/resources/faq/)

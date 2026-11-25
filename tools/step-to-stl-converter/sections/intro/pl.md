## Konwertowanie pliku STEP lub STP na STL

Wybierz **Otwórz plik** lub upuść plik `.step` lub `.stp` w konwerterze. Narzędzie dzieli powierzchnie CAD na trójkąty na Twoim urządzeniu i przygotowuje do pobrania binarny plik STL. Kliknij **Wypróbuj przykład**, aby przekonwertować wspornik montażowy, a następnie **Pobierz STL**, aby zapisać wynik.

## Zachowanie właściwych wymiarów do druku 3D

Pliki STEP zawierają wymiary fizyczne. Konwerter eksportuje współrzędne w milimetrach i uwzględnia położenie poszczególnych części w zespole. Format STL nie zapisuje jednostki miary. Wybierz milimetry, gdy otwierasz wynik w programie do przygotowywania wydruku. Przykładowo krawędź o długości jednego cala w pliku STEP ma w pliku STL długość 25,4 jednostki współrzędnych.

## Sprawdzanie wyeksportowanej siatki

Plik STL zawiera powierzchnie części podzielone na trójkąty i rozmieszczone zgodnie z ich położeniem w zespole. Użyj pliku STEP, jeśli potrzebujesz edytowalnych powierzchni CAD, nazw części lub struktury zespołu. Obejrzyj plik w [przeglądarce plików STL](../stl-viewer/) albo sprawdź objętość wewnątrz siatki i jej topologię za pomocą narzędzia [Analiza objętości i topologii siatki](../mesh-inspector/).

## Oglądanie lub eksport oryginalnego modelu

Użyj [przeglądarki plików STEP](../step-viewer/), aby sprawdzić wymiary, obrócić model CAD i wyeksportować go do formatu STL bezpośrednio z paska narzędzi. Jeśli Twój program do przygotowywania wydruku obsługuje import STEP, otwórz oryginał i wybierz w nim ustawienia siatki. [Formaty obsługiwane przez PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)

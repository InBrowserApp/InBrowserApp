## Konwertowanie modelu glTF na jeden plik GLB

Wybierz **Otwórz pliki**, aby zaznaczyć model `.gltf` razem z jego buforami `.bin` i teksturami. Jeśli tekstury są w podfolderach, użyj opcji **Otwórz folder**, aby konwerter mógł odczytać je ze ścieżek zapisanych w modelu. Możesz również otworzyć pliki glTF z już osadzonymi danymi. Wybierz **Wypróbuj przykład**, aby spakować animowaną piramidę, a następnie **Pobierz GLB**. Pliki są przetwarzane w przeglądarce.

## Dodawanie brakującego bufora lub tekstury

Plik `.gltf` w formacie JSON może wskazywać zasoby, takie jak `model.bin` lub `textures/albedo.png`. Konwerter wyświetla ścieżki do brakujących zasobów. Wybierz **Dodaj pliki**, aby uzupełnić brakujące zasoby bez zamykania modelu. Zachowaj oryginalne nazwy plików. Jeśli w różnych folderach znajdują się pliki o tych samych nazwach, wybierz folder zawierający model i powiązane z nim pliki, aby konwerter mógł je odróżnić na podstawie ścieżek.

## Udostępnianie i sprawdzanie pliku GLB

Plik GLB zawiera osadzoną geometrię, obsługiwane tekstury i inne standardowe dane, do których odwołuje się model. Siatki, materiały i klipy animacji zostają zachowane. Pakowanie zachowuje oryginalne kodowanie tekstur i kompresję siatki, więc docelowy program musi obsługiwać te formaty. Tekstury PNG i JPEG działają w największej liczbie programów obsługujących glTF. Otwórz sam pobrany plik w [przeglądarce plików GLB i glTF](../gltf-viewer/), aby sprawdzić wymiary, materiały i animację modelu. [Format plików glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)

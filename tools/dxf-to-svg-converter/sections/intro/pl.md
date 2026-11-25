## Konwertowanie rysunku DXF na SVG

Wybierz **Otwórz plik DXF** lub upuść rysunek `.dxf` w formacie ASCII. Kliknij **Wypróbuj przykład**, aby wczytać wspornik z profilem, otworami wierconymi, liniami osiowymi i opisami. Narzędzie odczytuje rysunek w przeglądarce i wyświetla podgląd wektorowy. Kliknij **Pobierz SVG**, aby zapisać wybraną geometrię z obszaru modelu jako samodzielny plik SVG.

## Wybór warstw do wyeksportowania

W sekcji **Warstwy** zaznacz warstwy do wyeksportowania. Podgląd aktualizuje się, gdy zaznaczysz lub odznaczysz warstwę. Możesz na przykład wyeksportować obrys i otwory do ilustracji albo dołączyć linie osiowe i opisy, aby uzyskać widok z adnotacjami. Plik SVG zachowuje wybrane warstwy jako osobne grupy wektorowe.

## Zachowanie skali rysunku

Jeśli w pliku DXF podano jednostkę długości, taką jak milimetry lub cale, plik SVG zapisuje wymiary fizyczne w milimetrach. Geometria zachowuje w pliku swoją pierwotną skalę. W przypadku rysunków DXF bez jednostki atrybut viewBox pliku SVG korzysta ze współrzędnych rysunku. Podgląd dopasowuje się do dostępnego miejsca na ekranie. [Zmienne nagłówka DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Eksport geometrii z obszaru modelu

Konwerter eksportuje obsługiwane linie, polilinie, łuki, okręgi, bloki i tekst. Krzywe są rysowane za pomocą odcinków wektorowych, a obsługiwany tekst jest zamieniany na kontury wektorowe przy użyciu dostępnych czcionek. Jeśli korzystasz z arkusza układu, przenieś geometrię do obszaru modelu przed wyeksportowaniem DXF. W [przeglądarce plików DXF](../dxf-viewer/) możesz przesuwać i powiększać widok oraz włączać i wyłączać widoczność warstw.

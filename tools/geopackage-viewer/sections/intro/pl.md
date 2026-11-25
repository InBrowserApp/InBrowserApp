## Jak otworzyć plik GeoPackage

Wybierz lub przeciągnij plik .gpkg, a następnie przełączaj jego zawartość w polu **Warstwa lub tabela**. Wybierz **Wypróbuj przykład**, aby otworzyć pakiet z warstwą punktową i warstwą poligonową. Plik GeoPackage jest otwierany lokalnie na urządzeniu. Po wczytaniu strony wbudowana mapa działa offline i nie pobiera kafli z internetu.

## Przeglądanie warstw wektorowych i atrybutów

Mapa dopasowuje widok do wybranej warstwy wektorowej. Kliknij punkt, linię lub poligon albo wybierz pozycję z listy **Obiekty**, aby zobaczyć atrybuty. Jeśli warstwa ma obsługiwany układ odniesienia współrzędnych, przeglądarka umieszcza jej obiekty na mapie w WGS 84. Możesz też wybrać tabelę bez geometrii i przeglądać poszczególne rekordy. Aby mapa pozostała responsywna również przy dużych plikach, podgląd pokazuje do 500 rekordów na warstwę.

## Co zawiera plik GeoPackage?

GeoPackage to format OGC umożliwiający przechowywanie danych przestrzennych w jednym pliku SQLite. Pakiet może zawierać kilka warstw wektorowych, zwykłe tabele atrybutów oraz tabele kafli. Pozycje z kaflami pojawiają się na liście warstw. Aby zobaczyć geometrię na mapie, wybierz warstwę wektorową. Jeśli masz plik Esri Shapefile i osobne pliki towarzyszące, otwórz je narzędziem [Przeglądarka Shapefile](../shapefile-viewer/).

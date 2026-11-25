## Jak przekonwertować GPX na GeoJSON

Otwórz plik .gpx lub wklej GPX w formacie XML i wybierz **Konwertuj na GeoJSON**. Wybierz **Wypróbuj przykład**, aby zobaczyć w wyniku ślad, trasę i punkt trasy. Skopiuj GeoJSON lub pobierz plik .geojson do tworzenia map lub pracy w GIS. Konwersja odbywa się w przeglądarce, a dane wejściowe pozostają na urządzeniu.

## Jak konwertowane są ślady, trasy i punkty trasy

Wynikiem jest kolekcja obiektów GeoJSON typu FeatureCollection. Punkty trasy otrzymują geometrię punktową, a trasy geometrię liniową. Jeśli ślad składa się z kilku ciągłych segmentów, pozostają one rozdzielone. Segment lub trasa z jedną zapisaną pozycją staje się punktem. Pola opisowe, takie jak nazwy i notatki, pozostają przypisane do odpowiednich obiektów.

## Współrzędne, wysokość i czas

GeoJSON zapisuje najpierw długość, a następnie szerokość geograficzną. Linie przecinające południk 180° są dzielone w miejscu przecięcia, aby poprawnie wyświetlały się na mapach świata. Jeśli dostępna jest wysokość, staje się trzecią wartością współrzędnych i jest podana w metrach. Czasy punktów są zapisywane w atrybutach obiektów. Czasy kolejnych punktów trasy lub segmentu śladu zachowują kolejność współrzędnych, dzięki czemu można je przypisać do odpowiednich pozycji. Wynik otworzysz narzędziem [Przeglądarka GeoJSON](../geojson-viewer/), a oryginalny plik GPX możesz obejrzeć w narzędziu [Przeglądarka GPX z profilem wysokościowym](../gpx-viewer/).

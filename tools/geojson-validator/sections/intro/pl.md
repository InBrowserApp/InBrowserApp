## Jak sprawdzić plik GeoJSON

Otwórz plik .geojson lub .json albo wklej dokument GeoJSON i wybierz **Sprawdź GeoJSON**. Użyj przycisku **Wypróbuj przykład**, aby zobaczyć poprawną kolekcję FeatureCollection. Możesz edytować dane i sprawdzić je ponownie. Pliki i wklejony tekst pozostają w przeglądarce.

## Co sprawdza walidator

Narzędzie najpierw sprawdza składnię JSON, a następnie strukturę GeoJSON, w tym FeatureCollection, Feature, GeometryCollection i poszczególne typy geometrii. Pozycje używają współrzędnych WGS 84 w kolejności długość, szerokość geograficzna. Walidator sprawdza zakresy współrzędnych, minimalną liczbę pozycji w liniach i pierścieniach, domknięcie pierścieni, atrybuty obiektów i budowę obwiedni. Pusta kolekcja obiektów i geometria obiektu o wartości null są poprawne.

## Jak znaleźć i poprawić błąd

Ścieżka błędu, na przykład `$.features[0].geometry.coordinates`, wskazuje współrzędne pierwszego obiektu. Znajdź wskazane pole, wprowadź poprawkę i sprawdź dane ponownie. Wynik dotyczy struktury pliku. Topologię geometrii, na przykład samoprzecięcia i nakładanie się obiektów, sprawdza się osobno w GIS. Otwórz poprawny wynik narzędziem [Przeglądarka GeoJSON](../geojson-viewer/), aby obejrzeć go na mapie.

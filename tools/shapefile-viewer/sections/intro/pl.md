## Jak otworzyć plik Shapefile

Przeciągnij archiwum ZIP z danymi Esri Shapefile do przeglądarki. Możesz też wybrać plik .shp razem z plikami towarzyszącymi. Jeśli archiwum zawiera kilka zestawów Shapefile, przełączaj się między nimi w polu **Warstwa**. Wybierz **Wypróbuj przykład**, aby obejrzeć przykładowy zbiór z dwiema warstwami, punktową i poligonową. Przeglądarka odczytuje pliki lokalnie na tym urządzeniu.

## Jakich plików Shapefile potrzebujesz?

Plik .shp zawiera geometrię i wystarczy do wyświetlenia warstwy zapisanej we współrzędnych geograficznych. Jeśli masz pozostałe pliki, dołącz .dbf z atrybutami, .prj z definicją układu odniesienia współrzędnych i .cpg określający kodowanie tekstu w atrybutach. Pliki z tej samej warstwy przechowuj razem pod tą samą nazwą, z odpowiednimi rozszerzeniami. Plik indeksu .shx możesz zostawić w ZIP-ie albo uwzględnić przy wybieraniu plików.

## Przeglądanie mapy i atrybutów

Mapa offline dopasowuje widok do bieżącej warstwy. Możesz zmienić powiększenie lub wrócić do widoku całej warstwy za pomocą przycisków na mapie. Wybierz geometrię na mapie albo pozycję z listy **Obiekty**, aby zobaczyć atrybuty. Jeśli podasz obsługiwany plik .prj, przeglądarka przeliczy współrzędne z układu odwzorowanego. Gdy brakuje takiego pliku, współrzędne mieszczące się w zakresie długości i szerokości geograficznej są interpretowane jako WGS 84. Jeśli warstwa korzysta z układu odwzorowanego, otwórz ją ponownie z plikiem .prj, aby pojawiła się we właściwym miejscu.

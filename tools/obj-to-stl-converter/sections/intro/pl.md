## Konwertowanie pliku Wavefront OBJ na STL

Wybierz **Otwórz plik** lub upuść plik `.obj` w konwerterze. Kliknij **Wypróbuj przykład**, aby najpierw przekonwertować mały wspornik montażowy. Narzędzie dzieli wielokątne ściany na trójkąty. Następnie kliknij **Pobierz STL**, aby zapisać binarny plik `.stl`. Konwersja odbywa się na Twoim urządzeniu.

## Zmiany podczas eksportu do STL

STL zapisuje powierzchnię złożoną z trójkątów. Materiały, obrazy tekstur, współrzędne UV oraz samodzielne linie i punkty są pomijane. Oryginalne współrzędne i osie zostają zachowane. Przed drukowaniem wybierz właściwą jednostkę w programie do przygotowywania wydruku. Przykładowo wymiar wynoszący 40 jednostek współrzędnych w pliku OBJ ma taką samą wartość w pliku STL.

Konwersja może się udać nawet wtedy, gdy siatka ma otwory lub inne problemy geometryczne. Przed drukowaniem sprawdź wynik w programie do przygotowywania wydruku.

## Podgląd wyniku i konwersja w drugą stronę

Pobrany plik otworzysz w [przeglądarce plików STL](../stl-viewer/). Oryginał wraz z dołączonymi materiałami możesz obejrzeć w [przeglądarce plików OBJ](../obj-viewer/). Aby przekonwertować plik w drugą stronę, użyj [konwertera STL na OBJ](../stl-to-obj-converter/).

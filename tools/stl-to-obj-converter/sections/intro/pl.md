## Konwertowanie pliku STL na Wavefront OBJ

Wybierz **Otwórz plik** lub upuść plik `.stl` w konwerterze. Narzędzie odczytuje pliki STL w formacie ASCII i binarnym oraz przygotowuje plik `.obj` do pobrania w przeglądarce. Kliknij **Wypróbuj przykład**, aby najpierw przekonwertować mały wspornik montażowy. Następnie kliknij **Pobierz OBJ**, aby zapisać plik.

## Sprawdzanie zawartości pliku OBJ

Konwerter zapisuje trójkąty oryginalnej powierzchni w pliku Wavefront OBJ. Zachowuje osie współrzędnych i rozmiar siatki. Format STL nie definiuje jednostki miary. Krawędź o długości 40 jednostek w pliku źródłowym nadal ma 40 jednostek współrzędnych w pliku OBJ. Wybierz właściwą jednostkę podczas importowania pliku do innego programu.

Pobrany plik zawiera geometrię siatki. Biblioteki materiałów i tekstury wykraczają poza standardowy opis powierzchni STL i dlatego nie trafiają do wyniku.

## Podgląd wyniku i konwersja w drugą stronę

Aby sprawdzić wynik, otwórz pobrany plik w [przeglądarce plików OBJ](../obj-viewer/). Plik źródłowy możesz otworzyć w [przeglądarce plików STL](../stl-viewer/). Aby przekonwertować plik w drugą stronę, użyj [konwertera OBJ na STL](../obj-to-stl-converter/).

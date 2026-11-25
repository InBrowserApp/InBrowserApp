## Konwertowanie pliku STL na 3MF

W polu **Jednostka współrzędnych STL** wybierz jednostkę, a następnie kliknij **Otwórz plik** lub przeciągnij plik `.stl` do konwertera. Narzędzie obsługuje pliki STL w formacie ASCII i binarnym. Kliknij **Wypróbuj przykład**, aby przekonwertować wspornik montażowy, a potem **Pobierz 3MF**, aby zapisać model. Zmiana jednostki powoduje ponowną konwersję bieżącego pliku.

## Wybór właściwego rozmiaru w programie do druku

STL zapisuje współrzędne bez jednostki miary. Wybierz jednostkę użytą w pliku źródłowym. Na przykład część o szerokości 2 jednostek współrzędnych STL ma 2 cale szerokości, jeśli wybierzesz cale, lub 2 milimetry, jeśli wybierzesz milimetry. Plik 3MF zapisuje jednostkę wprost, dzięki czemu zgodny program do przygotowywania wydruku odczyta model w zamierzonym rozmiarze.

## Sprawdzanie modelu 3MF lub konwersja w drugą stronę

Plik 3MF zawiera oryginalne trójkąty. Konwerter zapisuje siatkę jako bryłę tylko wtedy, gdy każda powłoka jest zamknięta, a jej ściany są skierowane na zewnątrz. Siatki otwarte, niespójne lub zawierające powłoki skierowane do wewnątrz są zapisywane jako powierzchnie. Dotyczy to także ścian zamkniętych pustek wewnętrznych. Materiały i ustawienia wydruku wybierasz w programie do przygotowywania wydruku. Sprawdź wymiary w [przeglądarce plików 3MF](../3mf-viewer/) lub obejrzyj oryginał w [przeglądarce plików STL](../stl-viewer/). Jeśli siatka źródłowa ma otwory lub inne usterki topologii, użyj narzędzia [Analiza objętości i topologii siatki](../mesh-inspector/). Do konwersji w drugą stronę użyj [konwertera 3MF na STL](../3mf-to-stl-converter/). [Informacje o formacie 3MF](https://3mf.io/resources/faq/)

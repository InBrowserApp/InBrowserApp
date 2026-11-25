## Otwieranie pliku STL online

Przeciągnij plik `.stl` do przeglądarki plików albo wybierz go z urządzenia. Zarówno pliki STL w formacie ASCII, jak i pliki binarne otwierają się w przeglądarce internetowej. Model pozostaje na Twoim urządzeniu. Kliknij **Wypróbuj przykład**, aby najpierw obejrzeć mały wspornik montażowy.

## Sprawdzanie modelu 3D przed drukiem

Przeciągnij, aby obrócić model. Użyj kółka myszy lub gestu zbliżania i rozsuwania palców, aby zmienić powiększenie. Przeciągnij prawym przyciskiem myszy lub dwoma palcami, aby przesunąć widok. Użyj opcji **Pokaż cały model**, aby przywrócić pełny widok. Włącz opcję **Siatka**, aby zobaczyć trójkąty tworzące powierzchnię. W ten sposób sprawdzisz, jak drobny jest podział zakrzywionej powierzchni po eksporcie.

Wymiary całkowite podają pełną rozpiętość modelu wzdłuż osi X, Y i Z. STL zapisuje współrzędne bez jednostki miary. Wartość 40 może więc oznaczać 40 mm lub 40 cali zależnie od ustawień eksportu. Sprawdź jednostkę podczas importowania modelu do programu przygotowującego wydruk.

## Otwieranie innych formatów 3D

STL opisuje powierzchnię części za pomocą trójkątów. Do pliku Wavefront z powiązaną biblioteką materiałów użyj [przeglądarki plików OBJ](../obj-viewer/). Plik wymiany CAD z zespołem lub modelem bryłowym otworzysz w [przeglądarce plików STEP](../step-viewer/).

- [Przeglądarka plików GLB i glTF](../gltf-viewer/)

- [Przeglądarka plików 3MF](../3mf-viewer/)
- [Konwerter STL na OBJ](../stl-to-obj-converter/)
- [Analiza objętości i topologii siatki](../mesh-inspector/)

Użyj [konwertera STEP na STL](../step-to-stl-converter/), aby wyeksportować siatkę trójkątów z oryginalnego modelu CAD w formacie STEP lub STP.

Użyj [konwertera STL na 3MF](../stl-to-3mf-converter/), aby zapisać jednostkę miary modelu w pliku 3MF.

Użyj narzędzia [Naprawa siatki STL](../stl-mesh-repair/), aby usunąć powielone ściany i ściany o zerowym polu, skorygować jednoznaczne błędy orientacji oraz sprawdzić, co jeszcze wymaga naprawy.

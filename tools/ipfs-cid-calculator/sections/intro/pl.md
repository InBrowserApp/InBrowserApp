## Jak obliczyć CID pliku lub folderu

Wybierz plik lub folder na urządzeniu, a następnie kliknij **Oblicz CID**. Skopiuj identyfikator treści (CID), aby zapisać go w manifeście lub porównać z wynikiem wcześniejszego importu do IPFS. Obliczenia odbywają się w przeglądarce. Pliki pozostają na Twoim urządzeniu.

## Dlaczego ten sam plik może mieć różne identyfikatory CID w IPFS?

IPFS może podzielić plik na bloki i zapisać powiązania między nimi w formacie UnixFS. Główny CID zależy od sposobu podziału, kodowania i ułożenia bloków. Aby odtworzyć CID, użyj tego samego rozmiaru fragmentów, ustawienia bloków liściowych i struktury folderów co przy pierwszym imporcie. Na CID folderu wpływają również nazwy plików i podfolderów. Przeglądarka pomija puste podfoldery podczas wyboru folderu.

## Jak odtworzyć CID za pomocą Kubo

Otwórz **Ustawienia importu**, aby zmienić wersję CID, rozmiar fragmentu, format bloków liściowych lub sposób umieszczania plików w folderze. Domyślną wersją jest CIDv1. Wybierz CIDv0, jeśli w tej wersji powstał identyfikator przy wcześniejszym imporcie. Opcja **Umieść w folderze** dodaje folder nadrzędny, dzięki czemu możesz odwołać się do pliku po nazwie w ścieżce pod głównym CID.

Skopiuj wyświetlone polecenie `ipfs add --only-hash`, aby ponownie wykonać obliczenie w Kubo dla tego samego pliku lub folderu. Jeśli masz CID z wcześniejszego importu, wklej go w polu porównania. Równoważne identyfikatory CIDv0 i CIDv1 są zgodne, ponieważ wskazują ten sam blok. [Dokumentacja IPFS dotycząca identyfikatorów treści](https://docs.ipfs.tech/concepts/content-addressing/)

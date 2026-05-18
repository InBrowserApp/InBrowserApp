Usuń ograniczenia hasła właściciela z pliku PDF bezpośrednio w przeglądarce. Narzędzie tworzy nowy PDF, który nie zawiera już flag uprawnień blokujących edycję, drukowanie, kopiowanie ani wyodrębnianie stron.

## Kiedy go używać

Użyj go, gdy masz już PDF, który otwiera się normalnie, ale dokument blokuje zwykłe działania, takie jak drukowanie, kopiowanie tekstu, edycja stron lub łączenie stron w innym narzędziu PDF. Jest to częste w formularzach, wyeksportowanych raportach, starych fakturach i dokumentach utworzonych z restrykcyjnymi ustawieniami uprawnień PDF.

## Jak to działa

Wczytaj jeden PDF, sprawdź wybrany plik, a następnie uruchom krok usuwania. Narzędzie uruchamia qpdf w wątku roboczym przeglądarki z operacją PDF `--decrypt` i zwraca nowy plik PDF do pobrania. Oryginalny plik pozostaje bez zmian, więc możesz porównać albo odrzucić wynik, jeśli nie jest to wersja, której potrzebujesz.

## Prywatność i ograniczenia

PDF pozostaje w tej sesji przeglądarki; nie jest przesyłany na serwer. To narzędzie usuwa ograniczenia uprawnień hasła właściciela z plików PDF, które można już otworzyć. Nie odzyskuje utraconego hasła użytkownika/otwarcia i nie może odblokować uszkodzonych plików ani trybów szyfrowania nieobsługiwanych przez przeglądarkową wersję qpdf.

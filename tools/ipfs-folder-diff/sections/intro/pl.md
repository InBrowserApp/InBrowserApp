## Jak porównać dwa foldery IPFS na podstawie CID

Wklej adres pierwotnej wersji w polu **Wcześniejszy folder**, a adres nowszej wersji w polu **Późniejszy folder**. Następnie kliknij **Porównaj foldery**. W każdym polu możesz podać CID, adres `ipfs://` lub link HTTP do bramy. Podaj ścieżki, aby porównać dwa podfoldery. Otwórz pozycję w wynikach, aby zobaczyć jej identyfikatory CID, przefiltruj listę według ścieżki lub pobierz JSON, aby zapisać porównanie.

## Kiedy ścieżka jest dodana, usunięta lub zmieniona?

Jeśli ścieżka istnieje tylko w jednym folderze, jest oznaczana jako dodana lub usunięta. Podfolder dodany lub usunięty w całości pojawia się jako jedna ścieżka. Jeśli ten sam podfolder występuje w obu wersjach, lecz ma różne identyfikatory CID, narzędzie porównuje ścieżki w jego wnętrzu. Pozycja o zmienionym CID jest oznaczana jako zmieniona. Pliki zaimportowane z innymi ustawieniami podziału na fragmenty lub kodowania mogą mieć różne CID, nawet gdy ich widoczna zawartość jest identyczna.

## Jak porównać wersje w IPFS bez pobierania wszystkich plików

Przeglądarka odczytuje zweryfikowane bloki IPFS z publicznych bram i pomija gałęzie z identycznymi identyfikatorami CID. Dzięki temu możesz porównać wersje strony internetowej, opublikowanego zbioru danych lub kopii zapasowej na podstawie niezmiennych adresów folderów. Do porównania zmienionych odnośników nie trzeba pobierać całych plików. Jeśli któryś element folderu jest niedostępny, wynik wskaże ścieżki, których nie udało się porównać.

Przeczytaj więcej o [adresowaniu według zawartości i wersjach zbiorów danych](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).

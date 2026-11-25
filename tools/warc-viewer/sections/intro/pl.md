## Otwórz archiwum stron WARC

Wybierz lub upuść plik `.warc` albo `.warc.gz`. Możesz też wypróbować przykładowe archiwum. Przeglądarka tworzy listę rekordów i otwiera pierwszą znalezioną stronę HTML. Przefiltruj listę według adresu URL lub typu rekordu, aby znaleźć właściwy zapis, a następnie przełączaj się między podglądem strony i szczegółami rekordu. Indeksowanie dużego archiwum może chwilę potrwać. Plik pozostaje w przeglądarce.

## Sprawdź daty zapisu i nagłówki

Plik w formacie Web ARChive (WARC) zawiera rekordy zebrane podczas wizyty robota indeksującego lub narzędzia do archiwizacji w witrynie. Kilka rekordów może mieć ten sam adres URL. Rozróżnisz je po dacie i godzinie zapisu w UTC oraz pierwotnym statusie HTTP. Rekord odpowiedzi zawiera odpowiedź serwera. Rekord żądania opisuje, co wysłał robot, a rekord ponownej wizyty może odsyłać do innego zapisu bez ponownego zapisywania strony. Rekordy możesz przeglądać także wtedy, gdy nie ma podglądu strony.

## Co zawiera podgląd?

Statyczny podgląd wykorzystuje HTML oraz obsługiwane obrazy i arkusze stylów z tego samego archiwum. Brak zasobów może zmienić układ lub zostawić puste miejsca. Skrypty są wyłączone, a podgląd nie wysyła żądań do oryginalnej witryny. Funkcje interaktywne, takie jak logowanie i odtwarzanie filmów, są więc niedostępne. Przeglądarka obsługuje WARC 1.0 i 1.1, w tym rekordy skompresowane za pomocą gzip.

[Specyfikacja formatu WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)

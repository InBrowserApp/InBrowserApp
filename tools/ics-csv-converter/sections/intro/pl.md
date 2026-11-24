## Wyeksportuj wydarzenia kalendarza z ICS do CSV

Wybierz **ICS na CSV**, otwórz plik iCalendar lub wklej jego zawartość i kliknij **Konwertuj**. Każdy zapis wydarzenia zajmuje jeden wiersz, który zawiera tytuł, początek, koniec, miejsce, opis i ewentualną regułę cykliczności. Pobierz CSV, aby przeglądać lub edytować dane w Excelu albo Arkuszach Google. W przypadku wydarzeń całodniowych w pliku zapisywana jest sama data, a data końcowa nie należy do zakresu wydarzenia. Na przykład dla wydarzenia trwającego 12 maja datą końcową jest 13 maja.

## Utwórz plik ICS z wierszy CSV

Wybierz **CSV na ICS** i użyj opcji **Wypróbuj przykład**, aby zobaczyć nagłówki. Dodaj co najmniej kolumny `Title` i `Start`. Wpisz `2026-05-12` dla wydarzenia całodniowego, `2026-05-12T09:00:00` dla czasu lokalnego lub `2026-05-12T09:00:00Z` dla UTC. Narzędzie rozpoznaje też nagłówki Kalendarza Google, takie jak `Subject`, `Start Date`, `Start Time` i `All Day Event`. Pobierz plik ICS, aby zaimportować wydarzenia do kalendarza.

## Zachowaj oryginalny kalendarz jako pełną kopię zapasową

CSV przechowuje dane wydarzeń w wierszach. Wydarzenia cykliczne zapisuje za pomocą reguł, bez generowania dat poszczególnych wystąpień. Osadzone definicje stref czasowych są zachowywane. Załączniki, przypomnienia, uczestnicy, wyjątki od reguł cykliczności i informacja o odwołaniu pozostają w oryginalnym pliku kalendarza. Konwersja odbywa się w przeglądarce.

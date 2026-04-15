## Do czego służy to narzędzie

Użyj tego konwertera, aby zamienić lokalną datę i godzinę w jednej strefie czasowej IANA na odpowiadający jej czas lokalny w innej strefie. To przydaje się, gdy porównujesz harmonogramy między miastami bez ręcznego dodawania offsetów ani zgadywania, czy obowiązuje czas letni.

## Typowe zastosowania

- Sprawdzenie, czy spotkanie w Tokio wypada tego samego dnia kalendarzowego w Nowym Jorku lub Londynie.
- Weryfikacja offsetów przed publikacją harmonogramów, alertów lub godzin wsparcia.
- Kopiowanie odpowiadających wartości ISO 8601, UTC lub znaczników czasu Unix do logów i API.

## Jak działa ten konwerter

- Wpisz lokalną datę i godzinę w formacie `YYYY-MM-DD HH:mm:ss.SSS` po jednej ze stron, a następnie wybierz źródłową i docelową strefę czasową.
- Strona edytowana jako ostatnia staje się punktem odniesienia. Narzędzie wewnętrznie zamienia ten moment na UTC, a potem pokazuje odpowiadający mu czas lokalny w drugiej strefie.
- Użyj `Now`, aby szybko wstawić bieżący czas, albo `Swap`, aby odwrócić porównanie. Offsety mogą się zmieniać w okolicach przejść na czas letni.

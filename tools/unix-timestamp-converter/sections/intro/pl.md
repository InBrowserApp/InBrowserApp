## Konwersja znacznika czasu Unix na datę

Wklej znacznik czasu, aby zobaczyć datę i godzinę w strefie czasowej urządzenia, czas UTC, zapis ISO 8601 oraz różnicę względem bieżącej chwili. Na przykład `1704067200` sekund i `1704067200000` milisekund dają ten sam wynik ISO 8601, `2024-01-01T00:00:00.000Z`.

## Konwersja daty na znacznik czasu Unix

Zmień wartość w polu **Data i Czas**, aby przeliczyć lokalną datę i godzinę na znacznik czasu w wybranej jednostce. Kliknij **Teraz**, aby uzyskać bieżący znacznik czasu. Gdy w dziennikach lub w API potrzebujesz jednoznacznego czasu UTC, użyj zapisu ISO 8601 zakończonego znakiem `Z`.

## Wybór sekund, milisekund lub nanosekund

Znaczniki czasu Unix odmierzają czas od 1 stycznia 1970 roku, od godziny 00:00:00 UTC. Opcja **Auto** interpretuje wartości do 10 cyfr jako sekundy, od 11 do 13 cyfr jako milisekundy, a dłuższe jako nanosekundy. Wybierz jednostkę ręcznie, jeśli znasz format źródłowy, zwłaszcza przy starszych datach zapisanych w milisekundach lub gdy wyświetlana data wygląda nieprawidłowo. Data jest wyświetlana z dokładnością do milisekundy.

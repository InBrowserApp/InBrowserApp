# Twórz pliki kalendarza bez opuszczania przeglądarki

To narzędzie generuje standardowe pliki wydarzeń `.ics` bezpośrednio w przeglądarce. Możesz definiować wydarzenia godzinowe lub całodniowe, wybrać strategię strefy czasowej, dodać przypomnienia i wyeksportować gotowy wpis kalendarza bez synchronizacji danych z serwerem.

## Dlaczego warto

- Sprawdza się wtedy, gdy potrzebujesz tylko pliku kalendarza, a nie pełnego przepływu z kontem kalendarza.
- Pozwala trzymać wrażliwe harmonogramy lokalnie, a jednocześnie tworzy standardowy załącznik wydarzenia.
- Umożliwia dopracowanie reguł cykliczności i przypomnień przed pobraniem końcowego pliku `.ics`.

## Sugerowany przepływ

1. Wpisz podsumowanie wydarzenia, lokalizację, notatki i opcjonalny adres URL odniesienia.
2. Wybierz zakres wydarzenia, a następnie zdecyduj, czy eksportować znaczniki czasu `UTC`, czy zachować oryginalną strefę czasową przy użyciu `TZID`.
3. Dodawaj reguły cykliczności i przypomnienia tylko wtedy, gdy są potrzebne, po czym pobierz plik i dołącz go tam, gdzie udostępniasz wydarzenie.

## Uwagi

- Wyjście `UTC` jest zwykle najbezpieczniejszym wyborem, jeśli zależy Ci na szerokiej zgodności kalendarzy.
- Wyjście `TZID` zachowuje oryginalny kontekst planowania dla klientów, które rozumieją nazwane strefy czasowe.
- W przypadku wydarzeń całodniowych formularz zachowuje końcową datę jako włączną, chociaż plik ICS zapisuje ją jako datę końcową wyłączną.

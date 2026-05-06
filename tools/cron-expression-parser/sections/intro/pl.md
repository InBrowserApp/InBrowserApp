## Zrozum harmonogramy cron przed wdrożeniem

Wyrażenia cron są zwięzłe, ale drobna pomyłka w polu może uruchamiać zadanie znacznie częściej albo znacznie rzadziej, niż zamierzono. Ten parser waliduje wyrażenie w przeglądarce, objaśnia harmonogram prostym językiem, rozbija każde pole i pokazuje podgląd nadchodzących czasów uruchomień.

### Kiedy go używać

- Sprawdź harmonogram wdrożenia, kopii zapasowej, czyszczenia albo powiadomień, zanim dodasz go do serwera, systemu CI lub narzędzia do uruchamiania zadań.
- Porównaj skopiowane wyrażenie cron z harmonogramem, którego naprawdę oczekujesz.
- Ucz się albo diagnozuj składnię cron, zmieniając po jednym polu i obserwując aktualizowane objaśnienie.

### Obsługiwany format

Narzędzie obsługuje standardowe pięciopolowe uniksowe wyrażenia cron: minutę, godzinę, dzień miesiąca, miesiąc i dzień tygodnia. Przyjmuje też sześciopolowe wyrażenie z sekundami na początku dla systemów planowania zadań, które obsługują precyzję do sekundy.

### Jak czytać wynik

Podsumowanie podaje opis prostym językiem, a tabela pól pokazuje, jak surowe wyrażenie jest dzielone. Nadchodzące czasy uruchomień używają lokalnej strefy czasowej przeglądarki, więc porównaj je ze strefą czasową używaną przez system planowania zadań, który uruchomi zadanie.

### Uwagi

- Wartości dnia tygodnia często używają `0` albo `7` dla niedzieli; akceptowane są też nazwy takie jak `MON` albo `FRI`.
- Nazwy miesięcy, takie jak `JAN` albo `DEC`, mogą ułatwić przegląd harmonogramów produkcyjnych.
- Jeśli Twój system planowania zadań używa innego dialektu cron, potwierdź tokeny specjalne takie jak `?`, `L`, `W` albo `#` w jego dokumentacji.

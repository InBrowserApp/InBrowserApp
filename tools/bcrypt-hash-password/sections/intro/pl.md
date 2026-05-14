## Czym jest bcrypt?

bcrypt to algorytm haszowania haseł zaprojektowany do przechowywania haseł. Łączy hasło z losową solą i powtarza kosztowne obliczenia zgodnie ze współczynnikiem kosztu, dzięki czemu atakujący potrzebują więcej czasu na sprawdzenie każdej próby.

## Kiedy używać tego narzędzia

- Wygeneruj hash bcrypt dla konta testowego, skryptu inicjalizującego dane lub lokalnego środowiska deweloperskiego.
- Porównaj, jak różne współczynniki kosztu zmieniają format wyniku i czas działania.
- Utwórz hash gotowy do skopiowania bez wysyłania hasła na serwer.

## Jak wybrać współczynnik kosztu

Wyższe wartości kosztu są wolniejsze i zwykle bezpieczniejsze, ale sprawiają też, że każda próba logowania w aplikacji trwa dłużej. Koszt w okolicach 10-12 jest częsty w systemach interaktywnych; wyższe wartości mogą mieć sens w przepływach tylko dla administratorów albo o małym wolumenie. Przetestuj koszt na takim samym typie sprzętu, który będzie weryfikował hasło.

## O czym pamiętać

- Każdy wygenerowany hash używa nowej losowej soli, więc wynik zmienia się nawet wtedy, gdy hasło i koszt pozostają takie same.
- Przechowuj hash bcrypt, a nie oryginalne hasło.
- Używaj bcrypt do haseł, nie do sum kontrolnych plików, podpisów ani ogólnego haszowania.
- Dbaj, aby zachowanie podczas weryfikacji było stałe, i unikaj ujawniania, czy konto użytkownika istnieje.

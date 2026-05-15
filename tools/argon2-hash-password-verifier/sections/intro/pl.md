## Czym jest weryfikacja Argon2?

Weryfikacja Argon2 sprawdza, czy jawne hasło tworzy taki sam zakodowany hash Argon2, jaki zapisano wcześniej. Zakodowany hash zawiera wariant Argon2, parametry kosztu, sól i skrót, więc weryfikator może powtórzyć tę samą pracę bez osobnych ustawień.

## Kiedy używać tego narzędzia

- Potwierdzanie, że skopiowane hasło i zapisany hash Argon2 należą do siebie
- Debugowanie problemów z logowaniem lub migracją podczas przenoszenia rekordów haseł między systemami
- Sprawdzanie wariantu i parametrów kosztu wewnątrz zakodowanego hasha Argon2
- Testowanie hashy używających opcjonalnego sekretu po stronie serwera, często nazywanego pepper

## Jak weryfikować bezpiecznie

1. Wklej hasło, które chcesz sprawdzić.
2. Wklej pełny zakodowany hash, na przykład ciąg zaczynający się od `$argon2id$`.
3. Wpisz sekret tylko wtedy, gdy pierwotny hash został utworzony z jego użyciem.
4. Uruchom weryfikację i odczytaj wynik: zgodność, brak zgodności albo nieprawidłowy hash.

## Uwagi dotyczące bezpieczeństwa

Weryfikacja odbywa się lokalnie w przeglądarce, ale wklejone hasła i hashe mogą nadal pozostawać w pamięci przeglądarki, dopóki nie zresetujesz formularza albo nie zamkniesz karty. Unikaj używania danych produkcyjnych na współdzielonych urządzeniach. W nowych systemach przechowywania haseł Argon2id jest zwykle preferowanym wariantem Argon2, ponieważ równoważy odporność na ataki kanałami bocznymi i odporność na GPU.

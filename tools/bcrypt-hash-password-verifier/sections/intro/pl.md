## Co robi

Sprawdza, czy hasło w postaci zwykłego tekstu pasuje do hasha hasła bcrypt. Przydaje się podczas debugowania kodu logowania, sprawdzania zaimportowanych rekordów użytkowników albo potwierdzania, że migracja haseł zachowała zgodność hashy.

## Akceptowane dane wejściowe

Wklej standardowy hash bcrypt, taki jak `$2b$10$...`, i wpisz hasło, które chcesz przetestować. Weryfikator akceptuje prefiksy `$2a$`, `$2b$` i `$2y$` z wartościami kosztu od `04` do `31`.

## Jak odczytać wynik

Wynik zgodny oznacza, że bcrypt zaakceptował hasło dla tego hasha, wraz z solą i kosztem osadzonymi w ciągu hasha. Brak zgodności oznacza, że hasło nie przeszło weryfikacji; nie dowodzi to, że sam hash jest niebezpieczny. Błędy nieprawidłowego hasha zwykle oznaczają, że prefiks, koszt, długość lub znaki bcrypt base64 mają niepoprawny format.

## Uwagi dotyczące prywatności i bezpieczeństwa

- Weryfikacja działa lokalnie w przeglądarce.
- Hasła i hashe nie są przechowywane w pamięci local storage.
- bcrypt służy do przechowywania haseł, nie do tworzenia uniwersalnych sum kontrolnych plików.
- Używaj tego narzędzia do debugowania i walidacji, a nie jako jedynej metody audytu produkcyjnego systemu uwierzytelniania.

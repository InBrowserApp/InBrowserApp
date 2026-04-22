## Co to jest HMAC?

HMAC (kod uwierzytelniania wiadomości oparty na hashu) to mechanizm kryptograficzny, który łączy tajny klucz z funkcją hash w celu weryfikacji zarówno integralności danych, jak i autentyczności wiadomości.

**Jak to działa:**

1. Tajny klucz jest łączony z wiadomością
2. Funkcja hash (jak SHA-256) przetwarza połączone dane
3. Wynikiem jest kod uwierzytelniający o stałym rozmiarze

**Typowe przypadki użycia:**

- **Uwierzytelnianie API**: Podpisywanie żądań API w celu weryfikacji nadawcy
- **Tokeny JWT**: Używane w algorytmach HS256/HS384/HS512
- **Weryfikacja wiadomości**: Zapewnienie, że dane nie zostały zmanipulowane
- **Podpisy webhook**: Walidacja ładunków webhook

**Uwagi dotyczące bezpieczeństwa:**

- Zawsze używaj silnego, losowego tajnego klucza
- Zachowaj poufność swojego tajnego klucza
- SHA-256 lub wyższe jest zalecane dla nowych aplikacji
- SHA-1 jest uważany za słaby i powinien być unikany w zastosowaniach krytycznych dla bezpieczeństwa

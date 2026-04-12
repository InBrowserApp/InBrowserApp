## Czym jest kodowanie URL?

Kodowanie URL (nazywane także kodowaniem procentowym) to metoda konwersji znaków specjalnych do formatu, który może być bezpiecznie przesyłany przez internet. URL-e mogą zawierać tylko określone znaki, więc każdy niedozwolony znak musi być zakodowany.

**Jak to działa:**

- Znaki specjalne są konwertowane na `%` a następnie ich szesnastkowy kod ASCII
- Przykład: spacja staje się `%20`, `{'@'}` staje się `%40`
- Tylko litery (A-Z, a-z), cyfry (0-9) i niektóre symbole (- \_ . ~) nie wymagają kodowania

**Typowe przykłady:**

- Spacja → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Dlaczego jest potrzebne:**

- URL-e mają znaki zastrzeżone o specjalnych znaczeniach
- Zapewnia prawidłowe przesyłanie danych
- Zapobiega konfliktom ze strukturą URL
- Wymagane dla formularzy internetowych i wywołań API

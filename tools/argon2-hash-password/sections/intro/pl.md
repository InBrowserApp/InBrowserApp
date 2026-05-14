## Czym jest Argon2?

Argon2 to algorytm hashowania haseł zaprojektowany tak, aby offline'owe łamanie haseł było kosztowne. Łączy powtarzane obliczenia z konfigurowalnym kosztem pamięci, więc atakujący potrzebują zarówno czasu, jak i pamięci dla każdej próby odgadnięcia hasła.

**Dlaczego Argon2id jest zwykle domyślnym wyborem:**

- W większości systemów przechowywania haseł lepiej równoważy odporność na ataki bocznokanałowe i łamanie z użyciem GPU niż użycie Argon2i lub Argon2d
- Zakodowane dane wyjściowe przechowują algorytm, wersję, pamięć, liczbę iteracji, równoległość, sól i hash w jednym przenośnym ciągu
- Unikalna losowa sól zapobiega tworzeniu identycznych zapisanych hashy przez identyczne hasła
- Ustawienia pamięci i iteracji można zwiększać, gdy środowisko weryfikacji staje się szybsze

**Jak używać tego narzędzia:**

1. Wpisz hasło, które chcesz zahashować.
2. Zachowaj wygenerowaną sól albo utwórz nową losową sól.
3. Wybierz wariant Argon2 i dostosuj pamięć, iteracje, równoległość oraz długość hasha do systemu, który będzie weryfikować hash.
4. Wygeneruj zakodowany hash i zapisz cały ten ciąg w bazie danych swojej aplikacji.

**Uwagi dotyczące bezpieczeństwa:**

- Nie przechowuj ani nie loguj hasła w postaci jawnej.
- Używaj nowej losowej soli dla każdego hasła.
- Używaj opcjonalnego sekretu tylko wtedy, gdy Twój weryfikator także ma ten sam sekret; w przeciwnym razie hasha nie będzie można później zweryfikować.
- Preferuj najwyższe ustawienia pamięci i iteracji, które nadal utrzymują akceptowalne opóźnienie logowania dla rzeczywistych użytkowników.

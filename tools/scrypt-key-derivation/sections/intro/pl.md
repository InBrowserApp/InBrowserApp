## Czym jest scrypt?

scrypt to pamięciochłonna funkcja wyprowadzania klucza z hasła (KDF). Zamienia hasło i sól w deterministyczne bajty klucza, celowo zużywając czas procesora i pamięć, co sprawia, że masowe zgadywanie haseł jest droższe niż proste haszowanie.

**Kluczowe punkty:**

- Używa `N` (współczynnik kosztu), `r` (rozmiar bloku) i `p` (równoległość)
- Wyższe ustawienia `N` i `r` zwiększają koszt pamięci i obliczeń
- Tworzy ten sam wyprowadzony klucz tylko wtedy, gdy hasło, sól, parametry i długość wyjścia są zgodne

**Dobre praktyki:**

- Używaj unikalnej losowej soli dla każdego hasła lub sekretu
- Przechowuj `N`, `r`, `p`, format soli i długość wyjścia obok wyprowadzonego klucza
- Dostosuj parametry na najwolniejszym urządzeniu, które musisz obsługiwać, zanim użyjesz ich produkcyjnie

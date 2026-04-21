## Czym jest chmod?

`chmod` ("change mode") to polecenie Unix/Linux służące do zmiany uprawnień plików i katalogów. Ten kalkulator pozwala przechodzić między uprawnieniami liczbowymi, takimi jak `755`, uprawnieniami symbolicznymi, takimi jak `rwxr-xr-x`, oraz macierzą pól wyboru bez liczenia wszystkiego ręcznie.

## Jak działają uprawnienia liczbowe

Każda cyfra reprezentuje jedną rolę: właściciela, grupę i innych. W obrębie jednej cyfry `4` oznacza odczyt, `2` zapis, a `1` wykonanie. Dodaj te wartości, aby uzyskać potrzebne uprawnienie: `7 = rwx`, `6 = rw-`, `5 = r-x` i `4 = r--`. W przypadku katalogów bit wykonania oznacza także możliwość wejścia do katalogu.

## Typowe przykłady chmod

- `chmod 755 script.sh` daje właścicielowi pełny dostęp i pozwala wszystkim innym czytać oraz wykonywać plik.
- `chmod 644 notes.txt` pozwala właścicielowi nadal zapisywać plik, a innym tylko go odczytywać.
- `chmod 600 .env` to częsty wybór dla prywatnych sekretów, ponieważ tylko właściciel może czytać lub zapisywać.
- `chmod 775 shared-folder` przydaje się w katalogach zespołowych, gdy grupa także powinna móc tworzyć i modyfikować pliki.

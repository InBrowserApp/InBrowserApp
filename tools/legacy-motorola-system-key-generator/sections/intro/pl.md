## Czym jest klucz systemowy do starszych systemów Motorola?

Programowy klucz systemowy to plik `.KEY` używany przez zgodne oprogramowanie programujące Motorola do edycji chronionych ustawień systemu trankingowego. Ten generator odtwarza starszy format oparty na BatLabs dla podanego ID systemu. Klucz systemowy różni się od klucza szyfrowania łączności radiowej i sam w sobie nie zapewnia dostępu do sieci radiowej.

## Jak korzystać z tego generatora

1. Wprowadź ID systemu za pomocą 1–4 cyfr szesnastkowych (`0–9`, `A–F`), bez prefiksu `0x`. Małe litery są akceptowane, a krótsze identyfikatory są uzupełniane zerami z przodu: `ab` staje się `00AB`.
2. Sprawdź ID po normalizacji, nazwę pliku i podgląd szesnastkowy.
3. Pobierz binarny plik `.KEY` i wczytaj go do zgodnego, starszego oprogramowania programującego. Plik ma 27 bajtów; dla ID systemu `1234` powstaje plik `SYS01234.KEY`.

## Ograniczenia zgodności

To narzędzie korzysta z opublikowanego starszego formatu; zgodność zależy od oprogramowania programującego. Nie obsługuje ASTRO 25 Portable CPS (w tym XTS5000), APX CPS ani Advanced System Keys (ASK). Zgodność z referencyjnym formatem bajtowym nie potwierdza zgodności z konkretnym radiotelefonem ani wersją CPS.

## Prywatność

Generowanie, weryfikacja i podgląd plików odbywają się lokalnie w przeglądarce. ID systemu i wygenerowany klucz nie są wysyłane na serwer.

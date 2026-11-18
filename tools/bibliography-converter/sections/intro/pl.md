## Kiedy wybrać BibTeX, RIS lub CSL JSON?

Wybierz format, który można zaimportować w docelowym programie.

- **BibTeX (`.bib`)** to popularny wybór do projektów LaTeX w Overleaf lub w edytorze lokalnym.
- **RIS (`.ris`)** ułatwia przenoszenie pozycji bibliograficznych z bazy danych lub innego menedżera bibliografii do Zotero albo EndNote.
- **CSL JSON (`.json`)** zawiera uporządkowane dane bibliograficzne dla procesorów cytowań i innych narzędzi, które przyjmują dane Citation Style Language.

## Jak przekonwertować i sprawdzić pozycje bibliograficzne?

Wklej pozycje lub wybierz **Otwórz plik**. W polu **Format wejściowy** pozostaw opcję **Wykryj automatycznie**. Jeśli wykrywanie się nie powiedzie, wskaż format samodzielnie. Ustaw **Format wyjściowy**, wybierz **Konwertuj i sprawdź**, a następnie skopiuj wynik lub pobierz plik. Konwersja odbywa się w przeglądarce.

Na przykład otwórz plik RIS wyeksportowany z Zotero, wybierz BibTeX i pobierz plik `.bib` do projektu w Overleaf. Jeśli masz jedynie sformatowaną bibliografię skopiowaną z Worda, najpierw wyeksportuj pozycje z menedżera bibliografii, w którym powstała. Aby zaimportować przekonwertowany plik do Zotero, postępuj zgodnie z [instrukcją importu Zotero](https://www.zotero.org/support/kb/importing_standardized_formats).

## Co oznacza możliwy duplikat?

Raport grupuje pozycje o tym samym DOI, także gdy podano go jako link `doi.org`. Gdy brakuje DOI, narzędzie może też dopasować pozycje na podstawie tytułu, roku publikacji, nazwiska i inicjału imienia pierwszego autora. Numery pozycji odpowiadają ich kolejności w danych wejściowych. Wybierz **Wczytaj przykład**, aby zobaczyć, jak raport pokazuje dwie pozycje dotyczące tego samego artykułu. Sprawdź każdą grupę przed scaleniem jej pozycji w menedżerze bibliografii. Pobrany plik zawiera wszystkie pozycje.

## Które pola są przenoszone?

Podstawowe pola, takie jak tytuł, autorzy, rok publikacji i DOI, zwykle przenoszą się między formatami. Konwersja może pominąć pola niestandardowe, a nowo wygenerowany plik BibTeX może otrzymać inne klucze cytowań, aby uniknąć konfliktów. Zachowaj oryginalny plik eksportu, jeśli potrzebujesz tych danych. Aby sprawdzić duplikaty z zachowaniem oryginalnych pól, wybierz ten sam format wejściowy i wyjściowy.

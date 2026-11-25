## Jak normalizować tekst Unicode?

Wklej lub wpisz tekst w polu **Tekst źródłowy**, a następnie wybierz formę normalizacji. Wynik zmienia się na bieżąco podczas pisania i przy zmianie formy. Wybierz **Skopiuj wynik**, aby użyć znormalizowanego tekstu w innej aplikacji. Przekształcenie odbywa się w przeglądarce, a wpisany tekst pozostaje na Twoim urządzeniu.

## Którą formę normalizacji Unicode wybrać?

- **NFC (kompozycja kanoniczna)** to dobry wybór dla większości tekstów. Gdy istnieje gotowy znak złożony, NFC łączy literę i znak diakrytyczny w jeden punkt kodowy. W ten sposób można ujednolicić równoważne zapisy przed przechowywaniem lub porównywaniem tekstu.
- **NFD (dekompozycja kanoniczna)** rozkłada sekwencje na składniki kanoniczne, na przykład literę bazową i łączący znak diakrytyczny. Przydaje się do sprawdzania lub przetwarzania poszczególnych znaków.
- **NFKC (kompozycja zgodnościowa)** ujednolica również warianty zgodności, takie jak litery o pełnej szerokości i ligatury. Może ułatwić wyszukiwanie lub dopasowywanie tekstu, jeśli te różnice są nieistotne.
- **NFKD (dekompozycja zgodnościowa)** stosuje te same zamiany, pozostawiając wynik w postaci rozłożonej. Przydaje się to w analizie tekstu.

## Dlaczego znormalizowany tekst może wyglądać tak samo?

Literę **é** można zapisać jako `U+00E9` albo jako **e** i następujący po nim łączący akcent ostry (`U+0065 U+0301`). NFC daje pierwszy zapis, a NFD drugi. Otwórz **Porównaj punkty kodowe**, aby sprawdzić początek obu sekwencji, nawet gdy tekst wygląda identycznie.

Wybierz **Wypróbuj przykład**, aby zobaczyć także zmiany widoczne gołym okiem. W formie NFKC **ＡＢＣ ① ﬁ** zmienia się w **ABC 1 fi**. Forma NFC zachowuje te różnice.

## Kiedy normalizacja wpływa na znaczenie?

NFKC i NFKD mogą zatrzeć różnice w zapisie, takie jak indeks górny we wzorze lub okrąg wokół cyfry na liście. Wybierz NFC, jeśli mają znaczenie. Zmiana wielkości liter, usuwanie znaków diakrytycznych i konwersja między kodowaniami, takimi jak UTF-8 i UTF-16, to osobne operacje.

Więcej informacji znajdziesz w [aneksie do standardu Unicode o formach normalizacji](https://www.unicode.org/reports/tr15/).

## Wyświetl graf Graphviz DOT online

Wklej kod z pliku, skryptu lub dokumentacji w polu **Kod DOT**. Graf aktualizuje się podczas pisania. Użyj `digraph` i `->` dla krawędzi skierowanych albo `graph` i `--` dla nieskierowanych. Wbudowane przykłady pokazują, jak zapisywać w DOT zależności, sieci i klastry.

## Wybierz silnik układu Graphviz

Zacznij od `dot` w przypadku grafów warstwowych, na przykład grafu zależności kompilacji. Wypróbuj `neato` lub `fdp`, aby rozmieścić węzły sieci nieskierowanej, albo `sfdp` dla większych sieci. Wybierz `circo` dla układu kołowego, `twopi` dla drzewa w układzie promienistym, `osage` dla grafów z klastrami lub `patchwork` dla map drzewiastych. Kod DOT pozostaje w edytorze przy zmianie silnika.

## Odczytuj komunikaty o układzie i składni

Graphviz może zgłosić błąd, gdy operator krawędzi nie pasuje do typu grafu lub brakuje nawiasu klamrowego czy cudzysłowu. Sprawdź wiersz wskazany w komunikacie i wiersz powyżej. Graphviz może też wyświetlić graf z informacją o atrybutach, których nie udało się zastosować. Jeśli graf ma własny atrybut `layout`, Graphviz użyje wskazanego w nim silnika. Więcej informacji znajdziesz w [opisie języka DOT](https://graphviz.org/doc/info/lang.html) i [przewodniku po układach Graphviz](https://graphviz.org/docs/layouts/).

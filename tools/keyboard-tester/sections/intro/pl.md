## Jak sprawdzić klawiaturę

Wybierz **Rozpocznij test**, a następnie naciskaj i zwalniaj po kolei klawisze na fizycznej klawiaturze. Klawisz podświetla się, gdy go przytrzymujesz. Po zwolnieniu pozostaje na nim mała kropka. Sprawdź lewy i prawy Ctrl, Shift i Alt. Jeśli masz klawiaturę z blokiem numerycznym, sprawdź go osobno. Wybierz **Zresetuj**, aby usunąć oznaczenia i powtórzyć test.

## Jak sprawdzić kombinacje klawiszy, rollover i ghosting

Wypróbuj kombinację, której używasz w grze lub aplikacji. Przytrzymaj na przykład jednocześnie `W`, `A`, `Shift` i `Space`. W polu **Bieżąca kombinacja** powinny pojawić się wszystkie cztery klawisze. Pole **Maks. jednocześnie** pokazuje największą liczbę klawiszy wykrytych równocześnie przez przeglądarkę w tym teście, wliczając modyfikatory.

Rollover to zdolność klawiatury do rejestrowania wielu naciśnięć naraz. Jeśli klawisz działa po naciśnięciu osobno i znika w konkretnej kombinacji, klawiatura może blokować jego naciśnięcie. Jeśli na schemacie pojawi się klawisz, którego w ogóle nie naciskasz, może to być ghosting, czyli wykrycie pozornego naciśnięcia. Sprawdź dokładnie tę kombinację, z którą masz problem, ponieważ różne grupy klawiszy mogą zachowywać się inaczej. [Demonstracja ghostingu klawiatury firmy Microsoft](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Dlaczego klawisz nie jest wykrywany?

Wybierz ponownie **Rozpocznij test**, jeśli klikniesz poza obszarem testu lub opuścisz go klawiszem Tab albo Esc. Niektóre klawisze, takie jak Fn i wybrane klawisze multimedialne, obsługuje klawiatura lub system operacyjny. Skrót może też zostać przechwycony przez przeglądarkę, zanim dotrze do tej strony. Jeśli kilkakrotne naciśnięcie samego klawisza literowego nie daje rezultatu, wypróbuj go w innej aplikacji i sprawdź, czy problem się powtarza.

## Dlaczego podświetla się inny klawisz?

Schemat pokazuje położenie klawiszy pełnowymiarowej klawiatury ANSI. Przy francuskim układzie AZERTY naciśnięcie `A` może podświetlić `Q` na schemacie. Pole **Ostatni klawisz** pokazuje znak `a` z używanego układu obok kodu fizycznego klawisza `KeyQ`. Jeśli korzystasz z kompaktowej klawiatury, sprawdź klawisze, które faktycznie się na niej znajdują. [Przewodnik MDN po kodach fizycznych klawiszy](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)

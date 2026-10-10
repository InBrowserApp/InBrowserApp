## Eksportuj arkusz do przenośnego formatu

Otwórz lokalny plik .xlsx, .xlsm, .xltx lub .xltm albo upuść go w eksporterze. Wybierz arkusz według jego oryginalnej nazwy, także spośród ukrytych arkuszy, i wybierz CSV, TSV, JSON lub Markdown. Przejrzyj wynik, skopiuj go lub pobierz plik UTF-8 o nazwie utworzonej z nazw skoroszytu i arkusza. Zastąpienie lub zamknięcie pliku anuluje niezakończone operacje i usuwa poprzednie pliki do pobrania. Przeglądarka XLSX również udostępnia działanie „Eksportuj arkusz” dla bieżącego arkusza.

Domyślny zakres komórek to najmniejszy prostokąt zawierający zapisane wartości lub formuły. Puste komórki i wiersze wewnątrz tego prostokąta pozostają w wyniku. Możesz wpisać inny zakres, na przykład A1:D20, i wybrać „Zastosuj zakres”. Pusty arkusz daje pusty plik tekstowy lub pustą tablicę JSON, chyba że jawnie wybierzesz zakres.

## Wybierz sposób przedstawiania wartości i nagłówków

Tekst sformatowany stosuje obsługiwane formaty liczb, zachowując wyświetlane daty i formaty liczb z zerami wiodącymi tam, gdzie są dostępne. Formaty zależne od ustawień regionalnych mogą różnić się od Excela. Zapisane wartości zachowują liczby i wartości logiczne; daty pozostają numerami seryjnymi Excela bez przypisywania strefy czasowej. Komórki tekstowe zachowują tekst w obu trybach. Formuły wykorzystują zapisane wyniki bez przeliczania. Brak zapisanego wyniku oznacza pustą komórkę i powiadomienie w interfejsie. Błędy arkusza pozostają czytelnymi ciągami znaków, takimi jak #DIV/0!.

CSV i TSV ujmują w cudzysłowy pola zawierające separatory, cudzysłowy lub podziały wiersza. JSON jest tablicą tablic wierszy: pierwszy wiersz pozostaje w danych, powtarzające się lub puste nagłówki nie stają się kluczami obiektów, a puste komórki używają null. Markdown może potraktować pierwszy wiersz jako nagłówek lub dodać pusty nagłówek nad wszystkimi wierszami danych. Znaki Markdown, HTML, kreski pionowe i podziały wiersza w komórkach są zabezpieczane znakami ucieczki lub przedstawiane w bezpieczny sposób. Pobierane pliki używają UTF-8 bez znacznika kolejności bajtów; podczas importowania do innej aplikacji wybierz UTF-8.

## Przetwarzanie lokalne i zgodność

Skoroszyt pozostaje w tej przeglądarce i nie jest przesyłany na serwer ani zapisywany przez narzędzie. Makra, skrypty i zewnętrzne połączenia danych nie są uruchamiane ani odświeżane. Ukryte wiersze i kolumny są uwzględniane w wybranym zakresie. Scalone komórki nie są rozwijane do powtarzających się wartości. Wykresy, obrazy, komentarze i style skoroszytu nie są częścią tych formatów tekstowych.

Zaszyfrowane, uszkodzone i nieobsługiwane skoroszyty powodują wyświetlenie jasnego komunikatu o błędzie. Nie ma stałych limitów rozmiaru pliku ani liczby arkuszy, wierszy lub kolumn, ale duży eksport może przekroczyć dostępną pamięć przeglądarki. Narzędzie eksportuje zapisane dane; nie edytuje skoroszytu ani nie gwarantuje, że inny program do arkuszy kalkulacyjnych zinterpretuje pola zwykłego tekstu w ten sam sposób.

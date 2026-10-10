## Konwertuj tabele Numbers na arkusze Excel

Otwórz lub upuść lokalny plik Numbers, sprawdź zaimportowane komórki i pobierz skoroszyt XLSX. Każda tabela staje się osobnym arkuszem Excel w kolejności źródłowej. Lista mapowania pokazuje oryginalne nazwy arkuszy i tabel Numbers obok nazwy wynikowej. Nazwy są dostosowywane do reguł Excela dotyczących długości i znaków oraz pozostają unikalne.

Uwzględniane są teksty, w tym identyfikatory z zerami wiodącymi i znaki spoza alfabetu łacińskiego, liczby, wartości logiczne, daty i godziny, puste komórki, zapisane wyniki formuł oraz obsługiwane scalone komórki. Czas trwania jest zapisywany jako liczba dni. Użyj selektora arkuszy i nawigacji po komórkach, aby sprawdzić dane; okno podglądu nie ogranicza eksportu.

## Zapisane wartości i zgodność

Formuły są eksportowane jako zapisane wartości, a nie jako formuły. Przeglądarka nie oblicza brakujących wyników ani nie odświeża danych zewnętrznych. Komórki bez zapisanej wartości pozostają puste. Błędy Numbers stają się ogólnymi błędami arkusza kalkulacyjnego, więc pierwotna przyczyna błędu może nie zostać zachowana.

To narzędzie obsługuje archiwa Numbers w wersji 3 i nowszej, które parser potrafi odczytać. Starsze dokumenty XML, pliki zaszyfrowane hasłem, uszkodzone archiwa i nieobsługiwane funkcje powodują błąd. Wykresy, obrazy, pola tekstowe, rozmieszczenie tabel, interaktywne elementy sterujące i style nie są odtwarzane. Formaty liczb mogą się różnić. Po pobraniu sprawdź ważne skoroszyty w programie do arkuszy kalkulacyjnych.

## Przetwarzanie lokalne

Konwersja odbywa się w tej przeglądarce bez przesyłania dokumentu na serwer. Zastąpienie lub zamknięcie pliku usuwa poprzedni wynik gotowy do pobrania, a anulowanie zatrzymuje proces działający w tle. Nie ma stałego limitu rozmiaru pliku ani liczby arkuszy; duże dokumenty nadal zależą od dostępnej pamięci przeglądarki.

Aby przeglądać pliki Numbers i inne formaty arkuszy kalkulacyjnych, otwórz narzędzie [Przeglądarka arkuszy kalkulacyjnych](../xlsx-viewer/).

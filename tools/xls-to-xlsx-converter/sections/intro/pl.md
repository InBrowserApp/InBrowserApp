## Konwertuj starsze skoroszyty Excel w przeglądarce

Otwórz lub upuść lokalny plik XLS. Wybierz arkusz, sprawdź dane jego komórek i pobierz skoroszyt XLSX. Możesz poruszać się po podglądzie lub wpisać adres komórki w lewym górnym rogu, aby przejść do innego obszaru. Okno podglądu nie ogranicza eksportu: uwzględniane są wszystkie arkusze i ich zaimportowane komórki.

Nazwy i kolejność arkuszy, puste arkusze, stany ukrycia arkuszy, tekst, liczby, wartości logiczne, błędy arkusza, obsługiwane formaty liczb, scalone komórki, wysokości wierszy, szerokości kolumn oraz ukryte wiersze i kolumny są zachowywane w zakresie obsługiwanym przez parser pliku źródłowego. Identyfikatory tekstowe zachowują zera wiodące. Daty zachowują numery seryjne Excela i system dat skoroszytu.

## Formuły i zgodność

Obsługiwane wyrażenia formuł i ich zapisane wyniki są zachowywane. Przeglądarka nie przelicza formuł ani nie odświeża danych zewnętrznych. Formuła bez zapisanego wyniku jest oznaczona informacją w podglądzie; jej wyrażenie pozostaje w pliku wynikowym, aby program do arkuszy kalkulacyjnych mógł je obliczyć. Nieobsługiwane wyrażenia formuł lub odwołania zewnętrzne mogą nie zostać poprawnie zachowane podczas konwersji.

Jest to konwersja danych, a nie wierne odtworzenie wszystkich funkcji skoroszytu. Wykresy, obrazy, makra, funkcje tabel przestawnych i zaawansowane style nie są zachowywane. Podgląd nie odtwarza układu scalonych komórek ani formatowania. Sprawdź pobrany skoroszyt w programie do arkuszy kalkulacyjnych, szczególnie gdy formuły lub układ mają znaczenie. Arkusze makr, arkusze wykresów, pliki zaszyfrowane, pliki uszkodzone i pliki, którym jedynie zmieniono rozszerzenie na .xls, nie są obsługiwane.

## Przetwarzanie lokalne

Skoroszyt jest przetwarzany w tej przeglądarce bez przesyłania jego zawartości na serwer. Makra nie są uruchamiane, a zasoby wskazane przez łącza nie są pobierane. Zastąpienie lub zamknięcie skoroszytu usuwa wynik; anulowanie zatrzymuje konwersję. Nie ma stałego limitu rozmiaru pliku ani liczby arkuszy, jednak przetwarzanie dużych skoroszytów nadal zależy od dostępnej pamięci przeglądarki.

Aby przeglądać inne formaty arkuszy kalkulacyjnych, otwórz narzędzie [Przeglądarka arkuszy kalkulacyjnych](../xlsx-viewer/).

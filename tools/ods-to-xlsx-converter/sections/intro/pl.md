## Konwertuj arkusze OpenDocument na Excel

Otwórz lub upuść lokalny plik ODS, sprawdź jego komórki i pobierz skoroszyt XLSX. Uwzględniane są nazwy i kolejność arkuszy, ukryte arkusze, tekst, liczby, wartości logiczne, daty, zapisane wyniki formuł i scalone komórki. Puste arkusze i odstępy między komórkami są zachowywane. Okno podglądu nie ogranicza eksportowanych danych.

## Zapisane wartości i zgodność

Formuły są zastępowane zapisanymi wartościami, a nie formułami programu Excel. Brak zapisanych wyników jest zgłaszany, a odpowiadające im komórki pozostają puste. Przeglądarka nie przelicza formuł ani nie odświeża danych zewnętrznych. Wyniki będące błędami stają się ogólnymi błędami arkusza kalkulacyjnego. Tekst pozostaje tekstem, w tym identyfikatory z zerami wiodącymi, znaki spoza alfabetu łacińskiego i tekst zaczynający się od znaku równości.

Daty używają standardowego formatu daty i czasu; daty z określoną strefą czasową są przeliczane na UTC. Czas trwania pozostaje liczbą dni, a wartości procentowe używają podstawowego formatu procentowego. Wartości walutowe zachowują liczbę, bez oznaczenia waluty i oryginalnego formatowania. Style, wymiary wierszy i kolumn, wykresy, obrazy, komentarze, linki, makra i ustawienia skoroszytu nie są odtwarzane.

Zaszyfrowane pliki, nieprawidłowe archiwa, nieobsługiwane dane oraz wartości lub nazwy arkuszy przekraczające limity programu Excel powodują wyświetlenie jasnego komunikatu o błędzie. Ten konwerter nie przyjmuje plików Flat OpenDocument (.fods). Po pobraniu sprawdź ważne wyniki w swoim programie do arkuszy kalkulacyjnych.

## Przetwarzanie lokalne

Konwersja odbywa się w tej przeglądarce bez przesyłania dokumentu na serwer. Zastąpienie lub zamknięcie pliku usuwa poprzedni wynik przygotowany do pobrania; anulowanie zatrzymuje zadanie w tle. Nie ma stałego limitu rozmiaru pliku ani liczby arkuszy. To dostępna pamięć przeglądarki nadal decyduje, które skoroszyty można przetworzyć.

Aby przeglądać ODS i inne formaty arkuszy kalkulacyjnych, otwórz narzędzie [Przeglądarka arkuszy kalkulacyjnych](../xlsx-viewer/).

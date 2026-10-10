## Konwertuj skoroszyty Excel na OpenDocument

Otwórz lub upuść lokalny plik XLSX, sprawdź jego komórki i pobierz skoroszyt ODS. Uwzględniane są nazwy i kolejność arkuszy, puste i ukryte arkusze, pozycje komórek, tekst, liczby, wartości logiczne, daty i zapisane wyniki formuł. Okno podglądu nie ogranicza eksportowanych danych. Bardzo ukryte arkusze stają się zwykłymi ukrytymi arkuszami.

## Zapisane wartości i zgodność

Formuły są zastępowane zapisanymi wartościami. Brak zapisanych wyników jest zgłaszany, a odpowiadające im komórki pozostają puste. Przeglądarka nie przelicza formuł ani nie odświeża danych zewnętrznych. Wyniki będące błędami arkusza kalkulacyjnego stają się zwykłym tekstem. Identyfikatory z zerami wiodącymi, znaki spoza alfabetu łacińskiego i tekst zaczynający się od znaku równości pozostają tekstem.

Daty uwzględniają system dat 1900 lub 1904 skoroszytu i używają standardowego formatu daty i czasu. Godziny bez daty oraz czas trwania używają podstawowego formatu czasu trwania. Wartości procentowe i walutowe zachowują liczbę, bez oryginalnego formatowania i oznaczenia waluty. Fikcyjna data programu Excel, 29 lutego 1900 roku, oraz nieobsługiwane niestandardowe formaty dat powodują błąd zamiast przesunięcia daty.

Style, wymiary wierszy i kolumn, układ scalonych komórek, wykresy, obrazy, komentarze, linki, makra i ustawienia skoroszytu nie są odtwarzane. Zapisane wartości w scalonych obszarach pozostają w oryginalnych pozycjach komórek. Ten konwerter przyjmuje pliki XLSX, ale nie XLS, XLSB ani XLSM. Zaszyfrowane pliki, nieprawidłowe archiwa, nieobsługiwane typy arkuszy i dane, których nie można przedstawić w ODS, powodują wyświetlenie jasnego komunikatu o błędzie. Po pobraniu sprawdź ważne wyniki w swoim programie do arkuszy kalkulacyjnych.

## Przetwarzanie lokalne

Konwersja odbywa się w tej przeglądarce bez przesyłania dokumentu na serwer. Zastąpienie lub zamknięcie pliku usuwa poprzedni wynik przygotowany do pobrania; anulowanie zatrzymuje zadanie w tle. Nie ma stałego limitu rozmiaru pliku ani liczby arkuszy. To dostępna pamięć przeglądarki nadal decyduje, które skoroszyty można przetworzyć.

Aby przeglądać Excel i inne formaty arkuszy kalkulacyjnych, otwórz narzędzie [Przeglądarka arkuszy kalkulacyjnych](../xlsx-viewer/).

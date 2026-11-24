## Konwertuj arkusze kalkulacyjne do bazy SQLite

Dodaj jeden lub więcej plików CSV lub Excel (.xlsx albo .xls). Każdy plik CSV i każdy arkusz Excela zawierający dane trafia do osobnej tabeli w tej samej bazie. Sprawdź kolumny w podglądzie, w razie potrzeby zmień nazwy tabel i wybierz **Utwórz bazę SQLite**. Konwersja odbywa się w przeglądarce, a pliki pozostają na Twoim urządzeniu.

## Jak dane z arkusza trafiają do tabel

Domyślnie z pierwszego wiersza pobierane są nazwy kolumn. Aby zaimportować ten wiersz jako dane, w ustawieniach tabeli odznacz **Użyj pierwszego wiersza jako nagłówka**. Kolumny otrzymają automatyczne nazwy, takie jak `column_1`. Powtarzające się nazwy tabel lub kolumn otrzymują przyrostki numeryczne. Dzięki temu możesz dodać drugi plik o tej samej nazwie i zachować obie tabele.

Konwerter rozpoznaje kolumny liczbowe i zachowuje zera wiodące w identyfikatorach tekstowych, takich jak `00123`. Puste komórki otrzymują wartość SQL `NULL`. Daty z Excela, także te z godziną, są zapisywane jako tekst w formacie ISO. Dla komórek z formułami konwerter używa wyników zapisanych w skoroszycie. Jeśli wyniki trzeba zaktualizować, przelicz formuły w Excelu i zapisz skoroszyt przed importem.

## Wykonuj zapytania SQL

Wybierz **Otwórz w Przeglądarce SQLite**, aby przeglądać tabele i wykonywać zapytania. Możesz też pobrać plik `.sqlite` i otworzyć go w SQLite z poziomu wiersza poleceń, w Pythonie lub w innej aplikacji obsługującej SQLite. Na przykład przekonwertuj `orders.csv` i skoroszyt Excela z arkuszem o nazwie `customers`. Poniższe zapytanie zlicza zamówienia według klientów.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Aby dostosować przykład, użyj nazw tabel i kolumn widocznych we własnym podglądzie.

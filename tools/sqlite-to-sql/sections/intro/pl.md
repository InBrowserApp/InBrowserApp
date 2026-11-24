## Jak wyeksportować bazę SQLite do pliku SQL

Otwórz lub upuść plik bazy danych SQLite 3, np. `.db`, `.sqlite` lub `.sqlite3`. Narzędzie automatycznie utworzy zrzut SQL. Włącz opcję **Tylko schemat**, aby wyeksportować strukturę bez wierszy tabel. Następnie kliknij **Pobierz plik .sql**, aby zapisać pełny skrypt. Wypróbuj przykładową bazę, aby zobaczyć wynik.

## Co zawiera zrzut SQL bazy SQLite

Zrzut SQL to skrypt tekstowy, który pozwala odtworzyć bazę danych. Zawiera instrukcje `CREATE` dla tabel, indeksów, widoków i wyzwalaczy. Pełny eksport zawiera również instrukcje `INSERT` dla wierszy tabel. Taki plik ułatwia przeglądanie zmian schematu w Git, przechowywanie czytelnej kopii zapasowej i przenoszenie bazy do innego środowiska SQLite.

Plik źródłowy pozostaje na Twoim urządzeniu. Jeśli baza korzysta z dziennika WAL (write-ahead log), wyeksportuj jej samodzielną kopię. Użyj aplikacji źródłowej lub polecenia tworzenia kopii zapasowej w SQLite, aby uwzględnić zatwierdzone zmiany zapisane w dzienniku.

## Jak odtworzyć bazę ze zrzutu SQL

Aby zaimportować skrypt do nowej bazy SQLite, uruchom poniższe polecenie.

```sh
sqlite3 restored.sqlite < database.sql
```

Zastąp `database.sql` nazwą pobranego pliku. Skrypt używa składni SQLite. Jeśli baza korzysta z tabel wirtualnych lub rozszerzeń, przywróć ją w instalacji SQLite z odpowiednimi modułami.

Do przeglądania tabel i eksportu wyników zapytań do CSV lub JSON służy [Przeglądarka SQLite](../sqlite-viewer/). Aby utworzyć bazę z arkuszy, użyj narzędzia [Konwerter plików CSV i Excel do SQLite](../csv-excel-to-sqlite/).

## Czym jest SQL Formatter & Linter?

SQL Formatter & Linter formatuje zapytania SQL w przeglądarce i jednocześnie sprawdza je pod kątem niewielkiego zestawu problemów o wysokiej wartości sygnału. Przydaje się, gdy chcesz uzyskać czytelniejszy układ zapytania, spójną wielkość liter słów kluczowych i szybki feedback o ryzykownych wzorcach, takich jak `SELECT *` albo instrukcje `UPDATE` bez klauzuli `WHERE`.

## Kiedy Warto Go Używać?

Użyj tego narzędzia, gdy przeglądasz ręcznie napisane SQL, porządkujesz wklejone zapytania przed udostępnieniem albo porównujesz formatowanie między różnymi dialektami SQL. Dobrze sprawdza się przy doraźnym sprawdzaniu zapytań, porządkowaniu pull requestów i formatowaniu wyłącznie w przeglądarce, bez wysyłania SQL na serwer.

## Co Sprawdza?

Ten rewrite utrzymuje formatter i linter jako osobne, ale skoordynowane części. Formatowanie korzysta z `sql-formatter` i opcji układu uwzględniających dialekt, a lintowanie wykrywa błędy parsowania, brakujące średniki, szerokie użycie `SELECT *`, niebezpieczne modyfikacje, długie wiersze oraz rozbieżności w wielkości liter słów kluczowych.

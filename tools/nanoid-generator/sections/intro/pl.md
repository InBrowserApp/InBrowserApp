## Czym jest NanoID?

NanoID to kompaktowy generator unikalnych identyfikatorów bezpiecznych dla URL, zaprojektowany z myślą o nowoczesnych aplikacjach webowych, API i narzędziach wewnętrznych. Domyślny format używa 21 znaków z alfabetu liczącego 64 znaki, co daje około 126 bitów losowości, a jednocześnie pozostaje wystarczająco krótkie dla adresów URL, nazw plików i danych testowych.

Całość działa lokalnie w Twojej przeglądarce. Własny alfabet i wygenerowane identyfikatory nie opuszczają strony, dlatego narzędzie sprawdza się przy szybkim prototypowaniu, tworzeniu fixture'ów i jednorazowych zadaniach operacyjnych.

**Najważniejsze informacje:**

- **Bezpieczny dla URL**: używa A-Z, a-z, 0-9, - i \_.
- **Konfigurowalny**: możesz dopasować długość i alfabet do swoich ograniczeń.
- **Bezpieczna losowość**: używa kryptograficznie bezpiecznych wartości losowych w przeglądarce.
- **Eksport do zwykłego tekstu**: skopiuj lub pobierz bieżącą partię, gdy potrzebujesz danych startowych, treści demo albo list gotowych do importu.

**Praktyczne wskazówki:**

- Zachowaj domyślną długość 21 znaków, jeśli potrzebujesz solidnego, uniwersalnego identyfikatora o bardzo małym ryzyku kolizji.
- Krótsze ID są w porządku dla tymczasowych tokenów UI albo lokalnych danych mock, ale ryzyko kolizji rośnie wraz ze skracaniem długości lub zwiększaniem rozmiaru partii.
- Większy alfabet daje więcej entropii na znak, więc często można skrócić identyfikatory bez dużej utraty unikalności.
- Niestandardowe alfabety powinny zawierać wyłącznie unikalne znaki. Duplikaty zaburzają rozkład, dlatego to narzędzie blokuje je przed wygenerowaniem wyniku.

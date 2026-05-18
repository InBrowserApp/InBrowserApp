## Czym jest Nil UUID?

Nil UUID to znormalizowany UUID, którego 128 bitów ma wartość zero. Jego kanoniczna forma tekstowa to `00000000-0000-0000-0000-000000000000` i często oznacza, że "nie przypisano jeszcze żadnego UUID".

## Kiedy go używać

Użyj nil UUID, gdy API, kolumna bazy danych, fixture albo plik konfiguracyjny wymaga wartości o kształcie UUID, ale rzeczywisty identyfikator celowo nie istnieje. Przydaje się jako symbol zastępczy w testach, szablonach importu, skryptach migracji i protokołach, które definiują jawną pustą wartość UUID.

## Na co uważać

Nie traktuj nil UUID jako wygenerowanego unikalnego identyfikatora. Za każdym razem jest to ta sama wartość, więc zapisanie jej tam, gdzie oczekiwany jest prawdziwy identyfikator obiektu, może ukryć brakujące dane, naruszyć założenia o unikalności albo sprawić, że rekordy będą wyglądały na powiązane, choć takie nie są.

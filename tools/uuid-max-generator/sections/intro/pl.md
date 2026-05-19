## Czym jest Max UUID?

Max UUID to standaryzowany UUID, którego wszystkie 128 bitów jest ustawionych na jeden. Jego kanoniczna postać tekstowa to `ffffffff-ffff-ffff-ffff-ffffffffffff` i często oznacza najwyższą możliwą wartość UUID.

## Kiedy go używać

Używaj Max UUID, gdy API, zapytanie do bazy danych, fixture albo kontrola zakresu potrzebuje górnej granicy lub wartości wartownika w kształcie UUID. Przydaje się w testach, skryptach migracyjnych, kursorach paginacji i protokołach definiujących jawną maksymalną wartość UUID.

## Na co uważać

Nie traktuj Max UUID jako wygenerowanego unikatowego identyfikatora. Za każdym razem jest to ta sama wartość, więc zapisanie jej tam, gdzie oczekiwane jest prawdziwe ID obiektu, może ukryć logikę wartownika, złamać założenia o unikatowości albo sprawić, że rekordy nieoczekiwanie posortują się na końcu.

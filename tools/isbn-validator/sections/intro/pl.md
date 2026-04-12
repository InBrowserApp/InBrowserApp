## Czym jest ISBN?

ISBN (International Standard Book Number) to identyfikator książek i wydań.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Sprawdzenie ISBN-10

ISBN-10 ma 9 cyfr danych i cyfrę kontrolną (X oznacza 10).

1. Usuń myślniki i spacje
2. Pomnóż przez wagi od 10 do 2 i zsumuj
3. Cyfra kontrolna sprawia, że suma jest podzielna przez 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Sprawdzenie ISBN-13

ISBN-13 ma 12 cyfr danych i cyfrę kontrolną, zwykle zaczyna się od 978 lub 979.

1. Mnoż naprzemiennie przez 1 i 3
2. Zsumuj pierwsze 12 cyfr
3. Cyfra kontrolna sprawia, że suma jest wielokrotnością 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Poprawny ISBN-10 można zamienić na ISBN-13 z prefiksem 978; tylko ISBN-13 z 978 można zamienić z powrotem.

`9780306406157` -> `0306406152`

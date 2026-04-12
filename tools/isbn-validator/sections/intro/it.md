## Che cos'è l'ISBN?

ISBN (International Standard Book Number) è un identificatore di libri ed edizioni.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Verifica ISBN-10

ISBN-10 ha 9 cifre di dati e una cifra di controllo (X significa 10).

1. Rimuovi trattini e spazi
2. Moltiplica per pesi da 10 a 2 e somma
3. La cifra di controllo rende la somma divisibile per 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Verifica ISBN-13

ISBN-13 ha 12 cifre di dati e una cifra di controllo, di solito inizia con 978 o 979.

1. Moltiplica alternando per 1 e 3
2. Somma le prime 12 cifre
3. La cifra di controllo rende la somma un multiplo di 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Un ISBN-10 valido si converte in ISBN-13 con prefisso 978; solo ISBN-13 con 978 può tornare indietro.

`9780306406157` -> `0306406152`

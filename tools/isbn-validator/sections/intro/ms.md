## Apakah ISBN?

ISBN (International Standard Book Number) ialah pengecam untuk buku dan edisi.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Pemeriksaan ISBN-10

ISBN-10 mempunyai 9 digit data dan satu digit semakan (X bermaksud 10).

1. Buang tanda sempang dan ruang
2. Darab dengan berat 10 hingga 2 dan jumlahkan
3. Digit semakan menjadikan jumlah boleh dibahagi dengan 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Pemeriksaan ISBN-13

ISBN-13 mempunyai 12 digit data dan satu digit semakan, biasanya bermula dengan 978 atau 979.

1. Darab secara berselang dengan 1 dan 3
2. Jumlahkan 12 digit pertama
3. Digit semakan menjadikan jumlah gandaan 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

ISBN-10 yang sah menjadi ISBN-13 dengan awalan 978; hanya ISBN-13 dengan 978 boleh ditukar semula.

`9780306406157` -> `0306406152`

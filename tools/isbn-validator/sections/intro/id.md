## Apa itu ISBN?

ISBN (International Standard Book Number) adalah pengenal untuk buku dan edisi.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Pemeriksaan ISBN-10

ISBN-10 memiliki 9 digit data dan satu digit pemeriksa (X berarti 10).

1. Hapus tanda hubung dan spasi
2. Kalikan dengan bobot 10 hingga 2 lalu jumlahkan
3. Digit pemeriksa membuat jumlah habis dibagi 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Pemeriksaan ISBN-13

ISBN-13 memiliki 12 digit data dan satu digit pemeriksa, biasanya diawali 978 atau 979.

1. Kalikan bergantian dengan 1 dan 3
2. Jumlahkan 12 digit pertama
3. Digit pemeriksa membuat jumlah menjadi kelipatan 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

ISBN-10 yang valid menjadi ISBN-13 dengan prefiks 978; hanya ISBN-13 dengan 978 yang dapat dikonversi kembali.

`9780306406157` -> `0306406152`

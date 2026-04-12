## Wat is ISBN?

ISBN (International Standard Book Number) is een identificatie voor boeken en edities.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### ISBN-10-controle

ISBN-10 heeft 9 datacijfers en een controlecijfer (X betekent 10).

1. Verwijder koppeltekens en spaties
2. Vermenigvuldig met gewichten van 10 tot 2 en tel op
3. Het controlecijfer maakt de som deelbaar door 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### ISBN-13-controle

ISBN-13 heeft 12 datacijfers en een controlecijfer, meestal beginnend met 978 of 979.

1. Vermenigvuldig afwisselend met 1 en 3
2. Tel de eerste 12 cijfers op
3. Het controlecijfer maakt de som een veelvoud van 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Een geldig ISBN-10 wordt ISBN-13 met prefix 978; alleen ISBN-13 met 978 kan terug.

`9780306406157` -> `0306406152`

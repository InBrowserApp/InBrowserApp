## What is ISBN?

ISBN (International Standard Book Number) is an identifier for books and editions.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### ISBN-10 Check

ISBN-10 has 9 data digits plus a check digit (X means 10).

1. Remove hyphens and spaces
2. Multiply digits by weights 10 to 2 and sum
3. The check digit makes the total divisible by 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### ISBN-13 Check

ISBN-13 has 12 data digits plus a check digit, usually starting with 978 or 979.

1. Multiply digits alternately by 1 and 3
2. Sum the first 12 digits
3. The check digit makes the total a multiple of 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Valid ISBN-10 converts to ISBN-13 with prefix 978; only ISBN-13 with 978 converts back.

`9780306406157` -> `0306406152`

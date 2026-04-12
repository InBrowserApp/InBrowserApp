## Hva er ISBN?

ISBN (International Standard Book Number) er en identifikator for bøker og utgaver.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### ISBN-10-sjekk

ISBN-10 har 9 datasifre og et kontrollsiffer (X betyr 10).

1. Fjern bindestreker og mellomrom
2. Multipliser med vekter 10 til 2 og summer
3. Kontrollsifferet gjør summen delelig med 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### ISBN-13-sjekk

ISBN-13 har 12 datasifre og et kontrollsiffer, vanligvis med 978 eller 979.

1. Multipliser annenhver med 1 og 3
2. Summer de første 12 sifrene
3. Kontrollsifferet gjør summen til et multiplum av 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Gyldig ISBN-10 blir ISBN-13 med prefiks 978; bare ISBN-13 med 978 kan konverteres tilbake.

`9780306406157` -> `0306406152`

## Vad är ISBN?

ISBN (International Standard Book Number) är en identifierare för böcker och utgåvor.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### ISBN-10-kontroll

ISBN-10 har 9 datasiffror och en kontrollsiffra (X betyder 10).

1. Ta bort bindestreck och mellanslag
2. Multiplicera med vikter 10 till 2 och summera
3. Kontrollsiffran gör summan delbar med 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### ISBN-13-kontroll

ISBN-13 har 12 datasiffror och en kontrollsiffra, ofta med 978 eller 979.

1. Multiplicera växelvis med 1 och 3
2. Summera de första 12 siffrorna
3. Kontrollsiffran gör summan till en multipel av 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Giltigt ISBN-10 blir ISBN-13 med prefix 978; endast ISBN-13 med 978 kan konverteras tillbaka.

`9780306406157` -> `0306406152`

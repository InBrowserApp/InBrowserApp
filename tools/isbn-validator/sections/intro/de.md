## Was ist ISBN?

ISBN (International Standard Book Number) ist eine Kennung für Bücher und Ausgaben.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### ISBN-10-Prüfung

ISBN-10 hat 9 Datensiffern und eine Prüfziffer (X bedeutet 10).

1. Bindestriche und Leerzeichen entfernen
2. Mit Gewichten 10 bis 2 multiplizieren und summieren
3. Die Prüfziffer macht die Summe durch 11 teilbar

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### ISBN-13-Prüfung

ISBN-13 hat 12 Datensiffern und eine Prüfziffer, beginnt normalerweise mit 978 oder 979.

1. Abwechselnd mit 1 und 3 multiplizieren
2. Die ersten 12 Ziffern summieren
3. Die Prüfziffer macht die Summe zu einem Vielfachen von 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Gültiges ISBN-10 wird mit Präfix 978 zu ISBN-13; nur ISBN-13 mit 978 ist rückkonvertierbar.

`9780306406157` -> `0306406152`

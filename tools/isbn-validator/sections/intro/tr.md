## ISBN nedir?

ISBN (International Standard Book Number) kitaplar ve baskılar için bir tanımlayıcıdır.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### ISBN-10 Kontrolü

ISBN-10, 9 veri rakamı ve bir kontrol basamağı içerir (X 10 anlamına gelir).

1. Tire ve boşlukları kaldırın
2. 10'dan 2'ye ağırlıklarla çarpıp toplayın
3. Kontrol basamağı toplamı 11'in katı yapar

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### ISBN-13 Kontrolü

ISBN-13, 12 veri rakamı ve bir kontrol basamağı içerir; genellikle 978 veya 979 ile başlar.

1. 1 ve 3 ile dönüşümlü çarpın
2. İlk 12 rakamı toplayın
3. Kontrol basamağı toplamı 10'un katı yapar

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Geçerli ISBN-10, 978 önekiyle ISBN-13'e çevrilir; yalnızca 978 ile başlayan ISBN-13 geri çevrilebilir.

`9780306406157` -> `0306406152`

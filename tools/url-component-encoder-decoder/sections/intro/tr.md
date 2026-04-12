## URL kodlaması nedir?

URL kodlaması (yüzde kodlaması olarak da adlandırılır) özel karakterleri internet üzerinden güvenle iletilebilecek bir formata dönüştürme yöntemidir. URL'ler yalnızca belirli karakterleri içerebilir, bu nedenle izin verilmeyen herhangi bir karakter kodlanmalıdır.

**Nasıl çalışır:**

- Özel karakterler `%` ve ardından onaltılık ASCII kodlarına dönüştürülür
- Örnek: boşluk `%20` olur, `{'@'}` `%40` olur
- Sadece harfler (A-Z, a-z), sayılar (0-9) ve bazı semboller (- \_ . ~) kodlama gerektirmez

**Yaygın örnekler:**

- Boşluk → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Neden gerekli:**

- URL'lerin özel anlamları olan ayrılmış karakterleri vardır
- Verilerin doğru şekilde iletilmesini sağlar
- URL yapısıyla çakışmaları önler
- Web formları ve API çağrıları için gereklidir

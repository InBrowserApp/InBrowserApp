## Adler-32 nedir?

Adler-32, 32 bitlik bir değer (genellikle 8 hex karakter) üreten hızlı bir sağlama toplamı algoritmasıdır. Kriptografik güvenlik için değil, kazara oluşan hataları tespit etmek için tasarlanmıştır.

**Önemli noktalar:**

- **Hızlı ve deterministik**: Aynı girdi her zaman aynı çıktıyı verir
- **Bütünlük kontrolü**: Aktarım veya depolama bozulmalarını tespit etmekte faydalıdır
- **Kriptografik değildir**: Parola, imza veya kurcalama önleme için kullanılmamalıdır

**Yaygın kullanım alanları:**

- Dosya aktarım kontrolü
- Arşiv/paket doğrulaması
- Hafif bütünlük kontrolleri
